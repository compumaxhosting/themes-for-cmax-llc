"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { slides } from "@/data/websites-data";

// Helper: Normalize category to always return string[]
const extractCategories = () =>
  Array.from(
    new Set(
      slides
        .flatMap((slide) =>
          Array.isArray(slide.category) ? slide.category : [slide.category]
        )
        .filter((cat): cat is string => typeof cat === "string")
    )
  );

// Fixed list categories
const liveSiteCategories = ["Live Sites USA", "Live Sites India"];
const rawCategories = extractCategories();
const categories: string[] = [
  "all",
  ...rawCategories.filter(
    (cat) => cat !== "all" && !liveSiteCategories.includes(cat)
  ),
  ...liveSiteCategories.filter((cat) => rawCategories.includes(cat)),
];

const SliderComponent = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, selectedCategory]);

  // Filter slides based on selected category
  const filteredSlides =
    selectedCategory === "all"
      ? slides
      : slides.filter((slide) =>
          Array.isArray(slide.category)
            ? slide.category.includes(selectedCategory)
            : slide.category === selectedCategory
        );

  return (
    <div className="container mx-auto font-forum p-4 sm:p-14 sm:pt-4">
      <h1 className="text-center text-6xl font-bold text-slate-950 dark:text-white py-10">
        Cmax Templates
      </h1>

      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={`cat-${category}`}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-lg rounded shadow-md transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {category
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative w-full h-[325px] mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex animate-fade-zoom">
            {filteredSlides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-full lg:w-1/3 px-4 transition-transform duration-500"
              >
                <div className="bg-transparent dark:bg-transparent hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden border dark:border-gray-700">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 pb-6 text-center bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-lg shadow-md border border-white/10 dark:border-black/20">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-wider">
                      {slide.title}
                    </h3>
                    <div className="mt-4 flex justify-center gap-2">
                      <Link href={slide.liveLink} target="_blank">
                        <button className="px-4 py-2 text-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded shadow-md">
                          Live Site Preview
                        </button>
                      </Link>
                      {slide.path && (
                        <Link href={slide.path} target="_blank">
                          <button className="px-4 py-2 text-lg text-blue-600 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded shadow-md">
                            Sample Preview
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={`absolute top-1/2 -left-4 lg:-left-12 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-md ${
            !prevBtnEnabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <ChevronLeft className="h-8 w-8 text-gray-800 dark:text-gray-100" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={`absolute top-1/2 -right-4 lg:-right-12 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-md ${
            !nextBtnEnabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <ChevronRight className="h-8 w-8 text-gray-800 dark:text-gray-100" />
        </button>
      </div>
    </div>
    
  );
};

export default SliderComponent;
