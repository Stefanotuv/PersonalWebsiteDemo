// src/pages/Welcome.tsx
import React, {useEffect, useState} from "react"; // Removed useState, useEffect as they are no longer needed for the carousel part
import WipModal from './components/WipModal.tsx'; // Adjust path as needed

import Footer from "./layout/Footer.tsx"; // Adjust path if needed
import homepageVideo from '../../assets/videos/Bee.mov';
import FadeIn from "./components/FadeIn.tsx";
import {Helmet} from "react-helmet-async";


function NewWelcome() {
    // If no other loading/error exists, simplify these checks or remove the state variables entirely
    const loading = false; // Placeholder if no other async ops
    const error = null;    // Placeholder if no other error handling

    const [dynamicSettings, setDynamicSettings] = useState<Record<string, any> | null>(null);
    const showWipBanner = dynamicSettings?.wip_banner === true;
    const [loadingSettings, setLoadingSettings] = useState(true); // Overall loading for page content and essential configs
    const [errorSettings, setErrorSettings] = useState<string | null>(null); // Optional: display error state

    return (
        <div>
            <Helmet>
                <title>Project Good - Welcome</title>
                <meta name="description" content="Discover various causes you can support through Project Good." />
            </Helmet>
            {/*<WipModal duration={1000000} /> /!* Shows for 3 seconds *!/*/}
            {/* NEW: Conditional rendering of WipModal based on dynamic setting */}
            {/* The WipModal will only show if 'loading' is false AND 'showWipBanner' is true */}
            {!loadingSettings && showWipBanner && (
                <WipModal duration={100000000} />
            )}

            {/* Video Banner Hero Section */}
            {/* Use a div to contain the video and control its size */}
            {/* The styling here mimics the old carousel container but applies to the video */}
            <div className="w-[90%] h-[90%] mx-auto max-w-5xl mb-8 overflow-hidden rounded-xl shadow-md"> {/* Added margin-bottom for spacing below banner */}
                 {/* Display Loading/Error only if you have other async operations */}
                {loading && (
                     <div className="aspect-[16/9] flex items-center justify-center bg-gray-200 rounded-xl shadow-md animate-pulse">
                        <p className="text-gray-500">Loading Banner...</p> {/* Updated message */}
                     </div>
                 )}

                 {error && !loading && (
                     <div className="mb-2 p-2 text-xs text-center bg-red-100 text-red-800 rounded"> {/* Updated styling for general error */}
                         Error loading page: {error}
                    </div>
                 )}

                {/* Video Element */}
                {/* Only show video if not in a loading or major error state */}
                 {!loading && !error && (
                     <video
                         className="w-full h-full object-cover" // object-cover makes video fill container, cropping as needed
                         src={homepageVideo} // Use the imported video URL
                         autoPlay // Start playing automatically
                         loop // Loop the video playback
                         muted // Mute the video (often required for autoplay)
                         playsInline // Important for mobile browsers
                         // controls // Omit controls for a banner video
                     >
                         {/* Optional: Add source tags for other formats if available */}
                         {/* <source src="your-video.webm" type="video/webm" /> */}
                         {/* <source src="your-video.ogg" type="video/ogg" /> */}
                         Your browser does not support the video tag. {/* Fallback text */}
                     </video>
                 )}
            </div>

            {/* --- Rest of your Welcome page sections --- */}
            {/* ... (Text Section, Section 2, 3, 4 etc.) ... */}
             {/* Text Section */}
      <section className="py-12 px-4 max-w-screen-lg mx-auto text-center lg:text-left"> {/* Added padding, max-width, auto margin, and text alignment classes */}
          <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl"> {/* Adjusted margin and text size */}
              The world is a beautiful place, but not for its sceneries, but because of the <strong>People </strong>
          </h1>
          <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl"> {/* Adjusted margin and text size */}
                For the last decades, we have been taught to hate instead of love, to be suspicious
                rather than welcoming, to challenge rather than help.
          </h1>
          <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl"> {/* Adjusted margin and text size */}
                It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
                for our communities and beyond.
          </h1>
          <h1 className="text-stone-500 font-light text-lg md:text-xl lg:text-2xl"> {/* Adjusted margin and text size */}
                At Project Good we believe in one thing among all: Just Be Good
        </h1>
      </section>
{/* Section 2 - Text Left, Picture Right */}
      <section className="bg-gray-100 py-12 border-y border-gray-200"> {/* Added light grey background, vertical padding, subtle border */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4"> {/* Added padding, max-width, auto margin, alignment */}
            <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"> {/* Added flex basis and right padding for gap on large screens, margin bottom for mobile/tablet */}
              <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left"> {/* Adjusted text size, font weight, and alignment */}
               We have chosen to be Kind and be Good
              </h2>
              {/* Note: Combined the multiple h1 tags into one paragraph for better semantic structure and consistent styling */}
              <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left"> {/* Adjusted text size, color, font weight, and alignment */}
                The world is a beautiful place, but not for its sceneries, but because of the People.
                For the last decades, we have been thought to hate instead of love, to be suspicious
                rather than welcoming, to challenge rather than help.
                It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
                for our communities and beyond.
                At Project Good we believe in one thing among all: Just Be Good.
              </p>
            </div>
            <div className="flex justify-center lg:w-1/2"> {/* Added flex basis for equal width on large screens, centering */}
                <img
                    className="max-w-xs sm:max-w-sm lg:max-w-full h-auto" // Added max-width and height auto for responsiveness
                    src={BeeKind}
                    alt="Bee Kind Illustration" // Added alt text for accessibility
                />
            </div>
          </div>
        </FadeIn>
      </section>
   {/* Section 3 - Picture Left, Text Right */}
      <section className="bg-white py-12 border-b border-gray-200"> {/* Added white background, vertical padding, subtle border (no top border to separate from section 2) */}
        <FadeIn>
          {/* Used flex-row-reverse on large screens to swap order */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4"> {/* Added padding, max-width, auto margin, alignment */}
            <div className="flex justify-center lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"> {/* Added flex basis and right padding for gap on large screens, margin bottom for mobile/tablet */}
              <img
                  className="max-w-xs sm:max-w-sm lg:max-w-full h-auto" // Added max-width and height auto for responsiveness
                  src={BeeNice}
                  alt="Bee Nice Illustration" // Added alt text for accessibility
              />
            </div>
            <div className="lg:w-1/2"> {/* Added flex basis for equal width on large screens */}
              <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left"> {/* Adjusted text size, font weight, and alignment */}
                Spread Positivity
              </h2>
              {/* Note: Changed the text content as it was a placeholder from Netflix */}
              <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left"> {/* Adjusted text size, color, font weight, and alignment */}
                Join our community of positive change-makers. Share kindness, inspire others, and make a real difference in the world, one small act at a time.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Section 3 - Text Left, Picture Right */}
      <section className="bg-gray-100 py-12 border-y border-gray-200"> {/* Added light grey background, vertical padding, subtle border */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4"> {/* Added padding, max-width, auto margin, alignment */}
            <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"> {/* Added flex basis and right padding for gap on large screens, margin bottom for mobile/tablet */}
              <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left"> {/* Adjusted text size, font weight, and alignment */}
               We have chosen to be Kind and be Good
              </h2>
              {/* Note: Combined the multiple h1 tags into one paragraph for better semantic structure and consistent styling */}
              <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left"> {/* Adjusted text size, color, font weight, and alignment */}
                The world is a beautiful place, but not for its sceneries, but because of the People.
                For the last decades, we have been thought to hate instead of love, to be suspicious
                rather than welcoming, to challenge rather than help.
                It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
                for our communities and beyond.
                At Project Good we believe in one thing among all: Just Be Good.
              </p>
            </div>
            <div className="flex justify-center lg:w-1/2"> {/* Added flex basis for equal width on large screens, centering */}
                <img
                    className="max-w-xs sm:max-w-sm lg:max-w-full h-auto" // Added max-width and height auto for responsiveness
                    src={BeeGood}
                    alt="Bee Kind Illustration" // Added alt text for accessibility
                />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Section 34 - Picture Left, Text Right */}
      <section className="bg-white py-12 border-b border-gray-200"> {/* Added white background, vertical padding, subtle border (no top border to separate from section 2) */}
        <FadeIn>
          {/* Used flex-row-reverse on large screens to swap order */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4"> {/* Added padding, max-width, auto margin, alignment */}
            <div className="flex justify-center lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"> {/* Added flex basis and right padding for gap on large screens, margin bottom for mobile/tablet */}
              <img
                  className="max-w-xs sm:max-w-sm lg:max-w-full h-auto" // Added max-width and height auto for responsiveness
                  src={BeeFreak}
                  alt="Bee Nice Illustration" // Added alt text for accessibility
              />
            </div>
            <div className="lg:w-1/2"> {/* Added flex basis for equal width on large screens */}
              <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left"> {/* Adjusted text size, font weight, and alignment */}
                Spread Positivity
              </h2>
              {/* Note: Changed the text content as it was a placeholder from Netflix */}
              <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left"> {/* Adjusted text size, color, font weight, and alignment */}
                Join our community of positive change-makers. Share kindness, inspire others, and make a real difference in the world, one small act at a time.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Section 6 - Currently Empty */}
      <section className="py-12"></section> {/* Added some padding for potential future content */}

            <Footer />
        </div>
    );
}

export default NewWelcome;