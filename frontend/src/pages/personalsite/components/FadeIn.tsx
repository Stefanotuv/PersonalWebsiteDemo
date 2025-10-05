// src/components/FadeIn.jsx

import React, { useState, useEffect } from 'react';
import clsx from 'clsx'; // Assuming you have clsx installed, makes class joining cleaner

/**
 * A simple component to add a fade-in animation on mount using CSS transitions.
 * Replace <Fade> from 'react-reveal' with <FadeIn>.
 * The CSS for the transition must be defined globally or imported.
 */
function FadeIn({ children, duration = 500, delay = 50, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set isVisible to true shortly after the component mounts.
    // A small delay helps ensure the initial opacity: 0 is applied before
    // the transition to opacity: 1 starts.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay); // Use passed-in delay

    // Cleanup the timer if the component unmounts before the timeout fires
    return () => clearTimeout(timer);
  }, [delay]); // Re-run effect if delay prop changes

  // Combine user-provided classes with our animation classes
  const finalClassName = clsx(
    className, // Allows consumer to add their own classes like margin, padding etc.
    'fade-in-transition',
    { 'is-visible': isVisible } // Add is-visible class when state is true
  );

  return (
    // Apply the classes and inline style for duration to the wrapper div
    <div
      className={finalClassName}
      style={{ transitionDuration: `${duration}ms` }} // Apply duration dynamically
    >
      {children} {/* Render the content passed inside <FadeIn> */}
    </div>
  );
}

export default FadeIn;