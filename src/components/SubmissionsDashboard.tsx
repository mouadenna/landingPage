import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { UserIcon, CalendarIcon, SchoolIcon, PhoneIcon, MailIcon, CheckCircleIcon, SearchIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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

interface Submission {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  yearOfStudy: string;
  major: string;
  preferredCell: string;
  motivation: string;
  timestamp: number;
  reviewed: boolean;
}

const DASHBOARD_PASSWORD = "claudewillreplaceyou";

const cellInfo = {
  cybersecurity: {
    title: "Cybersecurity Cell",
    description: "Applications for the Cybersecurity specialization",
    color: "bg-blue-500",
  },
  dataAI: {
    title: "Data & AI Cell",
    description: "Applications for the Data Science and AI specialization",
    color: "bg-green-500",
  },
  competitiveProgramming: {
    title: "Competitive Programming Cell",
    description: "Applications for the Competitive Programming specialization",
    color: "bg-purple-500",
  },
};

export const SubmissionsDashboard = () => {
  const [submissions, setSubmissions] = useState<{ [key: string]: Submission[] }>({
    cybersecurity: [],
    dataAI: [],
    competitiveProgramming: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({
    cybersecurity: "",
    dataAI: "",
    competitiveProgramming: "",
  });
  const [activeTab, setActiveTab] = useState<{ [key: string]: "new" | "reviewed" }>({
    cybersecurity: "new",
    dataAI: "new",
    competitiveProgramming: "new",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const submissionsRef = ref(database, 'applications');
    
    const unsubscribe = onValue(submissionsRef, (snapshot) => {
      const data = snapshot.val();
      const groupedSubmissions: { [key: string]: Submission[] } = {
        cybersecurity: [],
        dataAI: [],
        competitiveProgramming: [],
      };
      
      if (data) {
        Object.entries(data).forEach(([id, submission]) => {
          const typedSubmission = submission as Omit<Submission, 'id'>;
          groupedSubmissions[typedSubmission.preferredCell].push({
            ...typedSubmission,
            id,
            reviewed: typedSubmission.reviewed || false,
          });
        });
      }
      
      // Sort submissions by timestamp (newest first)
      Object.keys(groupedSubmissions).forEach((cell) => {
        groupedSubmissions[cell].sort((a, b) => b.timestamp - a.timestamp);
      });
      
      setSubmissions(groupedSubmissions);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleReviewedChange = async (submissionId: string, cell: string, isReviewed: boolean) => {
    try {
      const submissionRef = ref(database, `applications/${submissionId}`);
      await update(submissionRef, { reviewed: isReviewed });
      console.log(cell); // Example usage of 'cell'
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const filteredSubmissions = (cellSubmissions: Submission[], cell: string) => {
    const searchTerm = searchTerms[cell].toLowerCase();
    return cellSubmissions.filter(submission =>
      (submission.name.toLowerCase().includes(searchTerm) ||
      submission.email.toLowerCase().includes(searchTerm) ||
      submission.major.toLowerCase().includes(searchTerm)) &&
      submission.reviewed === (activeTab[cell] === "reviewed")
    );
  };

  const renderSubmissionTable = (cellSubmissions: Submission[], cell: string) => (
    <Accordion type="multiple" className="w-full">
      {filteredSubmissions(cellSubmissions, cell).map((submission) => (
        <AccordionItem key={submission.id} value={submission.id}>
                    <AccordionTrigger>
            <div className="grid grid-cols-5 w-full items-center">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 min-w-[200px]">
                  <Checkbox
                    id={`reviewed-${submission.id}`}
                    checked={submission.reviewed}
                    onCheckedChange={(checked) => {
                      handleReviewedChange(submission.id, cell, checked as boolean);
                    }}
                    className={`h-4 w-4 ${submission.reviewed ? 'bg-green-500' : 'bg-white'}`}
                  />
                  <UserIcon className="h-4 w-4" />
                  <span className="truncate">{submission.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SchoolIcon className="h-4 w-4" />
                <span className="truncate">{submission.major}</span>
              </div>
              <div>Year {submission.yearOfStudy}</div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end">
                {submission.reviewed && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4" />
                <span>{submission.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{submission.phoneNumber}</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Motivation:</h4>
                <p className="text-muted-foreground">{submission.motivation}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (!isAuthenticated) {
    return (
      <div className="container py-24 sm:py-32 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Enter Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter dashboard password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full">Access Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-24 sm:py-32">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Submissions Dashboard
      </h2>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Applications Overview</CardTitle>
              <div className="flex space-x-2">
                {Object.entries(submissions).map(([cell, cellSubmissions]) => (
                  <Badge key={cell} variant="secondary">
                    {cellInfo[cell as keyof typeof cellInfo].title}: {cellSubmissions.length}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="cybersecurity">
          <TabsList className="grid grid-cols-3 mb-8">
            {Object.entries(cellInfo).map(([value, { title }]) => (
              <TabsTrigger key={value} value={value}>
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(cellInfo).map(([value, { title, description, color }]) => (
            <TabsContent key={value} value={value}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{description}</p>
                    </div>
                    <Badge className={color}>
                      {submissions[value].length} Applications
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center">
                    <Input
                      placeholder="Search by name, email, or major"
                      value={searchTerms[value]}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, [value]: e.target.value }))}
                      className="mr-2"
                    />
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Tabs defaultValue="new" onValueChange={(tab) => setActiveTab(prev => ({ ...prev, [value]: tab as "new" | "reviewed" }))}>
                    <TabsList>
                      <TabsTrigger value="new">New Candidates</TabsTrigger>
                      <TabsTrigger value="reviewed">Reviewed Candidates</TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">
                      {submissions[value].some(s => !s.reviewed) ? (
                        renderSubmissionTable(submissions[value], value)
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No new applications for this cell.
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="reviewed">
                      {submissions[value].some(s => s.reviewed) ? (
                        renderSubmissionTable(submissions[value], value)
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No reviewed applications for this cell.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};