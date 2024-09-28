import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2Icon, UsersIcon, TrophyIcon } from "lucide-react";
import iconSrc from '@/assets/icon.png'; 

interface FeatureProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const featureList: FeatureProps[] = [
  {
    title: "Hands-on Workshops",
    description:
      "Participate in regular workshops covering cutting-edge technologies in cybersecurity, data science, AI, and competitive programming.",
    icon: <Code2Icon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Collaborative Projects",
    description:
      "Work on real-world projects with fellow members, applying your skills and learning from peers across different domains of computer science.",
    icon: <UsersIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Competitions & Hackathons",
    description:
      "Represent ESI in national and international coding competitions, cybersecurity challenges, and data science hackathons.",
    icon: <TrophyIcon className="w-6 h-6 text-primary" />,
  },
];

export const ClubFeatures = () => {
  return (
    <section className="container py-24 sm:py-32 " >
      <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Empowering{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Activities{" "}
        </span>
      </h2>
      <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Join CODE club to enhance your skills, collaborate with peers, and prepare for a successful career in tech.
          </p>

      </div>

          
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
        

          <div className="flex flex-col gap-8">
            {featureList.map(({ icon, title, description }: FeatureProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={iconSrc}
          className="w-[200px] md:w-[300px] lg:w-[400px] object-contain"
          alt="CODE Club Activities"
        />
      </div>
    </section>
  );
};

export default ClubFeatures;
