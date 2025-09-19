import { useState, useEffect } from 'react';
import { motivationalQuotes } from '@/data/motivational-quotes';
import meditationImg from '@/assets/wellness-meditation.jpg';
import yogaImg from '@/assets/wellness-yoga.jpg';
import exerciseImg from '@/assets/wellness-exercise.jpg';
import lifestyleImg from '@/assets/wellness-lifestyle.jpg';

const images = [meditationImg, yogaImg, exerciseImg, lifestyleImg];

export function MotivationalSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = motivationalQuotes[currentIndex];
  const currentImage = images[currentIndex];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentImage}
          alt="Wellness illustration"
          className="h-full w-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/80" />
      </div>

      {/* Quote Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
        <blockquote className="max-w-2xl animate-fade-in">
          <p className="mb-4 text-xl font-medium text-white md:text-2xl lg:text-3xl">
            "{currentQuote.text}"
          </p>
          <footer className="text-sm text-white/90 md:text-base">
            — {currentQuote.author}
          </footer>
        </blockquote>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-white"
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}