// frontend/src/config/siteConfig.ts

export const SITE_OWNER_FIRST_NAME = "Mario";
export const SITE_OWNER_LAST_NAME = "Fungo";
export const SITE_OWNER_INITIALS = "MF";
export const SITE_OWNER_FULL_NAME = `${SITE_OWNER_FIRST_NAME} ${SITE_OWNER_LAST_NAME}`;

export const SITE_TITLE_SUFFIX = "Personal Website"; // Used in Helmet titles
export const SITE_OWNER_TAGLINE_HERO = "Full-Stack Developer | Cloud Architect | Problem Solver";
export const SITE_OWNER_DESCRIPTION_HERO = "Building robust, scalable solutions and exploring the impact of technology on business and society.";
export const SITE_OWNER_ABOUT_WEBSITE_TITLE = "About This Website"; // About page heading
export const SITE_OWNER_ABOUT_WEBSITE_DESCRIPTION = "My personal space on the web."; // About page sub-heading

// CV Page Specifics
export const CV_PAGE_DOWNLOAD_FILENAME = "Mario_Fungo_CV.docx";
export const CV_PAGE_ASK_MORE_INFO_MESSAGE = "Ask for more info form will appear here!";

// Online Presence Page Specifics (you'll customize the socialLinks array directly in the page)
export const ONLINE_PRESENCE_PAGE_TITLE = `${SITE_OWNER_FULL_NAME}: On the Web`;
export const ONLINE_PRESENCE_PAGE_DESCRIPTION = "Connect with me across various platforms.";

// Footer Copyright Info
export const FOOTER_COMPANY_NAME = SITE_OWNER_FULL_NAME; // Or a specific company name if different
export const FOOTER_COMPANY_TAGLINE = SITE_OWNER_TAGLINE_HERO; // Reusing tagline
export const FOOTER_COPYRIGHT_OWNER = SITE_OWNER_FULL_NAME;