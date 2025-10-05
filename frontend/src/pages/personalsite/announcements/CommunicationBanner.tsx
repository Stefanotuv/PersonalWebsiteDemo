// // /CommunicationBanner.tsx
// import React, { useState, useEffect } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/solid';
// import {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon, // Example default
// } from '@heroicons/react/24/outline'; // Using outline for content icons
// import { fetchCurrentAnnouncement, AnnouncementData } from '../../../api'; // Adjust path
//
// // Mapping Heroicon names (if stored as string in DB) to components
// // This is useful if icon_class stores the component name string like "InformationCircleIcon"
// const iconComponents: { [key: string]: React.ElementType } = {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon,
//   // Add more as needed
// };
//
// const CommunicationBanner: React.FC = () => {
//   const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [localStorageKey, setLocalStorageKey] = useState<string | null>(null);
//
//   useEffect(() => {
//     const loadAnnouncement = async () => {
//       const data = await fetchCurrentAnnouncement();
//       if (data && data.banner_id) { // Ensure data and banner_id exist
//         setAnnouncement(data);
//         const key = `bannerDismissed_${data.banner_id}`;
//         setLocalStorageKey(key);
//         const dismissed = localStorage.getItem(key);
//         if (!dismissed) {
//           setIsVisible(true);
//         } else {
//           setIsVisible(false);
//         }
//       } else {
//         setAnnouncement(null);
//         setIsVisible(false);
//       }
//     };
//     loadAnnouncement();
//   }, []); // Fetch once on mount
//
//   const handleDismiss = () => {
//     if (localStorageKey) {
//       setIsVisible(false);
//       localStorage.setItem(localStorageKey, 'true');
//     }
//   };
//
//   if (!isVisible || !announcement) {
//     return null;
//   }
//
//   // Determine styles
//   let bgColor = 'bg-blue-600'; // Default info
//   let textColor = 'text-white';
//   let IconToRender: React.ElementType | null = MegaphoneIcon; // Default icon
//
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     bgColor = ''; // We'll use inline style
//     textColor = ''; // We'll use inline style
//   } else {
//     switch (announcement.style) {
//       case 'info':
//         bgColor = 'bg-blue-600';
//         textColor = 'text-white';
//         IconToRender = InformationCircleIcon;
//         break;
//       case 'success':
//         bgColor = 'bg-green-600';
//         textColor = 'text-white';
//         IconToRender = CheckCircleIcon;
//         break;
//       case 'warning':
//         bgColor = 'bg-yellow-500';
//         textColor = 'text-black';
//         IconToRender = ExclamationTriangleIcon;
//         break;
//       case 'danger':
//         bgColor = 'bg-red-600';
//         textColor = 'text-white';
//         IconToRender = ShieldExclamationIcon;
//         break;
//     }
//   }
//
//   // Override IconToRender if a specific icon_class is provided and maps to a component
//   if (announcement.icon_class && iconComponents[announcement.icon_class]) {
//     IconToRender = iconComponents[announcement.icon_class];
//   } else if (announcement.icon_class) {
//     // Handle case where icon_class is a CSS class (e.g., FontAwesome)
//     // You'd render <i className={announcement.icon_class}></i> instead of IconToRender
//     // For now, we'll assume icon_class refers to a key in iconComponents or is ignored
//   }
//
//   const inlineStyles: React.CSSProperties = {};
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     inlineStyles.backgroundColor = announcement.custom_bg_color;
//     inlineStyles.color = announcement.custom_text_color;
//   }
//
//
//   return (
//     // <div
//     //   className={`p-3 text-sm fixed top-0 left-0 right-0 z-[100] shadow-md ${bgColor} ${textColor}`}
//     //   style={inlineStyles}
//     //   role="alert"
//     //   aria-live="polite"
//     // >
//     //   <div className="container mx-auto flex items-center justify-between">
//     //     <div className="flex items-center">
//     //       {IconToRender && <IconToRender className="h-5 w-5 mr-2 flex-shrink-0" />}
//     //       {/* Or if using CSS class for icon:
//     //       {announcement.icon_class && !iconComponents[announcement.icon_class] && (
//     //         <i className={`${announcement.icon_class} text-xl mr-2`}></i>
//     //       )}
//     //       */}
//     //       <span>{announcement.message}</span>
//     //     </div>
//     //     <button
//     //       onClick={handleDismiss}
//     //       className={`ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 ${announcement.style === 'warning' ? 'focus:ring-gray-800' : 'focus:ring-white'}`}
//     //       aria-label="Dismiss notification"
//     //     >
//     //       <XMarkIcon className="h-5 w-5" />
//     //     </button>
//     //   </div>
//     // </div>
//       <div
//       className={`w-full p-3 text-sm shadow-md ${bgColor} ${textColor} transition-all duration-300 ease-in-out`} // Key: NOT fixed, takes full width
//       style={inlineStyles}
//       role="alert"
//       aria-live="polite"
//     >
//       <div className="container mx-auto flex items-center justify-between">
//         <div className="flex items-center">
//           {IconToRender && <IconToRender className="h-5 w-5 mr-2 flex-shrink-0" />}
//           <span>{announcement.message}</span>
//         </div>
//         <button
//           onClick={handleDismiss}
//           // ... (button styling) ...
//         >
//           <XMarkIcon className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default CommunicationBanner;
//


