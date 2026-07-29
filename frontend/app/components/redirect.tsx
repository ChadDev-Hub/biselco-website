"use client";
import { useAuth } from "@/app/context/authProvider";
import {useRouter} from "next/navigation";
import LandingPageLoadingImage from "@/app/(public)/landing/components/landingPageLoading";
import {useEffect} from "react";
const Redirect = () => {
  const { loading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.push("/landing", { scroll: false });
    if (!loading && user) router.push("/home", { scroll: false });
  }, [loading, user, router]);
  if (loading) return <LandingPageLoadingImage />;
  return null;
};

export default Redirect;
