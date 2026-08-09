import { GetTechnicalForm } from "@/lib/private-api/server-side/technical";
import TechniclaFormLists from "./components/optionsLists";
import { Suspense } from "react";
import OptionListsSkeleton from "./components/optionlistsSkeleton";
import Header from "./new-connection/components/header"
export const dynamic = "force-dynamic";
const TechnicalPage = () => {
  const technicalForms = GetTechnicalForm();
  return (
    <div className="min-h-screen w-full space-y-2 bg-base-300 pb-20 z-60">
      <Header title="Technical" />
      <main className="max-w-2xl mx-auto px-4 ">
        <Suspense fallback={<OptionListsSkeleton forms={4} />}>
          <TechniclaFormLists initialData={technicalForms} />
        </Suspense>
      </main>
    </div>
  );
};

export default TechnicalPage;
