import React, { useState, useRef, useEffect } from 'react';
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
import mouad from '@/assets/board/mouad.png';
import salim from '@/assets/board/salim.jpg';
import reda from '@/assets/board/reda.jpg';
import noura from '@/assets/board/noura.jpg';
import nouha from '@/assets/board/nouha.jpg';
import ashraf from '@/assets/board/ashraf.jpeg'
import manal from '@/assets/board/manal.jpeg'
import hiba from '@/assets/board/hiba.jpeg'
import ikram from '@/assets/board/ikram.jpeg'
import salma from '@/assets/board/salma.jpeg'
import wafae from '@/assets/board/wafae.jpeg'
import omar from '@/assets/board/omar.jpeg'

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  description: string;
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
    description: "Leading the club's vision and overall strategy.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/noura-ed-dahby-47998b222" },
      { name: "Instagram", url: "https://www.instagram.com/norah.trz/" },
    ],
  },
  {
    imageUrl: omar,
    name: "Omar Salouani",
    position: "Vice President",
    description: "Supporting the president and overseeing club operations.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/omar-salouani/" },
    ],
  },
  {
    imageUrl: ikram,
    name: "Ikram Mesbah",
    position: "General Secretary",
    description: "Managing administrative tasks and internal communication.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/ikram-mesbah-b904232b4/" },
      { name: "Instagram", url: "https://www.instagram.com/ik_kiba/" },
    ],
  },
  {
    imageUrl: nouha,
    name: "Nouhaila Lachgar",
    position: "Media Head",
    description: "Crafting and executing the club's media and outreach strategies.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/nouhaila-lachgar-b92475284/" },
      { name: "Instagram", url: "https://www.instagram.com/nouha.ie" },
    ],
  },
  {
    imageUrl: hiba,
    name: "Hiba Alami Chentoufi",
    position: "Sponsoring Head",
    description: "Leading sponsorship initiatives and organizing training sessions.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/hiba-alami-chentoufi-386b2929a" },
      { name: "Instagram", url: "https://www.instagram.com/hiiba.ac1" },
    ],
  },
  {
    imageUrl: manal,
    name: "Manal Maati",
    position: "Sponsoring Co-Head",
    description: "Assisting in sponsorship efforts and coordinating training sessions.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/manal-mt-7255ab296" },
      { name: "Instagram", url: "https://www.instagram.com/ae.maanalle/" },
    ],
  },
  {
    imageUrl: salim,
    name: "Salim El mardi",
    position: "Data & AI Co-Head",
    description: "Co-leading data science and AI initiatives, organizing related training.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/elmardisalim/" },
      { name: "Instagram", url: "https://www.instagram.com/salim.elmardi/" },
    ],
  },
  {
    imageUrl: mouad,
    name: "Mouad En nasiry",
    position: "Data & AI Head",
    description: "Spearheading data science and AI projects, conducting training workshops.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/mouad-ennasiry/" },
      { name: "Instagram", url: "https://www.instagram.com/mouadenna/" },
    ],
  },
  {
    imageUrl: reda,
    name: "Reda El kate",
    position: "Data & AI Co-Head",
    description: "Supporting data science and AI initiatives, facilitating training sessions.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/reda-el-kate-b6360628b/" },
      { name: "Instagram", url: "https://www.instagram.com/reda.elkate/" },
    ],
  },
  {
    imageUrl: wafae,
    name: "Wafae Boumajjane",
    position: "Competitive Programming Head",
    description: "Organizing coding competitions and leading training sessions.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/wafae-boumajjane-4a8234287" },
    ],
  },
  {
    imageUrl: ashraf,
    name: "Ashraf Abiba",
    position: "Cyber Security Head",
    description: "Leading cybersecurity initiatives and conducting training programs.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/ashraf-abiba-836820207/" },
      { name: "Instagram", url: "https://www.instagram.com/pitcho_lana/" },
    ],
  },
  {
    imageUrl: salma,
    name: "Salma Hermak",
    position: "Cyber Security Co-Head",
    description: "Supporting cybersecurity projects and assisting with training efforts.",
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/in/salma-hermak-127878249/" },
      { name: "Instagram", url: "https://www.instagram.com/hermaksalma" },
    ],
  },
];

export const ExecutiveBoard = () => {
  const [visibleCards, setVisibleCards] = useState<{ [key: string]: boolean }>({});
  const cardRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.id;
            setVisibleCards(prev => ({ ...prev, [cardId]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    teamList.forEach((_, index) => {
      const cardId = `card-${index}`;
      if (cardRefs.current[cardId] && cardRefs.current[cardId].current) {
        observer.observe(cardRefs.current[cardId].current!);
      }
    });

    return () => observer.disconnect();
  }, []);

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

  const renderCard = ({ imageUrl, name, position, description, socialNetworks }: TeamProps, index: number) => {
    const cardId = `card-${index}`;
    cardRefs.current[cardId] = cardRefs.current[cardId] || React.createRef();

    return (
      <Card
        key={cardId}
        id={cardId}
        ref={cardRefs.current[cardId]}
        className={`bg-muted/50 relative mt-8 flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
          visibleCards[cardId] ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
        }`}
        style={{ transitionDelay: `${index * 70}ms` }}
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
          <p>{description}</p>
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
    );
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
        {teamList.slice(0, 1).map((member, index) => renderCard(member, index))}
      </div>

      {/* Vice President and General Secretary (2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mb-10">
        {teamList.slice(1, 3).map((member, index) => renderCard(member, index + 1))}
      </div>

      {/* Remaining team (3 in each row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {teamList.slice(3).map((member, index) => renderCard(member, index + 3))}
      </div>
    </section>
  );
};

export default ExecutiveBoard;