// frontend/src/pages/Welcome.tsx - REVISED LANDING PAGE WITH NEW CONTENT & ICON STYLING
import React, { useState, useEffect } from "react"; // Re-added useState and useEffect for typing effect
import { Helmet } from "react-helmet-async";
import RotatingBanner from "../personalsite/components/RotatingBanner";
import { SITE_OWNER_FULL_NAME, SITE_OWNER_TAGLINE_HERO, SITE_OWNER_DESCRIPTION_HERO } from './components/siteConfig.ts';


// Assuming these paths are correct in your copied project structure
import Footer from "../personalsite/layout/Footer"; // Path: src/components/layout/Footer.tsx
import FadeIn from "../personalsite/components/FadeIn";       // Path: src/components/FadeIn.tsx
// Placeholder for banner image (you'll replace this with your actual image later)
import BannerPlaceholder from "../personalsite/components/BannerPlaceholder"; // Create this component in layout/

// // Import the new content JSON
import welcomeContent from '../../data/welcomeContent.json'; // Path to your new content JSON

// Import all icons needed (Fa prefix)
import { FaLaptopCode, FaHandshake, FaBullhorn, FaGlobeAmericas } from 'react-icons/fa';

// Map icon names from JSON to actual React components
const IconComponents = {
  FaLaptopCode, FaHandshake, FaBullhorn, FaGlobeAmericas
};



// --- Typing Effect Logic (NEW) ---
const phrases = ["My Interests & Expertise", "My Projects & Insights", "My Journey & Passions"];
const TYPING_SPEED = 150; // milliseconds per character
const PAUSE_TIME = 2000; // milliseconds to pause at end of phrase
const ERASE_SPEED = 50; // milliseconds per character

const TypewriterText: React.FC = () => {
    const [text, setText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                setText(currentPhrase.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
                if (charIndex === 0) {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            } else {
                setText(currentPhrase.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
                if (charIndex === currentPhrase.length) {
                    setIsDeleting(true);
                }
            }
        };

        const timeout = setTimeout(
            handleTyping,
            isDeleting ? ERASE_SPEED : (charIndex === phrases[phraseIndex].length ? PAUSE_TIME : TYPING_SPEED)
        );

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex]);

    return <span className="typewriter">{text}</span>;
};
// --- END Typing Effect Logic ---


function Welcome() {
    return (
        <>
            <Helmet>
                <title>{SITE_OWNER_FULL_NAME}  - Personal Website</title>
                <meta name="description" content="{SITE_OWNER_FULL_NAME} 's personal portfolio and professional website showcasing projects and expertise." />
            </Helmet>

            <div>
                {/* Rotating Banner at the very top */}
                {/*<RotatingBanner messages={welcomeContent.bannerMessages} />*/}

                {/* Top Hero Section */}
                <section className="relative bg-gray-900 text-white py-16 md:py-24 overflow-hidden">
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                        {/* Left: Text Content */}
                        <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0 z-10">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                                {SITE_OWNER_FULL_NAME}
                            </h1>
                            {/* Dynamic tagline from JSON */}
                            <p className="text-xl md:text-2xl mb-6">
                                {welcomeContent.personalBio.tagline}
                            </p>
                            {/* Dynamic description from JSON */}
                            <p className="text-lg md:text-xl text-gray-300">
                                {welcomeContent.personalBio.description}
                            </p>
                        </div>
                        {/* Right: Picture/Logo on Right */}
                        <div className="md:w-2/5 flex justify-center z-10">
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                {/* Placeholder for your personal picture/logo */}
                                <BannerPlaceholder />
                            </div>
                        </div>
                    </div>
                    {/* Abstract background elements (optional) */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="20" cy="80" r="15" fill="currentColor" className="text-indigo-400 opacity-75"></circle>
                            <circle cx="80" cy="30" r="20" fill="currentColor" className="text-purple-400 opacity-75"></circle>
                            <rect x="50" y="50" width="10" height="10" fill="currentColor" className="text-pink-400 opacity-75"></rect>
                        </svg>
                    </div>
                </section>

                {/* Sections organized by Interests */}
                <section className="py-12 px-4 max-w-screen-lg mx-auto text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                        <TypewriterText /> {/* <--- NEW: Use the typing effect component here */}
                    </h2>
                </section>

                {welcomeContent.interests.map((interest, index) => {
                    // Dynamically get the icon component
                    const IconComponent = IconComponents[interest.iconClass as keyof typeof IconComponents];
                    const isEven = index % 2 === 0; // For alternating layout (text left/right)

                    return (
                        <section
                            key={interest.id}
                            className={`${isEven ? 'bg-gray-100' : 'bg-white'} py-12 border-y border-gray-200`}
                        >
                            <FadeIn>
                                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-center max-w-screen-lg mx-auto px-4`}>
                                    <div className={`lg:w-1/2 ${isEven ? 'lg:pr-8' : 'lg:pl-8'} mb-8 lg:mb-0`}>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 lg:text-left mb-4">
                                            {interest.title}
                                        </h3>
                                        {/* Render quote without additional quotes if they are part of the string */}
                                        <p className="text-gray-600 font-light text-lg md:text-xl lg:text-left mb-4 italic">
                                            "{interest.quote}" {interest.quoteSource && `- ${interest.quoteSource}`}
                                        </p>
                                        <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
                                            {interest.description}
                                        </p>
                                    </div>
                                    <div className="flex justify-center lg:w-1/2">
                                        <div className={`w-64 h-64 bg-opacity-70 rounded-full flex items-center justify-center shadow-2xl p-4 transform transition-transform duration-300 hover:scale-105 ${interest.bgColor} ${interest.textColor}`}>
                                            {IconComponent && (
                                                <IconComponent className="text-8xl filter drop-shadow-lg text-opacity-90" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </section>
                    );
                })}

                <section className="py-12"></section> {/* This empty section remains as in your original */}

                <Footer />
            </div>
        </>
    );
}

export default Welcome;