//
// import React, { useState, useEffect, Fragment } from 'react'; // Added Fragment
// import { XMarkIcon } from '@heroicons/react/24/solid';
// import {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon,
//   // Add other icons you might use in iconConfig if needed for the banner itself
// } from '@heroicons/react/24/outline';
// // Assuming your api.ts is three levels up from a hypothetical 'src/components/Common/CommunicationBanner.tsx'
// // If your project structure is flatter, like 'src/api.ts' and 'src/components/Common/CommunicationBanner.tsx',
// // then the path would be '../../api'
// import { fetchCurrentAnnouncement, AnnouncementData } from '../../../api'; // PLEASE VERIFY THIS PATH
//
// // Mapping Heroicon names (if stored as string in DB) to components for the banner icon
// const iconComponents: { [key: string]: React.ElementType } = {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon,
//   // Add more from your iconConfig.ts if banner_icon_class can use them
// };
//
//
// // Helper function to parse the message and insert links
// const parseMessageWithLinks = (message: string): React.ReactNode[] => {
//   if (!message) return [];
//
//   const parts: React.ReactNode[] = [];
//
//   // Regex for URLs (simplified - an be made more robust for edge cases)
//   // This looks for http(s):// or www. then non-space chars,
//   // OR something that looks like domain.tld (very basic, might have false positives)
//   // OR an email address.
//   // The order matters if there can be overlaps.
//   const combinedRegex = new RegExp(
//     /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s<>"']*)?|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi
//   );
//
//   let lastIndex = 0;
//   let match;
//
//   while ((match = combinedRegex.exec(message)) !== null) {
//     const matchText = match[0];
//     const matchIndex = match.index;
//
//     // Add text before the match
//     if (matchIndex > lastIndex) {
//       parts.push(
//         <Fragment key={`text-${lastIndex}`}>{message.substring(lastIndex, matchIndex)}</Fragment>
//       );
//     }
//
//     // Determine link type and create link
//     if (matchText.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i)) { // Email
//       parts.push(
//         <a
//           key={`link-email-${matchIndex}`}
//           href={`mailto:${matchText}`}
//           className="underline hover:opacity-80 font-semibold" // Basic link styling
//         >
//           {matchText}
//         </a>
//       );
//     } else { // URL
//       const href = matchText.startsWith('www.') || (!matchText.startsWith('http://') && !matchText.startsWith('https://') && matchText.includes('.'))
//                    ? `http://${matchText}`
//                    : matchText;
//       parts.push(
//         <a
//           key={`link-url-${matchIndex}`}
//           href={href}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="underline hover:opacity-80 font-semibold" // Basic link styling
//         >
//           {matchText}
//         </a>
//       );
//     }
//     lastIndex = combinedRegex.lastIndex;
//   }
//
//   // Add any remaining text after the last match
//   if (lastIndex < message.length) {
//     parts.push(
//       <Fragment key={`text-${lastIndex}`}>{message.substring(lastIndex)}</Fragment>
//     );
//   }
//
//   // If the message had no links, 'parts' will contain the original message in one Fragment
//   // If the message was empty, 'parts' will be empty
//   return parts;
// };
//
//
// const CommunicationBanner: React.FC = () => {
//   const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [localStorageKey, setLocalStorageKey] = useState<string | null>(null);
//
//   useEffect(() => {
//     const loadAnnouncement = async () => {
//       try {
//         const data = await fetchCurrentAnnouncement();
//         if (data && data.banner_id) {
//           setAnnouncement(data);
//           const key = `bannerDismissed_${data.banner_id}`;
//           setLocalStorageKey(key);
//           const dismissed = localStorage.getItem(key);
//           if (!dismissed) {
//             setIsVisible(true);
//           } else {
//             setIsVisible(false);
//           }
//         } else {
//           setAnnouncement(null);
//           setIsVisible(false);
//         }
//       } catch (error) {
//         console.error("Error in CommunicationBanner loading announcement:", error);
//         setAnnouncement(null);
//         setIsVisible(false);
//       }
//     };
//     loadAnnouncement();
//   }, []);
//
//   const handleDismiss = () => {
//     if (localStorageKey) {
//       setIsVisible(false);
//       localStorage.setItem(localStorageKey, 'true');
//     }
//   };
//
//   if (!isVisible || !announcement || !announcement.message) { // Added check for announcement.message
//     return null;
//   }
//
//   // Determine styles
//   let bgColor = 'bg-blue-600'; // Default info
//   let textColor = 'text-white';
//   let IconToRender: React.ElementType | null = MegaphoneIcon; // Default icon
//
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     bgColor = '';
//     textColor = '';
//   } else {
//     switch (announcement.style) {
//       case 'info':
//         bgColor = 'bg-blue-600';
//         textColor = 'text-white';
//         IconToRender = InformationCircleIcon;
//         break;
//       case 'success':
//         bgColor = 'bg-green-600';
//         textColor = 'text-white';
//         IconToRender = CheckCircleIcon;
//         break;
//       case 'warning':
//         bgColor = 'bg-yellow-500';
//         textColor = 'text-black';
//         IconToRender = ExclamationTriangleIcon;
//         break;
//       case 'danger':
//         bgColor = 'bg-red-600';
//         textColor = 'text-white';
//         IconToRender = ShieldExclamationIcon;
//         break;
//     }
//   }
//
//   if (announcement.icon_class && iconComponents[announcement.icon_class]) {
//     IconToRender = iconComponents[announcement.icon_class];
//   } else if (announcement.icon_class && announcement.icon_class.toLowerCase() === 'none') {
//     IconToRender = null; // Explicitly no icon
//   }
//   // Note: The logic for getIconComponent from iconConfig.ts might be more robust if you centralize icon mapping there.
//   // For now, using the local iconComponents map.
//
//   const inlineStyles: React.CSSProperties = {};
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     inlineStyles.backgroundColor = announcement.custom_bg_color;
//     inlineStyles.color = announcement.custom_text_color;
//   }
//
//   const renderedMessage = parseMessageWithLinks(announcement.message);
//
//   return (
//     <div
//       className={`w-full p-3 text-sm shadow-md ${bgColor} ${textColor} transition-all duration-300 ease-in-out`}
//       style={inlineStyles}
//       role="alert"
//       aria-live="polite"
//     >
//       <div className="container mx-auto flex items-center justify-between">
//         <div className="flex items-center min-w-0"> {/* Added min-w-0 for better flex wrapping if message is long */}
//           {IconToRender && <IconToRender className="h-5 w-5 mr-2 flex-shrink-0" />}
//           {/* The span below will now render an array of text nodes and <a> elements */}
//           <span className="flex-grow break-words">{renderedMessage}</span> {/* Added flex-grow and break-words */}
//         </div>
//         <button
//           onClick={handleDismiss}
//           className={`ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 ${
//             announcement.style === 'warning' ? 'focus:ring-gray-800' : 'focus:ring-white'
//           }`}
//           aria-label="Dismiss notification"
//         >
//           <XMarkIcon className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default CommunicationBanner;

