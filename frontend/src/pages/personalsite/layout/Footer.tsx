// frontend/src/components/layout/Footer.tsx - SIMPLIFIED FOR PERSONAL WEBSITE

import { Link } from "react-router-dom";
import React from "react";
import { SITE_OWNER_FULL_NAME } from '../components/siteConfig.ts';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Copyright and Basic Info */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">{ SITE_OWNER_FULL_NAME } </h2>
          <p className="mt-2 text-gray-400">Technologist with a Business Background | Passionate about Politics & Society</p>
          <p className="text-sm mt-4 text-gray-500">© {new Date().getFullYear()} { SITE_OWNER_FULL_NAME } . All rights reserved.</p>
        </div>

        {/* Sitemap / Navigation */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Site Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1"> {/* Adjusted grid for smaller screens */}
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/cv" className="hover:underline">CV</Link></li>
              <li><Link to="/on-the-web" className="hover:underline">On the Web</Link></li>
            </ul>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/register" className="hover:underline">Register</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
