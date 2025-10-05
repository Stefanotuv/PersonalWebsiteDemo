import React from 'react';

const TemplateLandingPage: React.FC = () => {
    return (
        <div className="container mx-auto p-8 text-center pt-24">
            <h1 className="text-4xl font-bold">Template Landing Page</h1>
            <p className="mt-4 text-lg">
                This is a simple test page. It has no special functionality.
            </p>
            <p className="mt-2 text-gray-500">
                The modal logic is handled globally by the Mobile Navbar.
            </p>
        </div>
    );
};

export default TemplateLandingPage;