// import React, { useState, useEffect, Fragment } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/solid';
// import {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon,
// } from '@heroicons/react/24/outline';
// import { fetchCurrentAnnouncement, AnnouncementData } from '../../../api'; // VERIFY THIS PATH
//
// // Mapping Heroicon names for the banner icon
// const iconComponents: { [key: string]: React.ElementType } = {
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   ShieldExclamationIcon,
//   MegaphoneIcon,
// };
//
// // Helper function to parse the message and insert links
// const parseMessageWithLinks = (message: string): React.ReactNode[] => {
//   if (!message) return [];
//
//   const parts: React.ReactNode[] = [];
//   const combinedRegex = new RegExp(
//     /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s<>"']*)?|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi
//   );
//
//   let lastIndex = 0;
//   let match;
//
//   while ((match = combinedRegex.exec(message)) !== null) {
//     const matchText = match[0];
//     const matchIndex = match.index;
//
//     if (matchIndex > lastIndex) {
//       parts.push(
//         <Fragment key={`text-${lastIndex}`}>{message.substring(lastIndex, matchIndex)}</Fragment>
//       );
//     }
//
//     if (matchText.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i)) { // Email
//       parts.push(
//         <a
//           key={`link-email-${matchIndex}`}
//           href={`mailto:${matchText}`}
//           className="underline hover:opacity-80 font-semibold"
//         >
//           {matchText}
//         </a>
//       );
//     } else { // URL
//       // Ensure URL has a protocol for href
//       const href = (matchText.startsWith('www.') || (!matchText.startsWith('http://') && !matchText.startsWith('https://') && matchText.includes('.')))
//                    ? `http://${matchText}`
//                    : matchText;
//       parts.push(
//         <a
//           key={`link-url-${matchIndex}`}
//           href={href}
//           target="_blank" // <--- Opens in a new tab/window
//           rel="noopener noreferrer" // <--- Security and performance best practice for target="_blank"
//           className="underline hover:opacity-80 font-semibold"
//         >
//           {matchText}
//         </a>
//       );
//     }
//     lastIndex = combinedRegex.lastIndex;
//   }
//
//   if (lastIndex < message.length) {
//     parts.push(
//       <Fragment key={`text-${lastIndex}`}>{message.substring(lastIndex)}</Fragment>
//     );
//   }
//
//   return parts;
// };
//
//
// const CommunicationBanner: React.FC = () => {
//   const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [localStorageKey, setLocalStorageKey] = useState<string | null>(null);
//
//   useEffect(() => {
//     const loadAnnouncement = async () => {
//       try {
//         const data = await fetchCurrentAnnouncement();
//         if (data && data.banner_id) {
//           setAnnouncement(data);
//           const key = `bannerDismissed_${data.banner_id}`;
//           setLocalStorageKey(key);
//           const dismissed = localStorage.getItem(key);
//           if (!dismissed) {
//             setIsVisible(true);
//           } else {
//             setIsVisible(false);
//           }
//         } else {
//           setAnnouncement(null);
//           setIsVisible(false);
//         }
//       } catch (error) {
//         console.error("Error in CommunicationBanner loading announcement:", error);
//         setAnnouncement(null);
//         setIsVisible(false);
//       }
//     };
//     loadAnnouncement();
//   }, []);
//
//   const handleDismiss = () => {
//     if (localStorageKey) {
//       setIsVisible(false);
//       localStorage.setItem(localStorageKey, 'true');
//     }
//   };
//
//   if (!isVisible || !announcement || !announcement.message) {
//     return null;
//   }
//
//   let bgColor = 'bg-blue-600';
//   let textColor = 'text-white';
//   let IconToRender: React.ElementType | null = MegaphoneIcon;
//
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     bgColor = '';
//     textColor = '';
//   } else {
//     switch (announcement.style) {
//       case 'info':
//         bgColor = 'bg-blue-600';
//         textColor = 'text-white';
//         IconToRender = InformationCircleIcon;
//         break;
//       case 'success':
//         bgColor = 'bg-green-600';
//         textColor = 'text-white';
//         IconToRender = CheckCircleIcon;
//         break;
//       case 'warning':
//         bgColor = 'bg-yellow-500';
//         textColor = 'text-black';
//         IconToRender = ExclamationTriangleIcon;
//         break;
//       case 'danger':
//         bgColor = 'bg-red-600';
//         textColor = 'text-white';
//         IconToRender = ShieldExclamationIcon;
//         break;
//     }
//   }
//
//   if (announcement.icon_class && iconComponents[announcement.icon_class]) {
//     IconToRender = iconComponents[announcement.icon_class];
//   } else if (announcement.icon_class && announcement.icon_class.toLowerCase() === 'none') {
//     IconToRender = null;
//   }
//
//   const inlineStyles: React.CSSProperties = {};
//   if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
//     inlineStyles.backgroundColor = announcement.custom_bg_color;
//     inlineStyles.color = announcement.custom_text_color;
//   }
//
//   const renderedMessage = parseMessageWithLinks(announcement.message);
//
//   return (
//     <div
//       className={`w-full p-3 text-sm shadow-md ${bgColor} ${textColor} transition-all duration-300 ease-in-out`}
//       style={inlineStyles}
//       role="alert"
//       aria-live="polite"
//     >
//       <div className="container mx-auto flex items-center justify-between">
//         <div className="flex items-center min-w-0">
//           {IconToRender && <IconToRender className="h-5 w-5 mr-2 flex-shrink-0" />}
//           <span className="flex-grow break-words">{renderedMessage}</span>
//         </div>
//         <button
//           onClick={handleDismiss}
//           className={`ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 ${
//             announcement.style === 'warning' ? 'focus:ring-gray-800' : 'focus:ring-white'
//           }`}
//           aria-label="Dismiss notification"
//         >
//           <XMarkIcon className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default CommunicationBanner;

