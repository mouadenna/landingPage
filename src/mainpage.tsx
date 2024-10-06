import { useEffect } from 'react';
import { About } from "./components/About";
import { OurCells } from "./components/Features";
import { Hero } from "./components/Hero";
import { OurVision } from "./components/OurVision";
import { ScrollToTop } from "./components/ScrollToTop";
import { ClubFeatures } from "./components/ClubFeatures";
import { ExecutiveBoard } from "./components/Team";
import { EventGallery } from "./components/Testimonials";
import { ContactUs } from "./components/ContactUs";
import { SchoolInfo } from "./components/SchoolInfo";
import { ScrollAnimation } from "./components/ScrollAnimation";
import { Analytics } from "@vercel/analytics/react"
import "./App.css";

function MainPage() {
    useEffect(() => {
      document.title = "Code-ESI";
    }, []);
  
    return (
      <>
        <div className="md:hidden">
          <div className="mb-20"></div>
        </div>
        <Hero />
        <ScrollAnimation>
          <About />
        </ScrollAnimation>
        <ScrollAnimation>
          <OurVision />
        </ScrollAnimation>
        <ScrollAnimation>
          <SchoolInfo />
        </ScrollAnimation>
        <ScrollAnimation>
          <OurCells />
        </ScrollAnimation>
        <ScrollAnimation>
          <ClubFeatures />
        </ScrollAnimation>
        <ScrollAnimation>
          <EventGallery />
        </ScrollAnimation>
        <ScrollAnimation>
          <ExecutiveBoard />
        </ScrollAnimation>
        <ScrollAnimation>
          <ContactUs />
        </ScrollAnimation>
        <ScrollToTop />
        <Analytics />
  
      </>
    );
  }
  
  export default MainPage;
