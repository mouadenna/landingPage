import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseIcon, UsersIcon, RocketIcon, TrophyIcon } from "lucide-react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <DatabaseIcon className="text-primary w-10 h-10" />,
    title: "Data Mastery",
    description:
      "Gain expertise in handling complex datasets and mastering cutting-edge data engineering tools and techniques.",
  },
  {
    icon: <UsersIcon className="text-primary w-10 h-10" />,
    title: "Collaborative Network",
    description:
      "Join a community of like-minded data enthusiasts to share knowledge, collaborate on projects, and grow together.",
  },
  {
    icon: <RocketIcon className="text-primary w-10 h-10" />,
    title: "Innovation",
    description:
      "Explore emerging technologies and methodologies in data engineering to stay at the forefront of the field.",
  },
  {
    icon: <TrophyIcon className="text-primary w-10 h-10" />,
    title: "Professional Growth",
    description:
      "Develop essential skills for a successful career in data engineering through workshops, competitions, and industry projects.",
  },
];

export const OurVision = () => {
  return (
    <section
      id="ourVision"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Our{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Vision{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Empowering ESI students to excel in the world of data engineering through collaboration, innovation, and hands-on experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default OurVision;