import { useEffect } from 'react';
import { About } from "./components/About";
import { OurCells } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { OurVision } from "./components/OurVision";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { ClubFeatures } from "./components/ClubFeatures";
import { ExecutiveBoard } from "./components/Team";
import { EventGallery } from "./components/Testimonials";
import { ContactUs } from "./components/ContactUs";
import { ScrollAnimation } from "./components/ScrollAnimation";
import { SchoolInfo } from "./components/SchoolInfo"; // Add this line
import { Analytics } from "@vercel/analytics/react"
import "./App.css";

function App() {
  useEffect(() => {
    document.title = "Code-ESI";
  }, []);

  return (
    <>
      <Navbar />
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
      <Footer />
      <ScrollToTop />
      <Analytics />
    </>
  );
}

export default App;