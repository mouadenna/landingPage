
export const Hero = () => {



  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 relative -mt-12 pt-24">
      {/* Left side: Text Content */}
      <div className="text-center lg:text-start space-y-6 relative z-10">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline neon-text">
            <span className="inline bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text animate-balanced-neon-blue">
              CODE Club
            </span>{" "}
              
          </h1>{" "}
          Where{" "}
          <h2 className="inline neon-text">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text animate-balanced-neon-cyan">
              Tech Enthusiasts Thrive!
            </span>
          </h2>
        </main>
        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Join our vibrant community of tech lovers, where data enthusiasts, cybersecurity aficionados,competitive programmers, and AI innovators come together.
        </p>

      </div>
      <div className="shadow"></div>
      {/* Styles including new fade effect */}
      <style>{`
        @keyframes balanced-neon-blue {
          0%, 100% {
            text-shadow:
              0 0 5px rgba(79, 172, 254, 0.8),
              0 0 10px rgba(79, 172, 254, 0.6),
              0 0 15px rgba(79, 172, 254, 0.4),
              0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            text-shadow:
              0 0 2px rgba(79, 172, 254, 0.6),
              0 0 5px rgba(79, 172, 254, 0.4),
              0 0 7px rgba(79, 172, 254, 0.2),
              0 0 10px rgba(79, 172, 254, 0.1);
          }
        }
        @keyframes balanced-neon-cyan {
          0%, 100% {
            text-shadow:
              0 0 5px rgba(97, 218, 251, 0.8),
              0 0 10px rgba(97, 218, 251, 0.6),
              0 0 15px rgba(97, 218, 251, 0.4),
              0 0 20px rgba(97, 218, 251, 0.2);
          }
          50% {
            text-shadow:
              0 0 2px rgba(97, 218, 251, 0.6),
              0 0 5px rgba(97, 218, 251, 0.4),
              0 0 7px rgba(97, 218, 251, 0.2),
              0 0 10px rgba(97, 218, 251, 0.1);
          }
        }
        .animate-balanced-neon-blue {
          animation: balanced-neon-blue 2s ease-in-out infinite alternate;
        }
        .animate-balanced-neon-cyan {
          animation: balanced-neon-cyan 2s ease-in-out infinite alternate;
        }

      `}</style>
    </section>
  );
};

export default Hero;
