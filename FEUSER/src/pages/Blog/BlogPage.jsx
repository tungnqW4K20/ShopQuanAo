// src/pages/BlogPage.jsx
import React from 'react';
import HeroBanner from './HeroBanner';
import BlogNavigation from './BlogNavigation';
import FeaturedSection from './FeaturedSection';
import WhatsNewSection from './WhatsNewSection';
import DailyPostsSection from './DailyPostsSection';
import FeaturedCategories from './FeaturedCategories';

const BlogPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header is excluded as per request by parent App.jsx */}

      <HeroBanner />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlogNavigation />
        <FeaturedSection />
        {/* Spacer can be added here if needed: <div className="my-8"></div> */}
      </div>

      <WhatsNewSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DailyPostsSection />

        

        <FeaturedCategories />
      </div>

      {/* You might move the footer here if it's specific to the blog page layout */}
     

      
    </div>
  );
};

export default BlogPage;