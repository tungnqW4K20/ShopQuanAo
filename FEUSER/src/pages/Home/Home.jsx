import React from 'react';
import Slider from './Slider';
import CategoryShowcase from './CategoryShowcase';
import DualBanner from './DualBanner';
import FullWidthBanner from './FullWidthBanner';
import ProductCarousel from './ProductCarousel';
import FullWidthBanner1 from './FullWidthBanner1';
import RunningProductCarousel from './RunningProductCarousel';
import OperationSmileBanner from './OperationSmileBanner';
import CoolClubSection from './CoolClubSection';



function Home() {
  return (
    <div className="w-full">
       <Slider />
       <CategoryShowcase/>
       <DualBanner/>
       <FullWidthBanner/>

       <ProductCarousel/>

       <FullWidthBanner1/>
       <RunningProductCarousel/>
       <OperationSmileBanner/>
       <CoolClubSection/>
    </div>
  );
}

export default Home;