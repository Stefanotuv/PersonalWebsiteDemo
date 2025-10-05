// // src/pages/Welcome.tsx
// import React, { useState, useEffect } from "react";
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Footer from "./layout/Footer.tsx"; // Adjust path if needed
// import { getGalleryImages } from "../../api.ts"; // Use getGalleryImages with filter
// import FadeIn from "./components/FadeIn.tsx"
// import WipModal from './components/WipModal.tsx'; // Adjust path as needed
//
// import Banner1 from "../../images/new_set/banners/BeeBanner0.svg";
// import Banner2 from "../../images/new_set/banners/BeeBanner2.svg";
// import Banner3 from "../../images/new_set/banners/BeeBanner3.svg";
// import Banner4 from "../../images/new_set/banners/BeeBanner4.svg";
//
// import BeeKind from "../../images/new_set/Bee_yellow_kind.png";
// import BeeNice from "../../images/new_set/Bee_green_nice.png";
// import BeeGood from "../../images/new_set/Bee_white_good.png";
// import BeeFreak from "../../images/new_set/Bee_pink_freak.png";
// import {Helmet} from "react-helmet-async";
//
// // Interface for the image data needed by the carousel
// interface CarouselImageData {
//     id: number | string; // Allow string for default banner indices
//     image_url: string;
//     alt_text: string;
//     title?: string;
// }
//
// // --- Define Default Banners ---
// const defaultBanners: CarouselImageData[] = [
//     { id: 'default-1', image_url: Banner1, alt_text: 'Bee Banner 1 - Bee Kind', title: 'Bee Kind' },
//     { id: 'default-2', image_url: Banner2, alt_text: 'Bee Banner 2 - Bee Nice', title: 'Bee Nice' },
//     { id: 'default-3', image_url: Banner3, alt_text: 'Bee Banner 3 - Bee Good', title: 'Bee Good' },
//     { id: 'default-4', image_url: Banner4, alt_text: 'Bee Banner 4 - Bee Freak', title: 'Bee Freak' },
//     // Add more defaults if needed
// ];
//
// // --- Define the SLUG for the homepage gallery ---
// const HOMEPAGE_CAROUSEL_SLUG = 'homepage-carousel'; // IMPORTANT: Match this to the slug in your Django Gallery model
//
// function Welcome() {
//     const [carouselImages, setCarouselImages] = useState<CarouselImageData[]>([]);
//     const [loading, setLoading] = useState(true); // Overall loading for page content and essential configs
//     const [error, setError] = useState<string | null>(null); // Optional: display error state
//
//     // NEW: State for dynamic configuration settings
//     const [dynamicSettings, setDynamicSettings] = useState<Record<string, any> | null>(null);
//
//
//     return (
//         <>
//             <Helmet>
//                 <title>Project Good - Welcome</title>
//                 <meta name="description" content="Discover various causes you can support through Project Good." />
//             </Helmet>
//
//             {!loading && showWipBanner && (
//                 <WipModal duration={100000000} />
//             )}
//
//             <div>
//                 <div className="w-[90%] h-[90%] mx-auto max-w-5xl">
//                     {loading && (
//                          <div className="aspect-[16/9] flex items-center justify-center bg-gray-200 rounded-xl shadow-md animate-pulse">
//                             <p className="text-gray-500">Loading Carousel...</p>
//                          </div>
//                      )}
//
//                      {error && !loading && (
//                          <div className="mb-2 p-2 text-xs text-center bg-yellow-100 text-yellow-800 rounded">
//                              {error} Using default banners and settings.
//                         </div>
//                      )}
//
//                     {!loading && carouselImages.length > 0 && (
//                         <Carousel
//                             autoPlay
//                             infiniteLoop
//                             showThumbs={false}
//                             showStatus={false}
//                             interval={4000}
//                             transitionTime={600}
//                             emulateTouch
//                             swipeable
//                             showIndicators={true}
//                             className="rounded-xl shadow-md overflow-hidden"
//                         >
//                             {carouselImages.map((img) => (
//                                 <div key={img.id} className="aspect-[16/9] bg-gray-100">
//                                     <img
//                                         src={img.image_url}
//                                         alt={img.alt_text}
//                                         className="w-full h-full object-contain"
//                                         onError={(e) => {
//                                             console.error(`[Image Error] Failed to load image: '${img.image_url}'. Alt text: '${img.alt_text}'`, e);
//                                             e.currentTarget.style.display = 'none';
//                                             const parentDiv = e.currentTarget.parentElement;
//                                             if (parentDiv) {
//                                                 const errorMsg = document.createElement('p');
//                                                 errorMsg.innerText = `Image failed to load: '${img.alt_text}'`;
//                                                 errorMsg.className = 'text-red-500 text-sm absolute inset-0 flex items-center justify-center';
//                                                 parentDiv.appendChild(errorMsg);
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                             ))}
//                         </Carousel>
//                     )}
//
//                      {!loading && carouselImages.length === 0 && !error &&(
//                          <div className="aspect-[16/9] flex items-center justify-center bg-gray-200 rounded-xl shadow-md">
//                              <p className="text-gray-500">Carousel images not available.</p>
//                          </div>
//                      )}
//                 </div>
//
//                 <section className="py-12 px-4 max-w-screen-lg mx-auto text-center lg:text-left">
//                     <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl">
//                         The world is a beautiful place, but not for its sceneries, but because of the <strong>People </strong>
//                     </h1>
//                     <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl">
//                         For the last decades, we have been taught to hate instead of love, to be suspicious
//                         rather than welcoming, to challenge rather than help.
//                     </h1>
//                     <h1 className="mb-6 text-stone-500 font-light text-lg md:text-xl lg:text-2xl">
//                         It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
//                         for our communities and beyond.
//                     </h1>
//                     <h1 className="text-stone-500 font-light text-lg md:text-xl lg:text-2xl">
//                         At Project Good we believe in one thing among all: Just Be Good
//                     </h1>
//                 </section>
//                 <section className="bg-gray-100 py-12 border-y border-gray-200">
//                     <FadeIn>
//                       <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
//                         <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
//                           <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
//                            We have chosen to be Kind and be Good
//                           </h2>
//                           <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
//                             The world is a beautiful place, but not for its sceneries, but because of the People.
//                             For the last decades, we have been thought to hate instead of love, to be suspicious
//                             rather than welcoming, to challenge rather than help.
//                             It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
//                             for our communities and beyond.
//                             At Project Good we believe in one thing among all: Just Be Good.
//                           </p>
//                         </div>
//                         <div className="flex justify-center lg:w-1/2">
//                             <img
//                                 className="max-w-xs sm:max-w-sm lg:max-w-full h-auto"
//                                 src={BeeKind}
//                                 alt="Bee Kind Illustration"
//                             />
//                         </div>
//                       </div>
//                     </FadeIn>
//                 </section>
//                 <section className="bg-white py-12 border-b border-gray-200">
//                     <FadeIn>
//                       <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
//                         <div className="flex justify-center lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
//                           <img
//                               className="max-w-xs sm:max-w-sm lg:max-w-full h-auto"
//                               src={BeeNice}
//                               alt="Bee Nice Illustration"
//                           />
//                         </div>
//                         <div className="lg:w-1/2">
//                           <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
//                             Spread Positivity
//                           </h2>
//                           <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
//                             Join our community of positive change-makers. Share kindness, inspire others, and make a real difference in the world, one small act at a time.
//                           </p>
//                         </div>
//                       </div>
//                     </FadeIn>
//                 </section>
//
//                 <section className="bg-gray-100 py-12 border-y border-gray-200">
//                     <FadeIn>
//                       <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
//                         <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
//                           <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
//                            We have chosen to be Kind and be Good
//                           </h2>
//                           <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
//                             The world is a beautiful place, but not for its sceneries, but because of the People.
//                             For the last decades, we have been thought to hate instead of love, to be suspicious
//                             rather than welcoming, to challenge rather than help.
//                             It is time to change. We want to be the good, we want to be kind, we want to make a positive outcome
//                             for our communities and beyond.
//                             At Project Good we believe in one thing among all: Just Be Good.
//                           </p>
//                         </div>
//                         <div className="flex justify-center lg:w-1/2">
//                             <img
//                                 className="max-w-xs sm:max-w-sm lg:max-w-full h-auto"
//                                 src={BeeGood}
//                                 alt="Bee Kind Illustration"
//                             />
//                         </div>
//                       </div>
//                     </FadeIn>
//                 </section>
//
//                 <section className="bg-white py-12 border-b border-gray-200">
//                     <FadeIn>
//                       <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
//                         <div className="flex justify-center lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
//                           <img
//                               className="max-w-xs sm:max-w-sm lg:max-w-full h-auto"
//                               src={BeeFreak}
//                               alt="Bee Nice Illustration"
//                           />
//                         </div>
//                         <div className="lg:w-1/2">
//                           <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
//                             Spread Positivity
//                           </h2>
//                           <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
//                             Join our community of positive change-makers. Share kindness, inspire others, and make a real difference in the world, one small act at a time.
//                           </p>
//                         </div>
//                       </div>
//                     </FadeIn>
//                 </section>
//
//                 <section className="py-12"></section>
//
//                 <Footer />
//             </div>
//         </>
//     );
// }
//
// export default Welcome;

