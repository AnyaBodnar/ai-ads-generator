import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, CreateAvatar } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateAvatar,
  ],
});