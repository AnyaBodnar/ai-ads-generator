import axios from "axios";
import * as cheerio from "cheerio";
import { GENERATE_SCRIPT_PROMPT } from "@/services/Prompt";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function normalizeText(value) {
    return value
        ?.replace(/\s+/g, " ")
        ?.trim() || "";
}

function makeAbsoluteUrl(value, baseUrl) {
    if (!value) return "";

    try {
        return new URL(value, baseUrl).toString();
    } catch {
        return value;
    }
}

function findProductJsonLd(data) {
    if (!data) return null;

    if (Array.isArray(data)) {
        for (const item of data) {
            const found = findProductJsonLd(item);
            if (found) return found;
        }
    }

    if (typeof data === "object") {
        if (data["@type"] === "Product" || data["@type"]?.includes?.("Product")) {
            return data;
        }

        if (data["@graph"]) {
            return findProductJsonLd(data["@graph"]);
        }
    }

    return null;
}

async function extractProductDataFromUrl(productUrl) {
    const response = await axios.get(productUrl, {
        timeout: 15000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept":
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const fallbackTitle = normalizeText(
        $('meta[property="og:title"]').attr("content") ||
        $("h1").first().text() ||
        $("title").text()
    );

    const fallbackDescription = normalizeText(
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        ""
    );

    const fallbackImage = makeAbsoluteUrl(
        $('meta[property="og:image"]').attr("content") || "",
        productUrl
    );

    let productJsonLd = null;

    $('script[type="application/ld+json"]').each((_, element) => {
        if (productJsonLd) return;

        try {
            const raw = $(element).text();
            const parsed = JSON.parse(raw);
            const found = findProductJsonLd(parsed);

            if (found) {
                productJsonLd = found;
            }
        } catch {
            // ignore invalid JSON-LD blocks
        }
    });

    let title = fallbackTitle;
    let description = fallbackDescription;
    let image = fallbackImage;
    let price = "";
    let currency = "";
    let brand = "";

    if (productJsonLd) {
        title = normalizeText(productJsonLd.name) || title;
        description = normalizeText(productJsonLd.description) || description;

        if (Array.isArray(productJsonLd.image)) {
            image = makeAbsoluteUrl(productJsonLd.image[0], productUrl) || image;
        } else {
            image = makeAbsoluteUrl(productJsonLd.image, productUrl) || image;
        }

        if (typeof productJsonLd.brand === "string") {
            brand = productJsonLd.brand;
        } else if (productJsonLd.brand?.name) {
            brand = productJsonLd.brand.name;
        }

        const offers = Array.isArray(productJsonLd.offers)
            ? productJsonLd.offers[0]
            : productJsonLd.offers;

        price = offers?.price || "";
        currency = offers?.priceCurrency || "";
    }

    return {
        url: productUrl,
        title,
        description,
        image,
        price,
        currency,
        brand,
    };
}

export async function POST(req) {
    try {
        const { topic } = await req.json();

        if (!topic || !topic.trim()) {
            return NextResponse.json(
                { error: "Topic or product URL is required" },
                { status: 400 }
            );
        }

        let finalTopic = topic.trim();

        if (isValidUrl(finalTopic)) {
            try {
                const productData = await extractProductDataFromUrl(finalTopic);

                finalTopic = `
The user provided a link to the product. The following data was obtained based on the product page:

Product URL: ${productData.url}
Product name: ${productData.title || "not found"}
Product description: ${productData.description || "not found"}
Brand: ${productData.brand || "not found"}
Price: ${productData.price || "not found"} ${productData.currency || ""}
Product image: ${productData.image || "not found"}

Generate advertising scripts based on this data. Don't invent characteristics that aren't in the product description.
`;
            } catch (error) {
                console.error("Product page parsing error:", error.message);

                finalTopic = `
User provided a link to the product: ${topic}

It was not possible to fully retrieve the data from the product page, so generate ad scripts based on the link itself and the general context of the product page. Don't invent specific features unless they are obvious from the URL.
`;
            }
        }

        const PROMPT = GENERATE_SCRIPT_PROMPT.replace("{topic}", finalTopic);

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: PROMPT,
                },
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        console.log(completion.choices[0].message);

        return NextResponse.json(completion.choices[0].message?.content);
    } catch (error) {
        console.error("Generate script error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                error: error.response?.data || error.message,
            },
            { status: error.response?.status || 500 }
        );
    }
}