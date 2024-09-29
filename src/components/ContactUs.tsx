import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from "lucide-react";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/mgvwgowp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section id="contactus" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Contact{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Us
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
  {/* Left Card - Contact Information */}
  <Card className="bg-muted/50">
    <CardHeader className="pb-8">
      <CardTitle className="text-3xl font-semibold text-center">
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-8">
      {/* Email Section */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <MailIcon className="text-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <a href="mailto:code@esi.ac.ma" className="text-primary hover:underline">
            code@esi.ac.ma
          </a>
        </div>
      </div>

      {/* Phone Section */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <PhoneIcon className="text-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Phone</h3>
          <a href="tel:+212659373635" className="text-primary hover:underline">
            +212 6 81 86 55 40
          </a>
        </div>
      </div>

      {/* Address Section */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <MapPinIcon className="text-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Address</h3>
          <a
            href="https://www.google.com/maps?q=Avenue+Allal+El+Fassi,+Cité+Al+Irfane+B.P:+6204+Rabat-instituts+10+100+Rabat,+Morocco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Avenue Allal El Fassi, Cité Al Irfane B.P: 6204 Rabat-instituts 10 100 Rabat, Morocco
          </a>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Right Card - Form */}
  <Card className="bg-muted/50">
    <CardHeader className="pb-8">
      <CardTitle className="text-3xl font-semibold text-center">
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
        />
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Your Email"
        />
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Your Message"
          rows={5}
          aria-label="Your Message"
          className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-base text-black dark:text-white bg-black dark:bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" className="w-full text-lg py-6">
          <SendIcon className="mr-2 h-5 w-5" /> Send Message
        </Button>
      </form>
    </CardContent>
  </Card>
</div>

    </section>
  );
};