import React, { useState, useEffect, Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { fetchCurrentAnnouncement, AnnouncementData } from '../../../api.ts'; // VERIFY THIS PATH

// Mapping Heroicon names for the banner icon
const iconComponents: { [key: string]: React.ElementType } = {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  MegaphoneIcon,
};

// Helper function to parse the message and insert links
const parseMessageWithLinks = (message: string): React.ReactNode[] => {
  if (!message) return [];

  const parts: React.ReactNode[] = [];
  let remainingMessage = message;
  let keyCounter = 0; // For unique keys

  // Regex for standard email addresses
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  // Regex for URLs (http, https, www, or domain.tld - heuristic for domain.tld)
  const urlRegex = /\b(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s<>"']*)?)/gi;

  // Create a combined regex that looks for either an email or a URL.
  // The parentheses create capturing groups for each pattern.
  const combinedPattern = new RegExp(
    `(${emailRegex.source})|(${urlRegex.source})`, // Group 1 for email, Group 2 for URL
    'gi' // Global, case-insensitive
  );

  let match;
  let lastIndex = 0;

  while ((match = combinedPattern.exec(remainingMessage)) !== null) {
    const fullMatchText = match[0]; // The entire matched string
    const emailMatch = match[1];    // Content of the first capturing group (email)
    const urlMatch = match[2];      // Content of the second capturing group (URL)
    const matchStartIndex = match.index;

    // Add the text before this match
    if (matchStartIndex > 0) {
      parts.push(
        <Fragment key={`text-${keyCounter++}`}>{remainingMessage.substring(0, matchStartIndex)}</Fragment>
      );
    }

    if (emailMatch) {
      // It's an email match
      parts.push(
        <a
          key={`link-email-${keyCounter++}`}
          href={`mailto:${emailMatch.trim()}`} // Use the captured emailMatch
          className="underline hover:opacity-80 font-semibold"
          // NO target="_blank" for mailto links
        >
          {emailMatch.trim()}
        </a>
      );
    } else if (urlMatch) {
      // It's a URL match
      let href = urlMatch.trim();
      // Prepend http:// if it's missing for www. or domain.tld patterns
      if (href.startsWith('www.') ||
          (!href.startsWith('http://') && !href.startsWith('https://') && href.includes('.'))) {

        // Heuristic: Check if it looks like a domain rather than just a filename.
        // This is a very basic check. A more robust solution would require better TLD lists or context.
        const simpleDomainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s<>"']*)?$/;
        if (simpleDomainPattern.test(href) || href.startsWith('www.')) {
            href = `http://${href}`;
        } else {
            // If it doesn't clearly look like a domain that needs http:// prepended,
            // treat it as text to avoid wrongly linking things like "file.txt"
            parts.push(<Fragment key={`text-url-like-${keyCounter++}`}>{urlMatch.trim()}</Fragment>);
            // Adjust remainingMessage and continue to next iteration
            remainingMessage = remainingMessage.substring(matchStartIndex + fullMatchText.length);
            combinedPattern.lastIndex = 0; // Reset regex state for new remainingMessage
            lastIndex = 0; // Reset lastIndex for the new substring
            continue; // Skip adding as a link
        }
      }
      parts.push(
        <a
          key={`link-url-${keyCounter++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 font-semibold"
        >
          {urlMatch.trim()}
        </a>
      );
    }

    // Adjust remainingMessage for the next iteration
    remainingMessage = remainingMessage.substring(matchStartIndex + fullMatchText.length);
    // Reset the regex's lastIndex because we're now searching on a shorter string
    combinedPattern.lastIndex = 0;
    lastIndex = 0; // Reset lastIndex as well, as we're processing the new remainingMessage
  }

  // Add any final piece of text after all matches
  if (remainingMessage) {
    parts.push(<Fragment key={`text-final-${keyCounter++}`}>{remainingMessage}</Fragment>);
  }

  // If message was empty or had no links, parts might be empty or just contain the original message
  if (parts.length === 0 && message) {
      return [<Fragment key="original-message-no-links">{message}</Fragment>];
  }

  return parts;
};


const CommunicationBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [localStorageKey, setLocalStorageKey] = useState<string | null>(null);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const data = await fetchCurrentAnnouncement();
        if (data && data.banner_id) {
          setAnnouncement(data);
          const key = `bannerDismissed_${data.banner_id}`;
          setLocalStorageKey(key);
          const dismissed = localStorage.getItem(key);
          if (!dismissed) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } else {
          setAnnouncement(null);
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error in CommunicationBanner loading announcement:", error);
        setAnnouncement(null);
        setIsVisible(false);
      }
    };
    loadAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (localStorageKey) {
      setIsVisible(false);
      localStorage.setItem(localStorageKey, 'true');
    }
  };

  if (!isVisible || !announcement || !announcement.message) {
    return null;
  }

  let bgColor = 'bg-blue-600';
  let textColor = 'text-white';
  let IconToRender: React.ElementType | null = MegaphoneIcon;

  if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
    bgColor = '';
    textColor = '';
  } else {
    switch (announcement.style) {
      case 'info':
        bgColor = 'bg-blue-600';
        textColor = 'text-white';
        IconToRender = InformationCircleIcon;
        break;
      case 'success':
        bgColor = 'bg-green-600';
        textColor = 'text-white';
        IconToRender = CheckCircleIcon;
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-black';
        IconToRender = ExclamationTriangleIcon;
        break;
      case 'danger':
        bgColor = 'bg-red-600';
        textColor = 'text-white';
        IconToRender = ShieldExclamationIcon;
        break;
    }
  }

  if (announcement.icon_class && iconComponents[announcement.icon_class]) {
    IconToRender = iconComponents[announcement.icon_class];
  } else if (announcement.icon_class && announcement.icon_class.toLowerCase() === 'none') {
    IconToRender = null;
  }

  const inlineStyles: React.CSSProperties = {};
  if (announcement.style === 'custom' && announcement.custom_bg_color && announcement.custom_text_color) {
    inlineStyles.backgroundColor = announcement.custom_bg_color;
    inlineStyles.color = announcement.custom_text_color;
  }

  const renderedMessage = parseMessageWithLinks(announcement.message);

  return (
    <div
      className={`w-full p-3 text-sm shadow-md ${bgColor} ${textColor} transition-all duration-300 ease-in-out`}
      style={inlineStyles}
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center min-w-0">
          {IconToRender && <IconToRender className="h-5 w-5 mr-2 flex-shrink-0" />}
          <span className="flex-grow break-words">{renderedMessage}</span>
        </div>
        <button
          onClick={handleDismiss}
          className={`ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 ${
            announcement.style === 'warning' ? 'focus:ring-gray-800' : 'focus:ring-white'
          }`}
          aria-label="Dismiss notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CommunicationBanner;
