import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Instagram, Linkedin } from "lucide-react";
import image from '@/assets/member.png';
import mouad from '@/assets/board/mouad.png';
import salim from '@/assets/board/salim.jpg';
import reda from '@/assets/board/reda.jpg';
import noura from '@/assets/board/noura.jpg';
import nouha from '@/assets/board/nouha.jpg';

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  socialNetworks: SocialNetworksProps[];
}

interface SocialNetworksProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: noura,
    name: "Noura ED DAHBY",
    position: "President",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Omar Selouani",
    position: "Vice President",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Ikram Mesbah",
    position: "General Secretary",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Sponsoring Head",
    position: "Sponsoring Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Sponsoring Co-Head",
    position: "Sponsoring Co-Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: nouha,
    name: "Nouhaila Lachgar",
    position: "Media Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: salim,
    name: "Salim El mardi",
    position: "Data & AI Co-Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: mouad,
    name: "Mouad En nasiry",
    position: "Data & AI Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },

  {
    imageUrl: reda,
    name: "Reda El kate",
    position: "Data & AI Co-Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Competitive Programming Head",
    position: "Competitive Programming Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Cyber Security Head",
    position: "Cyber Security Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
  {
    imageUrl: image,
    name: "Cyber Security Co-Head",
    position: "Cyber Security Co-Head",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/company/code-esi" },
      { name: "Instagram", url: "https://www.instagram.com/code.esi" },
    ],
  },
];


export const ExecutiveBoard = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
      default:
        return null;
    }
  };

  return (
    <section id="team" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Our Motivated &nbsp;
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Executive Board{" "}
        </span>
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Meet the dedicated team leading CODE Club at ESI, driving innovation and excellence in technology.
      </p>

      {/* Pyramid structure: President (1) */}
      <div className="grid grid-cols-1 gap-8 justify-items-center mb-10">
        {teamList.slice(0, 1).map(({ imageUrl, name, position, socialNetworks }: TeamProps) => (
          <Card
            key={name}
            className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
          >
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src={imageUrl}
                alt={`${name} ${position}`}
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">{name}</CardTitle>
              <CardDescription className="text-primary">
                {position}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <p>Dedicated to advancing technology and fostering innovation at ESI.</p>
            </CardContent>

            <CardFooter>
              {socialNetworks.map(({ name, url }: SocialNetworksProps) => (
                <div key={name}>
                  <a
                    rel="noreferrer noopener"
                    href={url}
                    target="_blank"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    <span className="sr-only">{name} icon</span>
                    {socialIcon(name)}
                  </a>
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Vice President and General Secretary (2) */}
      <div className="grid grid-cols-2 gap-8 justify-items-center mb-10">
        {teamList.slice(1, 3).map(({ imageUrl, name, position, socialNetworks }: TeamProps) => (
          <Card
            key={name}
            className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
          >
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src={imageUrl}
                alt={`${name} ${position}`}
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">{name}</CardTitle>
              <CardDescription className="text-primary">
                {position}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <p>Dedicated to advancing technology and fostering innovation at ESI.</p>
            </CardContent>

            <CardFooter>
              {socialNetworks.map(({ name, url }: SocialNetworksProps) => (
                <div key={name}>
                  <a
                    rel="noreferrer noopener"
                    href={url}
                    target="_blank"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    <span className="sr-only">{name} icon</span>
                    {socialIcon(name)}
                  </a>
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Remaining team (3 in each row) */}
      <div className="grid md:grid-cols-3 gap-8 justify-items-center">
        {teamList.slice(3).map(({ imageUrl, name, position, socialNetworks }: TeamProps) => (
          <Card
            key={name}
            className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
          >
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src={imageUrl}
                alt={`${name} ${position}`}
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">{name}</CardTitle>
              <CardDescription className="text-primary">
                {position}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <p>Dedicated to advancing technology and fostering innovation at ESI.</p>
            </CardContent>

            <CardFooter>
              {socialNetworks.map(({ name, url }: SocialNetworksProps) => (
                <div key={name}>
                  <a
                    rel="noreferrer noopener"
                    href={url}
                    target="_blank"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    <span className="sr-only">{name} icon</span>
                    {socialIcon(name)}
                  </a>
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExecutiveBoard;