// frontend/src/pages/Welcome.tsx - ADAPTED FOR PERSONAL WEBSITE (Retains structure, removes 'Bee' specifics)

import React, { useState } from "react"; // useState is kept if you add dynamic content later, otherwise can be removed.
import { Helmet } from "react-helmet-async";

// Assuming these paths are correct in your copied project structure
import Footer from "./layout/Footer.tsx"; // Adjust path if needed
import FadeIn from "./components/FadeIn.tsx"


function Welcome() {
    // Removed all state related to carousel, loading, error, dynamic settings, WIP modal.
    // Removed all unused imports at the top that are not used in the final version below.

    return (
        <>
            <Helmet>
                <title>Stefano Tuveri - Personal Website</title>
                <meta name="description" content="Stefano Tuveri's personal portfolio and professional website showcasing projects and expertise." />
            </Helmet>

            <div>
                {/* Removed the entire Carousel section to simplify and remove image dependencies */}

                {/* Main Content Sections - Text and Generic Placeholders */}
                <section className="py-16 px-4 max-w-screen-lg mx-auto text-center lg:text-left bg-white shadow-sm rounded-lg my-8">
                    <h1 className="mb-6 text-gray-800 font-bold text-4xl md:text-5xl lg:text-6xl">
                        Welcome to Stefano's Personal Website
                    </h1>
                    <p className="mb-6 text-gray-600 text-lg md:text-xl lg:text-2xl">
                        Exploring the intersection of technology, creativity, and impact.
                    </p>
                    <p className="text-gray-600 text-lg md:text-xl lg:text-2xl">
                        This is where I showcase my projects, share insights, and connect with like-minded individuals.
                    </p>
                </section>

                <section className="bg-gray-100 py-12 border-y border-gray-200">
                    <FadeIn>
                      <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
                        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
                          <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
                           My Passion for Problem Solving
                          </h2>
                          <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
                            The world is full of challenges, and I believe technology is a powerful tool to address them.
                            My work is driven by a desire to build robust, scalable solutions that bring clarity and efficiency.
                            From complex backend systems to intuitive user interfaces, I focus on crafting effective digital experiences.
                          </p>
                        </div>
                        <div className="flex justify-center lg:w-1/2">
                            {/* Placeholder for an image or graphic */}
                            <div className="w-64 h-64 bg-blue-200 rounded-lg shadow-lg flex items-center justify-center text-blue-800 font-bold text-center">
                                Placeholder Image
                            </div>
                        </div>
                      </div>
                    </FadeIn>
                </section>

                <section className="bg-white py-12 border-b border-gray-200">
                    <FadeIn>
                      <div className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
                        <div className="flex justify-center lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
                           {/* Placeholder for an image or graphic */}
                           <div className="w-64 h-64 bg-green-200 rounded-lg shadow-lg flex items-center justify-center text-green-800 font-bold text-center">
                               Placeholder Graphic
                           </div>
                        </div>
                        <div className="lg:w-1/2">
                          <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
                            Projects & Expertise
                          </h2>
                          <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
                            My expertise spans full-stack development, with a strong focus on Django and React. I specialize in building
                            scalable web applications, API design, and robust database solutions. Explore my projects to see how I've applied
                            these skills to real-world problems.
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                </section>

                <section className="bg-gray-100 py-12 border-y border-gray-200">
                    <FadeIn>
                      <div className="flex flex-col lg:flex-row items-center justify-center max-w-screen-lg mx-auto px-4">
                        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
                          <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-center text-gray-800 lg:text-left">
                           Connect With Me
                          </h2>
                          <p className="text-center text-gray-600 font-light text-lg md:text-xl lg:text-left">
                            I'm always open to new challenges and collaborations. Whether you're a recruiter, a fellow developer,
                            or just curious about my work, feel free to reach out. Let's build something great together.
                          </p>
                        </div>
                        <div className="flex justify-center lg:w-1/2">
                            {/* Placeholder for an image or graphic */}
                            <div className="w-64 h-64 bg-purple-200 rounded-lg shadow-lg flex items-center justify-center text-purple-800 font-bold text-center">
                                Placeholder Graphic
                            </div>
                        </div>
                      </div>
                    </FadeIn>
                </section>

                <section className="py-12"></section> {/* This empty section remains as in your original */}

                <Footer />
            </div>
        </>
    );
}

export default Welcome;