import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, TargetIcon } from "lucide-react";

export const SchoolInfo = () => {
  return (
    <section id="schoolInfo" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Our{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          School{" "}
        </span>
      </h2>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-4 text-2xl md:text-3xl">
            School of Information Science (ESI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <BookOpenIcon className="text-primary w-6 h-6" />
                School Overview
              </h3>
              <p className="text-muted-foreground">
                The <strong>School of Information Science</strong> (École des Sciences de l'Information - ESI) is a prestigious institution of higher education located in Rabat, Morocco. Founded to train elite information science engineers, ESI has built a reputation for excellence in information and communication technologies.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <TargetIcon className="text-primary w-6 h-6" />
                School's Mission
              </h3>
              <p className="text-muted-foreground">
                School's Mission is to train high-level engineers capable of meeting the technological challenges of the 21st century. We strive to cultivate innovation, creativity, and critical thinking in our students, while equipping them with the technical and managerial skills necessary to excel in their careers.
              </p>

            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
