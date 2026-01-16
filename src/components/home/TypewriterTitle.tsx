"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TypewriterTitle({ title }: { title?: string }) {
  const text = title || "root@portfolio: Hi, I'm Lakshan!";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100); 
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-xl md:text-5xl font-bold font-mono text-[#3ECF8E] mt-4 text-center tracking-tight">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[12px] h-[1em] bg-[#3ECF8E] ml-1 align-text-bottom"
      />
    </h1>
  );
}
