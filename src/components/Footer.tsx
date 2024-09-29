import logoSvg from '@/assets/logo.svg';

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2 flex flex-col items-center">
          <img src={logoSvg} alt="CODE Club Logo" className="h-32 w-auto mb-6" /> {/* Increased size and margin */}
          <p className="text-muted-foreground text-sm text-center max-w-xs"> {/* Added max-width for better text wrapping */}
            Empowering ESI students with cutting-edge skills in technology and fostering innovation.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>

          <div>
            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/company/code-esi"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              LinkedIn
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://www.instagram.com/code.esi"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              Instagram
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="https://www.youtube.com/channel/UCStGpNYpG_2ROS6E6T-mvPg"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#about"
              className="opacity-60 hover:opacity-100"
            >
              Our Mission
            </a>
          </div>
          <div>
          <a
              rel="noreferrer noopener"
              href="#event-gallery"
              className="opacity-60 hover:opacity-100"
            >
              Our Activities
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#team"
              className="opacity-60 hover:opacity-100"
            >
              Our Team
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#contactus"
              className="opacity-60 hover:opacity-100"
            >
              Contact Us
            </a>
          </div>

        </div>



        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">School Website</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="http://esi.ac.ma"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              ESI Website
            </a>
          </div>
        </div>

      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; {new Date().getFullYear()} Copyright{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.instagram.com/code.esi/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            CODE-ESI
          </a>
        </h3>
      </section>
    </footer>
  );
};
