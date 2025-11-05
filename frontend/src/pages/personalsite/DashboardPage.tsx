
// src/pages/admin/MainAdminDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Assuming you use Helmet here as well
import { useAuth } from '../../context/AuthContext'; // To get user data for dashboard greeting
import {
    BuildingStorefrontIcon, // For New Shop
    ShoppingCartIcon,       // For Social Shop (Old Shop)
    MegaphoneIcon,          // For Announcements
    NewspaperIcon,          // For Blog
    PhotoIcon,              // For Gallery
    UsersIcon,              // For User Management (if you add it)
    CogIcon,                // For Site Settings, Engage
    ChatBubbleLeftRightIcon, // For Social Platforms
    CubeIcon,               // NEW: For Django Admin
    FolderOpenIcon,         // NEW: For Manage Causes (placeholder icon)
    KeyIcon,
    TruckIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline'; // Using Heroicons directly as you provided
import { SITE_OWNER_FULL_NAME, CV_PAGE_DOWNLOAD_FILENAME, CV_PAGE_ASK_MORE_INFO_MESSAGE } from './components/siteConfig.ts';

const DashboardPage: React.FC = () => {
    const { user } = useAuth(); // Get user for greeting

    // Define admin sections relevant for your personal website
    // Only includes Document Management for now, and a link to Django Admin
    const adminSections = [
        {
            title: "Manage My Documents",
            description: "Upload, categorize, and manage CVs, cover letters, and other personal documents.",
            link: "/documents", // This is the route to your DocumentManagementPage
            isExternal: false,
            icon: FolderOpenIcon,
            bgColor: "bg-blue-600",
            hoverBgColor: "hover:bg-blue-700",
            iconColor: "text-blue-500",
        },
        {
            title: "Manage My Photos",
            description: "Upload, categorize, and manage photos to be used in the website.",
            link: "/photos", // This is the route to your DocumentManagementPage
            isExternal: false,
            icon: PhotoIcon,
            bgColor: "bg-orange-600",
            hoverBgColor: "hover:bg-orange-700",
            iconColor: "text-orange-500",
        },
        {
            title: "Django Admin Backend",
            description: "Direct access to the core Django administration panel for advanced management.",
            link: "/admin/", // Direct link to Django's built-in admin, ensure correct port
            isExternal: true, // Flag to open in new tab
            icon: CubeIcon,
            bgColor: "bg-gray-800",
            hoverBgColor: "hover:bg-gray-900",
            iconColor: "text-gray-500",
        },
        // Add other sections here as you build them for your personal website
        // For example: "Manage Projects", "Manage Blog Posts", "Site Settings"
    ];

    return (
        <>
            <Helmet>
                <title>{SITE_OWNER_FULL_NAME}- Dashboard</title>
                <meta name="description" content="Admin dashboard for {SITE_OWNER_FULL_NAME}'s personal website." />
            </Helmet>

            <div className="container mx-auto p-4 sm:p-6 lg:p-8 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                    Welcome to Your Dashboard{user?.first_name ? `, ${user.first_name}` : ''}!
                </h1>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    From here, you can manage the content and settings for your personal website.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                    {adminSections.map((section) => (
                        <div
                            key={section.title}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
                        >
                            {/* Icon rendering */}
                            <section.icon className={`h-12 w-12 ${section.iconColor} mb-4`} />
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
                            <p className="text-gray-600 text-sm mb-5 flex-grow">{section.description}</p>
                            {section.isExternal ? (
                                <a
                                    href={section.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-auto inline-block ${section.bgColor} text-white font-medium px-6 py-2.5 rounded-lg ${section.hoverBgColor} text-sm transition-colors duration-150 ease-in-out text-center`}
                                >
                                    Go to {section.title}
                                </a>
                            ) : section.isComingSoon ? ( // isComingSoon is not explicitly defined in current sections, but kept for future proofing
                                <span className="mt-auto inline-block bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg text-sm text-center cursor-not-allowed">
                                    {section.title} (Coming Soon)
                                </span>
                            ) : (
                                <Link
                                    to={section.link}
                                    className={`mt-auto inline-block ${section.bgColor} text-white font-medium px-6 py-2.5 rounded-lg ${section.hoverBgColor} text-sm transition-colors duration-150 ease-in-out text-center`}
                                >
                                    Go to {section.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DashboardPage;