import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import image1 from '@/assets/Events/MDFDS.png';
import image2 from '@/assets/Events/coders-union.png';
import image3 from '@/assets/Events/competitions.png';
import image4 from '@/assets/Events/sessions.png';

interface ImageProps {
  src: string;
  alt: string;
  description: string;
}

export const EventGallery = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(true);

  useEffect(() => {
    const loadedImages = [
      { src: image1, alt: 'MDFDS Event', description: 'Moroccan Days of Future Data Scientists: A hackathon where students gather to solve Moroccan society problems using AI.' },
      { src: image2, alt: 'Coders Union', description: 'An event where computer science schools in Rabat gather to exchange knowledge and collaborate on projects.' },
      { src: image3, alt: 'Coding Competitions', description: 'Exciting competitions where ESI students showcase their skills and innovative solutions.' },
      { src: image4, alt: 'Training Sessions', description: 'Regular training sessions to enhance skills and stay updated with the latest technologies.' },
    ];
    
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [images, isPlaying]);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNextSlide();
    if (e.key === 'ArrowLeft') goToPrevSlide();
  }, [goToNextSlide, goToPrevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section id="event-gallery" className="container py-12">
      <h2 className="text-2xl sm:text-2xl md:text-4xl font-bold mb-6 text-center">
        Our
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Activities{" "}
        </span>
        Gallery
      </h2>
      <div className="relative w-full pb-[40%] overflow-hidden rounded-lg shadow-lg">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Card className="w-full h-full">
              <CardContent className="p-0 h-full relative">
                <img
                  src={images[currentIndex]?.src}
                  alt={images[currentIndex]?.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{images[currentIndex]?.alt}</h3>
                  <p className="text-sm sm:text-base">{images[currentIndex]?.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={goToPrevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === currentIndex ? "bg-primary" : "bg-gray-300"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};