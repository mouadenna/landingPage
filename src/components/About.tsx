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
                CODE Club at ESI is a dynamic community of passionate tech enthusiasts. 
                We focus on three key areas: Cybersecurity, Data & AI, and Competitive Programming. 
                Our mission is to empower students with cutting-edge skills, foster collaboration, 
                and prepare the next generation of tech leaders.
              </p>
              <p className="text-xl text-muted-foreground mt-4">
                Through workshops, projects, and competitions, we provide hands-on experience 
                in the latest technologies and methodologies. Join us to expand your knowledge, 
                build your network, and kickstart your career in the ever-evolving world of technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;