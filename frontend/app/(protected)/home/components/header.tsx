"use client";

import { useAuth } from "@/app/context/authProvider";
import { redirect } from "next/navigation";
import {usePathname} from "next/navigation";
type Props = {
  title?: Title;
  description?: string;
  icon?: React.ReactNode;
};

type Title = {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, description}: Props) => {
  const { user, loading } = useAuth();
  const currentPath = usePathname();
  
  if (loading)
    return (
      <header className="bg-blue-700 text-white p-6 rounded-b-4xl shadow-lg">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-blue-100 uppercase tracking-tight skeleton skeleton-text">
              Loading...
            </h1>
            <p className="text-2xl font-semibold skeleton skeleton-text">Loading...</p>
          </div>
          <button
            title="notif"
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"
          >
          </button>
        </div>
      </header>
    );
  if (!user) {
    redirect("/landing");
  }
  return (
    <header className="bg-blue-700 w-full  text-white p-6 rounded-b-4xl shadow-lg">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-blue-100 uppercase tracking-tight ">
            {/* TITLE */}
            <span>{title?.title}</span>
            <br />
            <span className="text-yellow-300 font-extrabold ">{title?.subtitle}</span>
          </h1>
          <p className="text-2xl font-semibold"> {currentPath === "/home" ?  `Hello ${user.first_name} !` : description }</p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
