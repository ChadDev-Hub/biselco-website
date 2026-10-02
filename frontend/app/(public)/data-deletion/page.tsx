import Header from "../privacy-policy/components/header";
import Return from "../privacy-policy/components/return";
import ContentNavigation from "../privacy-policy/components/content-navigation";
import Content from "./components/content";

const sections = [{ 
  id: "intro", 
  title: "Overview" },{
    id: "info-collected",
    title: "1. Information We Collect"
  },{
    id:"google-facebook-signin",
    title: "2. Google Sign-In"
  },{
    id:"request-deletion",
    title: "3. Request Deletion"
  },{
    id:"deletion-process",
    title:"4. Deletion Process"
  },{
    id:"retention",
    title: "5. Data Retention"
  }
  ];
const DataDeletion = () => {
  return (
    <main className="min-h-screen relative bg-base-200/60 font-sans antialiased">
      <Return />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Header
          title="Data Deletion"
          description="Effective"
          date="September 16, 2026"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ContentNavigation sections={sections} />
          <Content />
        </div>
      </div>
    </main>
  );
};

export default DataDeletion;
