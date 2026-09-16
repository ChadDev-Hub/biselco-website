
import ContentNavigation from "./components/content-navigation";
import Content from "./components/content";
import Header from "./components/header";
import Return from "./components/return"

const sections = [
  { id: "intro", title: "Overview" },
  { id: "info-collected", title: "1. Information We Collect" },
  { id: "google-signin", title: "2. Google Sign-In" },
  { id: "facebook-login", title: "3. Facebook Login" },
  { id: "use-of-info", title: "4. How We Use Information" },
  { id: "info-sharing", title: "5. Information Sharing" },
  { id: "storage-security", title: "6. Data Storage & Security" },
  { id: "cookies", title: "7. Cookies & Tech" },
  { id: "retention", title: "8. Data Retention" },
  { id: "your-rights", title: "9. Your Rights" },
  { id: "account-deletion", title: "10. Account Deletion" },
  { id: "third-party", title: "11. Third-Party Services" },
  { id: "children", title: "12. Children's Privacy" },
  { id: "changes", title: "13. Policy Changes" },
  { id: "contact", title: "14. Contact Us" },
];

const PrivacyPolicyPage = () => {
  

 

  return (
    <main className="min-h-screen relative bg-base-200/60 font-sans antialiased">
      <Return />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <Header title="Privacy Policy" description="Effective" date="September 16, 2026" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Navigation */}
          <ContentNavigation sections={sections} />

          {/* Main Content Article */}
          <Content/>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
