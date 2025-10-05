// // frontend/src/pages/CVPage.tsx
// import React from 'react';
// import { Helmet } from 'react-helmet-async';
// import cvData from '../../data/cvData.json'; // Path to your CV JSON data
//
// // Placeholder for download link (you'll need to place your CV.docx in backend/static/media/downloads or similar)
// const CV_DOWNLOAD_URL = 'http://localhost:8000/static/downloads/Stefano_Tuveri_CV.docx'; // Example: Adjust this URL
//
// const CVPage: React.FC = () => {
//   return (
//     <>
//       <Helmet>
//         <title>Stefano Tuveri - Curriculum Vitae</title>
//         <meta name="description" content="Stefano Tuveri's professional curriculum vitae and work experience." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
//         {/* Header Section */}
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800">{cvData.name}</h1>
//           <p className="text-lg text-gray-600 mt-2">
//             Email: <a href={`mailto:${cvData.contact.email}`} className="text-blue-600 hover:underline">{cvData.contact.email}</a> |
//             Phone: {cvData.contact.phone} |
//             LinkedIn: <a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a>
//           </p>
//         </header>
//
//         {/* Action Buttons */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
//             <button
//                 onClick={() => alert("Ask for more info form will appear here!")} // Placeholder for actual form/modal
//                 className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
//             >
//                 Ask for More Information
//             </button>
//             <a
//                 href={CV_DOWNLOAD_URL}
//                 download="Stefano_Tuveri_CV.docx"
//                 className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
//             >
//                 Download CV (Word)
//             </a>
//         </div>
//
//
//         {/* Education */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
//           {cvData.education.map((edu, index) => (
//             <div key={index} className="mb-3">
//               <h3 className="text-lg font-semibold text-gray-700">{edu.degree}</h3>
//               <p className="text-gray-600">{edu.year} {edu.details && ` - ${edu.details}`}</p>
//             </div>
//           ))}
//         </section>
//
//         {/* Business Experiences (Selected) */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Experiences (Selected)</h2>
//           {cvData.businessExperiences.map((exp, index) => (
//             <div key={index} className="mb-6">
//               <h3 className="text-xl font-semibold text-gray-700">{exp.title}</h3>
//               <p className="text-gray-600 font-medium">{exp.company} - {exp.period}</p>
//               <p className="text-gray-700 mt-2">{exp.summary}</p>
//               {exp.keyAchievements && (
//                 <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
//                   {exp.keyAchievements.map((item, idx) => (
//                     <li key={idx}>{item}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </section>
//
//         {/* Early Business Experiences */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Early Business Experiences</h2>
//           {cvData.earlyBusinessExperiences.map((exp, index) => (
//             <div key={index} className="mb-6">
//               <h3 className="text-xl font-semibold text-gray-700">{exp.title}</h3>
//               <p className="text-gray-600 font-medium">{exp.company} - {exp.period}</p>
//               <p className="text-gray-700 mt-2">{exp.summary} {exp.link && (<a href={`http://${exp.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">({exp.link})</a>)}</p>
//             </div>
//           ))}
//         </section>
//
//         {/* Skills */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.skills.heading}</h2>
//           <p className="text-gray-700">{cvData.skills.list}</p>
//         </section>
//
//         {/* Certifications */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.certifications.heading}</h2>
//           <ul className="list-disc list-inside text-gray-700">
//             {cvData.certifications.list.map((cert, index) => (
//               <li key={index}>{cert}</li>
//             ))}
//           </ul>
//         </section>
//
//         {/* Language */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.language.heading}</h2>
//           <p className="text-gray-700">{cvData.language.list}</p>
//         </section>
//
//         {/* Nationality */}
//         <section className="mb-8 border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.nationality.heading}</h2>
//           <p className="text-gray-700">{cvData.nationality.list}</p>
//         </section>
//
//         {/* Links/Pages */}
//         <section className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.links_pages.heading}</h2>
//           <ul className="list-disc list-inside text-gray-700">
//             {cvData.links_pages.list.map((link, index) => (
//               <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link.text}</a></li>
//             ))}
//           </ul>
//         </section>
//
//         {/* Additional Information */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
//           <p className="text-gray-700"><strong>Productivity:</strong> {cvData.additionalInformation.productivity}</p>
//         </section>
//       </div>
//     </>
//   );
// };
//
// export default CVPage;

