"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261350/ChatGPT_Image_Jul_17_2026_09_35_17_AM_rm3tm4.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261349/ChatGPT_Image_Jul_17_2026_09_34_25_AM_uykjvr.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261349/ChatGPT_Image_Jul_17_2026_09_35_09_AM_evaylk.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261349/ChatGPT_Image_Jul_17_2026_09_34_43_AM_qqhjd7.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_01_AM_hytaga.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_31_AM_tvxx6x.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_40_AM_jnrzhz.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_23_AM_uhfmo8.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_53_AM_ck2z4y.png",
  "https://res.cloudinary.com/qxwpckyv/image/upload/v1784261348/ChatGPT_Image_Jul_17_2026_09_35_46_AM_cxoal7.png",
];

const SLIDE_DURATION = 4500; // 4.5 seconds
const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function HeroBackgroundSlider() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Wrap index to positive array bounds
  const currentIndex = ((page % IMAGES.length) + IMAGES.length) % IMAGES.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      paginate(1);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isHovered, paginate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  const variants = {
    enter: (dir: number) => ({
      x: reducedMotion ? 0 : dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: reducedMotion ? 0 : dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="hero-bg-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.8 }, // 800ms smooth fade
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }: PanInfo) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
              paginate(1);
            } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
              paginate(-1);
            }
          }}
          className="hero-bg-slide"
        >
          <div className={`hero-bg-zoom-wrapper ${!reducedMotion ? "animate-ken-burns" : ""}`}>
            <Image
              src={IMAGES[currentIndex]}
              alt=""
              fill
              className="hero-bg-img"
              sizes="100vw"
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? "eager" : "lazy"}
              quality={90}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        className="slider-nav-btn prev"
        onClick={() => paginate(-1)}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        className="slider-nav-btn next"
        onClick={() => paginate(1)}
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
