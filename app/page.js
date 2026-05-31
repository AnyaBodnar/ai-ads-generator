"use client"
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fadeInLeftRef = useRef(null);
  const fadeInRightRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Simple fade-in animations on load
    const fadeInLeftElement = fadeInLeftRef.current;
    const fadeInRightElement = fadeInRightRef.current;

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === fadeInLeftElement) {
            entry.target.classList.add('opacity-100', 'translate-x-0');
          } else if (entry.target === fadeInRightElement) {
            entry.target.classList.add('opacity-100', 'translate-x-0');
          }
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    if (fadeInLeftElement) {
      fadeInObserver.observe(fadeInLeftElement);
    }
    if (fadeInRightElement) {
      fadeInObserver.observe(fadeInRightElement);
    }

    // Clean up observer on component unmount
    return () => {
      if (fadeInLeftElement) {
        fadeInObserver.unobserve(fadeInLeftElement);
      }
      if (fadeInRightElement) {
        fadeInObserver.unobserve(fadeInRightElement);
      }
    };
  }, []); // Empty dependency array ensures this runs only once after initial render

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-8 text-[#4b4b4b]">
          Create AI Video Ads
          <br />
          for your products
        </h1>

        <Link href="/workspace">
          <Button className="text-white bg-[#4f46e4]  font-semibold rounded-lg text-base px-6 py-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer">
            Start program
          </Button>
        </Link>
      </div>
    </main>
  );
}
