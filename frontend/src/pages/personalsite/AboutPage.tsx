// // frontend/src/pages/AboutPage.tsx
// import React from 'react';
// import { Helmet } from 'react-helmet-async';
//
// const AboutPage: React.FC = () => {
//   return (
//     <>
//       <Helmet>
//         <title>Stefano Tuveri - About This Website</title>
//         <meta name="description" content="Learn why Stefano Tuveri created this personal website." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">About This Website</h1>
//           <p className="text-lg text-gray-600">My personal space on the web.</p>
//         </header>
//
//         <section className="mb-8 text-gray-700 text-lg leading-relaxed">
//           <p className="mb-4">
//         This website is more than a portfolio; it’s my own space to share ideas, projects, and reflections without the noise and limitations of social media. Here, I can manage my content on my terms and tell my story in full — a place where technology, business, and society intersect from my perspective.          </p>
//           <p className="mb-4">
//             My curiosity for how things work has always driven me, whether it’s finding ways to streamline business processes, designing better systems, or exploring how technology shapes our communities. I believe technology should serve people, and I’m passionate about using it to solve real problems and spark positive change.          </p>
//           <p className="mb-4">
//             Beyond technical projects, I’m deeply interested in politics and community issues. I see this site as a way to look beyond the filters and echo chambers, sharing a more nuanced view of the world — and hopefully inspiring thoughtful conversations along the way.          </p>
//           <p>
//             Thank you for visiting. I hope you find something here that resonates with your own interests or sparks new ideas.
//           </p>
//         </section>
//       </div>
//     </>
//   );
// };
//
// export default AboutPage;

// import React from 'react';
// import { Helmet } from 'react-helmet-async';
//
// const AboutPage: React.FC = () => {
//   return (
//     <>
//       <Helmet>
//         <title>Stefano Tuveri - About This Website</title>
//         <meta name="description" content="Learn why Stefano Tuveri created this personal website." />
//       </Helmet>
//
//       <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">About This Website</h1>
//           <p className="text-lg text-gray-600">My personal space on the web.</p>
//         </header>
//
//         <section className="mb-8 text-gray-700 text-lg leading-relaxed">
//           <p className="mb-4">
//             This website is more than a portfolio; it’s <strong>my own space</strong> to share ideas, projects, and reflections without the noise and limitations of social media. Here, I can <strong>manage my content on my terms</strong> and tell my story in full — a place where technology, business, and society intersect from my perspective.
//           </p>
//           <p className="mb-4">
//             My <strong>curiosity for how things work</strong> has always driven me, whether it’s finding ways to streamline business processes, designing better systems, or exploring how technology shapes our communities. I believe <strong>technology should serve people</strong>, and I’m passionate about using it to solve real problems and spark positive change.
//           </p>
//           <p className="mb-4">
//             Beyond technical projects, I’m deeply interested in <strong>politics and community issues</strong>. I see this site as a way to look beyond the filters and echo chambers, sharing a more <strong>nuanced view of the world</strong> — and hopefully inspiring thoughtful conversations along the way.
//           </p>
//           <p>
//             Thank you for visiting. I hope you find something here that resonates with your own interests or <strong>sparks new ideas</strong>.
//           </p>
//         </section>
//       </div>
//     </>
//   );
// };
//
// export default AboutPage;

// frontend/src/pages/AboutPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Stefano Tuveri - About This Website</title>
        <meta name="description" content="Learn why Stefano Tuveri created this personal website." />
      </Helmet>

      <div className="container mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg my-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">About This Website</h1>
          <p className="text-lg text-gray-600">My personal space on the web.</p>
        </header>

        <section className="mb-8 text-gray-700 text-lg leading-relaxed">
          <p className="mb-4">
            This website is more than a portfolio; it’s <span className="text-red-600 font-bold">my own space</span> to share ideas, projects, and reflections without the noise and limitations of social media. Here, I can <span className="text-green-600 font-bold">manage my content on my terms</span> and tell my story in full — a place where technology, business, and society intersect from my perspective.
          </p>
          <p className="mb-4">
            My <span className="text-gray-900 font-bold">curiosity for how things work</span> has always driven me, whether it’s finding ways to streamline business processes, designing better systems, or exploring how technology shapes our communities. I believe <span className="text-red-600 font-bold">technology should serve people</span>, and I’m passionate about using it to solve real problems and spark positive change.
          </p>
          <p className="mb-4">
            Beyond technical projects, I’m deeply interested in <span className="text-green-600 font-bold">politics and community issues</span>. I see this site as a way to look beyond the filters and echo chambers, sharing a more <span className="text-gray-900 font-bold">nuanced view of the world</span> — and hopefully inspiring thoughtful conversations along the way.
          </p>
          <p>
            Thank you for visiting. I hope you find something here that resonates with your own interests or <span className="text-red-600 font-bold">sparks new ideas</span>.
          </p>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
