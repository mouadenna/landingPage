import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlusIcon, BookOpenIcon, UsersIcon, TrophyIcon, CodeIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQCAsgIwi8m_soYbnBN5XVUcs1qNT_5Io",
  authDomain: "passwordgame1.firebaseapp.com",
  databaseURL: "https://passwordgame1-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "passwordgame1",
  storageBucket: "passwordgame1.appspot.com",
  messagingSenderId: "813385507628",
  appId: "1:813385507628:web:03c3f9187e95f4401c0289",
  measurementId: "G-LY3QF8X1FN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const JoinUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    yearOfStudy: "",
    major: "",
    preferredCell: "",
    motivation: "",
  });

  const majors = [
    { value: "ICSD", label: "ICSD" },
    { value: "ISSIC", label: "ISSIC" },
    { value: "ISITD", label: "ISITD" },
    { value: "IIN", label: "IIN" },
    { value: "ms_imoic", label: "MS IMOIC" },
    { value: "ms_ics", label: "MS ICS" },
    { value: "ms_mi", label: "MS MI" },
  ];

  const years = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
  ];

  const cells = [
    { value: "cybersecurity", label: "Cybersecurity Cell" },
    { value: "dataAI", label: "Data & AI Cell" },
    { value: "competitiveProgramming", label: "Competitive Programming Cell" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.phoneNumber || 
          !formData.yearOfStudy || !formData.major || !formData.preferredCell || 
          !formData.motivation) {
        throw new Error("Please fill in all fields");
      }

      // Generate a unique ID for the application
      const applicationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to Firebase
      await set(ref(database, 'applications/' + applicationId), {
        ...formData,
        timestamp: Date.now(),
        status: 'pending',
        reviewed: false  // New field added here
      });

      // Show success message
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest in joining Code Club! We'll review your application and see you at the recruitment day.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        yearOfStudy: "",
        major: "",
        preferredCell: "",
        motivation: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="joinus" className="container py-24 sm:py-32">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Join{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Code Club
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Left Card - Club Information */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold">Why Join Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <CodeIcon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Specialized Cells</h3>
                  <p>Join our Cybersecurity, Data & AI, or Competitive Programming cells</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BookOpenIcon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Learn and Grow</h3>
                  <p>Hands-on projects and workshops tailored to your major</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <UsersIcon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Community</h3>
                  <p>Connect with peers across different years and specializations</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <TrophyIcon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Compete & Excel</h3>
                  <p>Represent ESI in national and international competitions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Application Form */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-semibold">Apply to Join</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    placeholder="Your Email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    required
                    placeholder="Your Phone Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study</Label>
                  <Select 
                    onValueChange={(value) => handleChange("yearOfStudy", value)}
                    value={formData.yearOfStudy}
                  >
                    <SelectTrigger id="yearOfStudy">
                      <SelectValue placeholder="Select Year of Study" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Select
                    onValueChange={(value) => handleChange("major", value)}
                    value={formData.major}
                  >
                    <SelectTrigger id="major">
                      <SelectValue placeholder="Select Your Major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major.value} value={major.value}>
                          {major.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredCell">Desired Cell</Label>
                  <Select
                    onValueChange={(value) => handleChange("preferredCell", value)}
                    value={formData.preferredCell}
                  >
                    <SelectTrigger id="preferredCell">
                      <SelectValue placeholder="Select Your desired cell" />
                    </SelectTrigger>
                    <SelectContent>
                      {cells.map((cell) => (
                        <SelectItem key={cell.value} value={cell.value}>
                          {cell.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivation</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleChange("motivation", e.target.value)}
                    placeholder="Why do you want to join this specific cell? What do you hope to achieve?"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <UserPlusIcon className="mr-2 h-5 w-5" /> Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Toaster />
    </>
  );
};
