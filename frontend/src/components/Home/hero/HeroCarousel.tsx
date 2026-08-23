'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BANNER_IMAGES } from '@/data';

export default function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="w-full relative overflow-hidden bg-slate-950 select-none group border-b border-slate-200">
      {/* 100% Full-Width Embla Carousel Viewport */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex w-full">
          {BANNER_IMAGES.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[660px] flex items-center justify-center bg-slate-950"
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                sizes="100vw"
                priority
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev Navigation Arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/45 hover:bg-[#E11D48] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-2xl opacity-75 group-hover:opacity-100 hover:scale-105 active:scale-95"
        aria-label="Previous Banner"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next Navigation Arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/45 hover:bg-[#E11D48] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer z-20 shadow-2xl opacity-75 group-hover:opacity-100 hover:scale-105 active:scale-95"
        aria-label="Next Banner"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-5 sm:bottom-7 inset-x-0 flex justify-center items-center gap-1.5 sm:gap-2 z-20 px-4 flex-wrap">
        {BANNER_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              selectedIndex === idx ? 'w-7 sm:w-9 bg-[#E11D48]' : 'w-2 sm:w-2.5 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
