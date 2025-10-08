// frontend/src/pages/OnlinePresencePage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaYoutube, FaMedium, FaGithub, FaLinkedin, FaGlobe, FaBookOpen } from 'react-icons/fa'; // Import relevant icons
import { SITE_OWNER_FULL_NAME, CV_PAGE_DOWNLOAD_FILENAME, CV_PAGE_ASK_MORE_INFO_MESSAGE } from './components/siteConfig.ts';

// Define your social links and pages
const socialLinks = [
  {
    name: "YouTube Channel",
    url: "https://www.youtube.com/",
    description: "My personal YouTube channel where I share thoughts on technology, projects, and life.",
    icon: <FaYoutube className="text-red-600" />
  },
  {
    name: "LinkedIn Profile",
    url: "https://www.linkedin.com/",
    description: "Connect with me professionally on LinkedIn for updates on my career and industry insights.",
    icon: <FaLinkedin className="text-blue-700" />
  },
  {
    name: "GitHub Profile",
    url: "https://github.com/", // Replace with your actual GitHub username
    description: "Explore my code repositories, open-source contributions, and personal projects.",
    icon: <FaGithub className="text-gray-800" />
  },
  {
    name: "Medium Articles",
    url: "https://medium.com/", // Replace with your actual Medium username
    description: "Read my articles and thoughts on various tech and business topics.",
    icon: <FaMedium className="text-black" />
  },
  {
    name: "Personal Blog (Coming Soon)",
    url: "#", // Placeholder for your future blog
    description: "A space for deeper dives into my interests and experiences.",
    icon: <FaBookOpen className="text-purple-600" />
  }
];

const OnlinePresencePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{SITE_OWNER_FULL_NAME} - Online Presence</title>
        <meta name="description" content="{SITE_OWNER_FULL_NAME}'s presence across the web: social media, professional networks, and personal content." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">On the Web</h1>
          <p className="text-lg text-gray-600">Connect with me across various platforms.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{link.icon || <FaGlobe />}</div> {/* Fallback icon */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{link.name}</h2>
              <p className="text-gray-600 mb-4">{link.description}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors"
              >
                Visit Page
              </a>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default OnlinePresencePage;