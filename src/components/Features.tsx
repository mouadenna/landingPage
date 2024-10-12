import  { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon, BrainIcon, CodeIcon } from "lucide-react";

interface CellProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const cells: CellProps[] = [
  {
    icon: <ShieldIcon className="text-primary w-10 h-10" />,
    title: "Cyber Security",
    description:
      "Explore the world of digital security, learning to protect systems, networks, and data from cyber threats and vulnerabilities.",
  },
  {
    icon: <BrainIcon className="text-primary w-10 h-10" />,
    title: "Data & AI",
    description:
      "Dive into the realms of data science, machine learning, and artificial intelligence, uncovering insights and building intelligent systems.",
  },
  {
    icon: <CodeIcon className="text-primary w-10 h-10" />,
    title: "Competitive Programming",
    description:
      "Sharpen your coding skills, solve complex algorithmic problems, and compete in programming challenges to excel in the world of software development.",
  },
];

export const OurCells = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(cells.length).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) {
              setVisibleCards((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="ourCells"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Our{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Cells{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Empowering ESI students to excel in key areas of computer science through specialized focus groups, collaborative learning, and hands-on projects.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cells.map(({ icon, title, description }: CellProps, index) => (
          <div
            key={title}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`transition-all duration-500 ease-out ${
              visibleCards[index]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{ transitionDelay: `${index * 150}ms`, height: '100%' }}
          >
            <Card
              className="bg-muted/50 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:-translate-y-1"
              style={{ height: '100%' }}
            >
              <CardHeader>
                <CardTitle className="grid gap-4 place-items-center">
                  <div className="transition-transform duration-300 ease-in-out transform group-hover:scale-110 group-hover:rotate-3">
                    {icon}
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>{description}</CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurCells;