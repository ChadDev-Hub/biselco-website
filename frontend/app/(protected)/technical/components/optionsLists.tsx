"use client";
import { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TechnicalFormsType } from "../../../../types/technical";
import ToolCard from "@/app/common/tools-compnent/tool-card";
import ComingSoon from "@/app/common/tools-compnent/coming-soon-tool-card";
import { ToolCase } from "lucide-react";

type Props = {
  initialData: Promise<TechnicalFormsType[]>;
};

const TechniclaFormLists = ({ initialData }: Props) => {
  const formsData = use(initialData);
  const [forms, setForms] = useState<TechnicalFormsType[] | []>([]);
  const pathname = usePathname();
  useEffect(() => {
    queueMicrotask(() => setForms(formsData));
  }, [formsData]);
  const commingsoontool = ["Maintenance Daily", "Construction Daily"];
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl px-2">
      {forms?.map((form: TechnicalFormsType) => (
        <div key={form.id}>
          {commingsoontool.includes(form.form_name) ? (
            <ComingSoon>
              <ToolCard
                icon={<ToolCase className="text-yellow-500" />}
                title={form.form_name}
                href={`${pathname}/${form.form_name.replace(/\s/g, "-").toLowerCase()}`}
              />
            </ComingSoon>
          ) : (
            <ToolCard
              icon={<ToolCase className="text-yellow-500" />}
              title={form.form_name}
              href={`${pathname}/${form.form_name.replace(/\s/g, "-").toLowerCase()}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TechniclaFormLists;