// frontend/src/pages/CVPage.tsx
import React, { useState, useEffect } from 'react'; // Added useState and useEffect for data fetching
import { Helmet } from 'react-helmet-async';
import cvData from '../../data/cvData.json'; // Path to your CV JSON data
import * as cvApi from './document_store/documents_api'; // Import all functions from cv_api.ts
import { Document } from './document_store/documents_api'; // Import Document type

const CVPage: React.FC = () => {
  const [currentCV, setCurrentCV] = useState<Document | null>(null);
  const [loadingCV, setLoadingCV] = useState(true);
  const [errorCV, setErrorCV] = useState<string | null>(null);

  // --- Fetch the Current CV Document from Backend ---
  useEffect(() => {
    const fetchCurrentCVDocument = async () => {
      setLoadingCV(true);
      setErrorCV(null);
      try {
        const response = await cvApi.getCurrentCV(); // Call the API to get the current CV
        setCurrentCV(response.data);
      } catch (err: any) {
        console.error("Failed to fetch current CV:", err.response?.data || err.message);
        setErrorCV("Failed to load current CV. Please try again later or contact Stefano.");
      } finally {
        setLoadingCV(false);
      }
    };
    fetchCurrentCVDocument();
  }, []); // Empty dependency array means this runs once on mount

  // --- Email Subject for "Ask for More Information" ---
  const emailSubject = "[from stefanotuveri.com] Inquiry from Personal Website";
  const mailtoLink = `mailto:stefano.tuveri@gmail.com?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <>
      <Helmet>
        <title>Stefano Tuveri - Curriculum Vitae</title>
        <meta name="description" content="Stefano Tuveri's professional curriculum vitae and work experience." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">{cvData.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            Email: <a href={`mailto:${cvData.contact.email}`} className="text-blue-600 hover:underline">{cvData.contact.email}</a> |
            Phone: {cvData.contact.phone} |
            LinkedIn: <a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a>
          </p>
        </header>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <a
                href={mailtoLink} // Mailto link
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors text-center"
            >
                Ask for More Information
            </a>

            {loadingCV ? (
                <span className="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg shadow cursor-not-allowed">
                    Loading CV...
                </span>
            ) : errorCV ? (
                <span className="bg-red-400 text-white font-bold py-2 px-6 rounded-lg shadow cursor-not-allowed">
                    CV Unavailable
                </span>
            ) : currentCV?.download_url ? (
                <a
                    href={currentCV.download_url} // Use the download_url from fetched document
                    download={currentCV.name || 'Stefano_Tuveri_CV'} // Suggest filename from doc name
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors text-center"
                >
                    Download CV (Current)
                </a>
            ) : (
                <span className="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg shadow cursor-not-allowed">
                    No Current CV Found
                </span>
            )}
        </div>


        {/* Education */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-lg font-semibold text-gray-700">{edu.degree}</h3>
              <p className="text-gray-600">{edu.year} {edu.details && ` - ${edu.details}`}</p>
            </div>
          ))}
        </section>

        {/* Business Experiences (Selected) */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Experiences (Selected)</h2>
          {cvData.businessExperiences.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700">{exp.title}</h3>
              <p className="text-gray-600 font-medium">{exp.company} - {exp.period}</p>
              <p className="text-gray-700 mt-2">{exp.summary}</p>
              {exp.keyAchievements && (
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
                  {exp.keyAchievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Early Business Experiences */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Early Business Experiences</h2>
          {cvData.earlyBusinessExperiences.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700">{exp.title}</h3>
              <p className="text-gray-600 font-medium">{exp.company} - {exp.period}</p>
              <p className="text-gray-700 mt-2">{exp.summary} {exp.link && (<a href={`http://${exp.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">({exp.link})</a>)}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.skills.heading}</h2>
          <p className="text-gray-700">{cvData.skills.list}</p>
        </section>

        {/* Certifications */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.certifications.heading}</h2>
          <ul className="list-disc list-inside text-gray-700">
            {cvData.certifications.list.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </section>

        {/* Language */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.language.heading}</h2>
          <p className="text-gray-700">{cvData.language.list}</p>
        </section>

        {/* Nationality */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.nationality.heading}</h2>
          <p className="text-gray-700">{cvData.nationality.list}</p>
        </section>

        {/* Links/Pages */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cvData.links_pages.heading}</h2>
          <ul className="list-disc list-inside text-gray-700">
            {cvData.links_pages.list.map((link, index) => (
              <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link.text}</a></li>
            ))}
          </ul>
        </section>

        {/* Additional Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
          <p className="text-gray-700"><strong>Productivity:</strong> {cvData.additionalInformation.productivity}</p>
        </section>
      </div>
    </>
  );
};

export default CVPage;