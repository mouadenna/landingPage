import { useState } from "react";
import { buttonVariants } from "./ui/button";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/mgvwgowp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <section className="container mx-auto py-10 px-4 " id="contactus">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Contact {" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Us{" "}
        </span>
      </h2>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-black dark:text-white mb-1 font-semibold text-xl">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-black dark:text-white bg-transparent"
            placeholder="Your Name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-black dark:text-white mb-1 font-semibold text-xl">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-black dark:text-white bg-transparent"
            placeholder="Your Email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="text-black dark:text-white mb-1 font-semibold text-xl">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-black dark:text-white bg-transparent"
            placeholder="Your Message"
            rows={6}
          />
        </div>
        <button
          type="submit"
          className={`${buttonVariants({
            variant: "default",
          })} mt-4 w-full text-black dark:text-white`}
        >
          Send Message
        </button>
      </form>
    </section>
  );
};