// // Assuming path is: ../../pages/Bee/SocialIcons.tsx
//
// import React from 'react';
//
// interface SocialIconProps {
//     social: string;
//     className?: string;
//     iconSvg?: string | null;
//     iconImage?: string | null;
// }
//
// // ... (renderSvg and getFullImageUrl helpers remain the same) ...
//
// const getFullImageUrl = (imagePath: string | null): string | null => {
//      if (!imagePath) return null;
//      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
//      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');
//      if (!apiBaseUrl) { console.warn("VITE_API_URL missing, cannot construct full image URL for:", imagePath); return null; }
//      const cleanedImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//      return `${apiBaseUrl}/${cleanedImagePath}`;
//  };
//
//  const renderSvg = (svgString: string): { __html: string } => {
//     const cleanSvg = svgString.replace(/<script.*?>.*?<\/script>/gi, '');
//     return { __html: cleanSvg };
// };
//
//
// export default function SocialIcon({ social, className = '', iconSvg, iconImage }: SocialIconProps) {
//     const iconContentClasses = `w-full h-full ${className}`;
//
//     // --- ADD DETAILED LOGGING ---
//     console.log(`--- SocialIcon Render for: ${social} ---`);
//     console.log(`Received iconSvg:`, iconSvg ? `"${iconSvg.substring(0, 50)}..."` : iconSvg); // Log truncated SVG or null/undefined
//     console.log(`Received iconImage:`, iconImage);
//
//     // 1. Custom SVG Check
//     if (iconSvg && typeof iconSvg === 'string' && iconSvg.trim().length > 0) {
//         console.log(`Decision: Rendering custom SVG for ${social}`);
//         return (
//             <span
//                 className={`inline-block text-current ${iconContentClasses}`}
//                 dangerouslySetInnerHTML={renderSvg(iconSvg)}
//                 title={social}
//             />
//         );
//     } else {
//          console.log(`Skipping SVG render for ${social}. Reason: iconSvg is falsy or empty string.`);
//     }
//
//     // 2. Custom Image URL Check
//     const fullImageUrl = getFullImageUrl(iconImage); // Calculate URL
//     console.log(`Calculated fullImageUrl for ${social}:`, fullImageUrl);
//
//     if (fullImageUrl && typeof fullImageUrl === 'string') { // Check if URL is valid string
//          console.log(`Decision: Rendering custom Image URL for ${social}`);
//         return (
//             <img
//                 src={fullImageUrl}
//                 alt={`${social} icon`}
//                 className={`${iconContentClasses} object-contain`}
//                 title={social}
//                 loading="lazy"
//              />
//         );
//      } else {
//         console.log(`Skipping Image render for ${social}. Reason: fullImageUrl is falsy.`);
//         // Log why image URL failed if possible
//         if (iconImage && !fullImageUrl) {
//              console.log(`   (Original iconImage was '${iconImage}', but getFullImageUrl returned null - check VITE_API_URL?)`);
//         }
//      }
//
//     // 3. Generic Fallback Icon (Only if above conditions failed)
//     console.log(`Decision: Rendering GENERIC FALLBACK icon for ${social}`);
//     return (
//         <svg
//             className={`${iconContentClasses} text-gray-500 dark:text-gray-400`}
//             fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
//             aria-hidden="true" title={social}
//         >
//             <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path>
//             <path d="M8.603 17.53a2.5 2.5 0 01-3.535-3.535l1.225-1.225a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3z"></path>
//         </svg>
//     );
// }
//


//
// import React from 'react';
//
// interface SocialIconProps {
//     social: string;
//     iconSvg?: string | null;
//     iconImage?: string | null;
// }
//
// const SocialIcon: React.FC<SocialIconProps> = ({ social, iconSvg, iconImage }) => {
//     if (iconSvg) {
//         return (
//             <div
//                 className="w-5 h-5 text-gray-700 dark:text-gray-200"
//                 dangerouslySetInnerHTML={{ __html: iconSvg }}
//             />
//         );
//     }
//
//     if (iconImage) {
//         return (
//             <img
//                 src={iconImage}
//                 alt={social}
//                 className="w-5 h-5 object-contain"
//             />
//         );
//     }
//
//     // Fallback to first letter
//     return (
//         <span className="text-xs font-bold text-gray-600 dark:text-white">
//             {social.charAt(0).toUpperCase()}
//         </span>
//     );
// };
//
// export default SocialIcon;


import React from 'react';

interface SocialIconProps {
    social: string;
    iconSvg?: string | null;
    iconImage?: string | null;
}

const SocialIcon: React.FC<SocialIconProps> = ({ social, iconSvg, iconImage }) => {
    // Use SVG if available
    if (iconSvg?.includes('<svg')) {
        return (
            <div
                className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
        );
    }

    // Fallback to image
    if (iconImage) {
        return (
            <img
                src={iconImage}
                alt={social}
                className="w-5 h-5 object-contain"
            />
        );
    }

    // Fallback to initials
    return (
        <span className="text-xs font-bold text-gray-600 dark:text-white">
            {social.charAt(0).toUpperCase()}
        </span>
    );
};

export default SocialIcon;


