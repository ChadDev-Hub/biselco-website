

import ContentNavigation from "../privacy-policy/components/content-navigation";
import Content from "./components/content";
import Header from "../privacy-policy/components/header";
import Return from "../privacy-policy/components/return"
const sections = [
  { id: "intro", title: "Overview" },
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "changes-terms", title: "2. Changes to Terms" },
  { id: "accounts", title: "3. User Accounts & Registration" },
  { id: "acceptable-use", title: "4. Acceptable Use Policy" },
  { id: "intellectual-property", title: "5. Intellectual Property" },
  { id: "submissions", title: "6. User Content & Submissions" },
  { id: "third-party-links", title: "7. Third-Party Services" },
  { id: "termination", title: "8. Termination & Suspension" },
  { id: "disclaimers", title: "9. Warranties & Disclaimers" },
  { id: "limitation-liability", title: "10. Limitation of Liability" },
  { id: "indemnification", title: "11. Indemnification" },
  { id: "governing-law", title: "12. Governing Law" },
  { id: "contact", title: "13. Contact Us" },
];

const TermsOfServicePage = () => {
  
  return (
    <main className="min-h-screen bg-base-200/60 font-sans antialiased relative">
      <Return />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <Header title="Terms of Service" description="Effective" date="September 16, 2026" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Table of Contents (Desktop Sidebar) */}
          <ContentNavigation sections={sections} />

          {/* Main Content Article */}
          <Content />
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;