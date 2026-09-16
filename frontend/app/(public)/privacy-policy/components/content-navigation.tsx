"use client";
import { useState, useEffect } from "react";



type Section = {
  id: string;
  title: string;
};

type Props = {
  sections: Section[];
}

const ContentNavigation = ({ sections }: Props) => {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };
  return (
    <aside className="hidden lg:block lg:col-span-3 sticky top-8">
      <nav className="card bg-base-100 shadow-sm border border-base-300 p-4 rounded-2xl">
        <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/50 mb-3 px-3">
          Table of Contents
        </h3>
        <ul className="space-y-1 text-sm">
          {sections.map((sec) => (
            <li key={sec.id}>
              <button
                onClick={() => scrollToSection(sec.id)}
                className={`w-full btn btn-ghost place-content-start text-left px-3 py-2 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === sec.id
                    ? "bg-primary text-primary-content shadow-sm"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {sec.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ContentNavigation;
