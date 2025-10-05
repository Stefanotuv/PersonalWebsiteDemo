// frontend/src/components/layout/RotatingBanner.tsx
import React from 'react';
import Marquee from 'react-fast-marquee'; // This component requires `react-fast-marquee` to be installed

interface RotatingBannerProps {
  messages: string[];
  speed?: number; // Optional speed prop in pixels per second
  gradient?: boolean; // Optional gradient effect at ends
  direction?: 'left' | 'right'; // Optional direction prop
  delay?: number; // Optional delay before animation starts (in seconds)
}

const RotatingBanner: React.FC<RotatingBannerProps> = ({ messages, speed = 50, gradient = true, direction = 'left', delay = 0 }) => {
  return (
    <div className="w-full bg-indigo-700 text-white py-2 overflow-hidden">
      <Marquee
        speed={speed}
        gradient={gradient}
        direction={direction}
        delay={delay}
        pauseOnHover // Pause the marquee on mouse hover
      >
        {messages.map((message, index) => (
          <span key={index} className="mx-8 text-lg font-medium whitespace-nowrap">
            {message}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default RotatingBanner;