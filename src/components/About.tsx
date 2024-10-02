import logo from "../assets/logo.svg";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={logo}
            alt="CODE Club Logo"
            className="w-[300px] object-contain rounded-lg mx-auto"
          />
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About &nbsp;
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  CODE{" "}
                </span>
                Club
              </h2>
            
              <p className="text-xl text-muted-foreground mt-4">
              Club Of Data Engineers, fondly known as CODE, is the go-to IT club at the School of Information Sciences (ESI) in Rabat.
                More than just a student club, CODE is all about building a vibrant, collaborative community where students can share ideas, 
                learn from one another, and grow both personally and professionally. 
                              </p>
              <p className="text-xl text-muted-foreground mt-4">
              Our mission? To create an atmosphere that encourages creativity and connection—whether it’s through exciting events, hands-on workshops,
                or networking with industry professionals. At CODE, we’re shaping the future, one project at a time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
