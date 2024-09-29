import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Menu, Instagram, Youtube, Linkedin } from "lucide-react";
import logo from "@/assets/icon.png";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#ourCells",
    label: "Cells",
  },
  {
    href: "#event-gallery",
    label: "Activities",
  },

  {
    href: "#team",
    label: "Executive Board",
  },
  {
    href: "#contactus",
    label: "Contact Us",
  },
];

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/codesi18", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/code.esi", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UCStGpNYpG_2ROS6E6T-mvPg", label: "YouTube" },
  { icon: GitHubLogoIcon, href: "https://github.com/CODE-ESI-CLUB", label: "GitHub" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-lg border-b-[1px] border-transparent dark:border-b-slate-700">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex text-black dark:text-white items-center"
            >
              <img src={logo} alt="Code Club Logo" className="h-8 w-15 mr-2" />
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">CODE Club</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <div className="flex gap-2 mt-4">
                    {socialLinks.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        rel="noreferrer noopener"
                        href={href}
                        target="_blank"
                        className={`p-2 ${buttonVariants({ variant: "ghost" })}`}
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`p-2 hover:bg-white hover:bg-opacity-10 ${buttonVariants({ variant: "ghost" })}
                `}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                rel="noreferrer noopener"
                href={href}
                target="_blank"
                className={`p-2 hover:bg-white hover:bg-opacity-10 ${buttonVariants({ variant: "ghost" })}`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
