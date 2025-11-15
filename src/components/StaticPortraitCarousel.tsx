import React, { useState, useEffect } from "react";

interface StaticPortraitCarouselProps {
  imageUrls?: string[];
}

// These URLs must be accessible from this component.
// You might need to pass them in from your .env file as props.
const STATIC_IMAGE_URLS = [
  `${import.meta.env.BASE_URL}images/portrait.png`,
  `${import.meta.env.BASE_URL}images/portrait-1.png`,
];

const StaticPortraitCarousel: React.FC<StaticPortraitCarouselProps> = ({
  imageUrls = STATIC_IMAGE_URLS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // This timer mimics your original "view time" of 7 seconds.
    // It cleanly transitions to the next image.
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 5000); // Change image every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  return (
    <div className="relative w-full h-auto" style={{ aspectRatio: "1 / 1" }}>
      {imageUrls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt="Portrait"
          className="absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
          }}
          // Preload images for a smoother transition
          loading="eager"
        />
      ))}
    </div>
  );
};

export default StaticPortraitCarousel;
