import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import image1 from '@/assets/Events/1.jpg';
import image2 from '@/assets/Events/2.jpg';
import image3 from '@/assets/Events/3.jpg';
import image4 from '@/assets/Events/4.jpg';

interface ImageProps {
  src: string;
  alt: string;
}

export const EventGallery = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadedImages = [
      { src: image1, alt: 'Event image 1' },
      { src: image2, alt: 'Event image 2' },
      { src: image3, alt: 'Event image 3' },
      { src: image4, alt: 'Event image 4' },
    ];
    
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section id="event-gallery" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Our
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Event{" "}
        </span>
        Gallery
      </h2>
      <div className="relative w-full h-full md:h-[500px] overflow-hidden">
        {images.map((image, index) => (
          <Card
            key={index}
            className={`absolute top-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? "left-0 opacity-100"
                : index === (currentIndex + 1) % images.length
                ? "left-full opacity-100"
                : "-left-full opacity-0"
            }`}
          >
            <CardContent className="p-0 h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};