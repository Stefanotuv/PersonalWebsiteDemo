// // src/pages/admin/MainAdminDashboard.tsx (or a suitable central admin path)
// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//     BuildingStorefrontIcon, // For New Shop
//     ShoppingCartIcon,       // For Social Shop (Old Shop)
//     MegaphoneIcon,          // For Announcements
//     NewspaperIcon,          // For Blog
//     PhotoIcon,              // For Gallery
//     UsersIcon,              // For User Management (if you add it)
//     CogIcon,                // For Site Settings (if you add it)
//     ChatBubbleLeftRightIcon // For Social Platforms
//     // Add more icons as needed
// } from '@heroicons/react/24/outline';
//
// const MainAdminDashboard: React.FC = () => {
//     const adminSections = [
//         {
//             title: "New E-Commerce Shop",
//             description: "Manage products, categories, options, and orders for the main e-commerce platform.",
//             link: "/new-shop/admin/dashboard", // Links to the existing New Shop Admin Dashboard
//             icon: BuildingStorefrontIcon,
//             bgColor: "bg-indigo-600",
//             hoverBgColor: "hover:bg-indigo-700",
//             iconColor: "text-indigo-500",
//         },
//         {
//             title: "Social Shop Products",
//             description: "Manage products for the 'social' or older shop system.",
//             link: "/social_shop/admin/manage-products", // Links to your AdminProductsListPage for the social shop
//             icon: ShoppingCartIcon,
//             bgColor: "bg-sky-600",
//             hoverBgColor: "hover:bg-sky-700",
//             iconColor: "text-sky-500",
//         },
//         {
//             title: "Site Announcements",
//             description: "Create and manage site-wide announcements and banners.",
//             link: "/announcements", // Links to AdminAnnouncementsListPage
//             icon: MegaphoneIcon,
//             bgColor: "bg-emerald-600",
//             hoverBgColor: "hover:bg-emerald-700",
//             iconColor: "text-emerald-500",
//         },
//         {
//             title: "Blog Management",
//             description: "Administer blog posts, review content, and manage categories.",
//             // Note: Your route is "/api/blog/admin/manage", which sounds like an API endpoint.
//             // Ensure this is the correct frontend route for the blog admin page.
//             // If it's different, update the link.
//             link: "/api/blog/admin/manage", // Or the correct frontend path like "/blog/admin"
//             icon: NewspaperIcon,
//             bgColor: "bg-amber-600",
//             hoverBgColor: "hover:bg-amber-700",
//             iconColor: "text-amber-500",
//         },
//         {
//             title: "Gallery Management",
//             description: "Manage image galleries and individual images.",
//             link: "/gallery/management", // Links to GalleryManagementPage
//             icon: PhotoIcon,
//             bgColor: "bg-rose-600",
//             hoverBgColor: "hover:bg-rose-700",
//             iconColor: "text-rose-500",
//         },
//         {
//             title: "Social Platform Links",
//             description: "Configure and manage social media platform links.",
//             link: "/social/management", // Links to SocialPlatformManagementPage
//             icon: ChatBubbleLeftRightIcon,
//             bgColor: "bg-purple-600",
//             hoverBgColor: "hover:bg-purple-700",
//             iconColor: "text-purple-500",
//         },
//         // Add other sections based on your routes:
//         // - Causes Management (/causes/create, /causes/edit/:id, /cause-types)
//         // - Category Management (/manage/categories, /shop/categories) - Distinguish if needed
//     ];
//
//     return (
//         <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Main Admin Dashboard</h1>
//             <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
//                 Welcome to the main administration hub. From here, you can navigate to different sections of the application to manage content and settings.
//             </p>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
//                 {adminSections.map((section) => (
//                     <div
//                         key={section.title}
//                         className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
//                     >
//                         <section.icon className={`h-12 w-12 ${section.iconColor} mb-4`} />
//                         <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
//                         <p className="text-gray-600 text-sm mb-5 flex-grow">{section.description}</p>
//                         <Link
//                             to={section.link}
//                             className={`mt-auto inline-block ${section.bgColor} text-white font-medium px-6 py-2.5 rounded-lg ${section.hoverBgColor} text-sm transition-colors duration-150 ease-in-out text-center`}
//                         >
//                             Go to {section.title}
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default MainAdminDashboard;


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
            link: "http://localhost:8080/admin/", // Direct link to Django's built-in admin, ensure correct port
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
                <title>Stefano Tuveri - Dashboard</title>
                <meta name="description" content="Admin dashboard for Stefano Tuveri's personal website." />
            </Helmet>

            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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