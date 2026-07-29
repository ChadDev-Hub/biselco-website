"use client";
import { useState } from "react";
import { AgmaVerificationType } from "@/types/agma";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { VerifyRegistered } from "@/app/actions/agma";

type Props = {
  verification: AgmaVerificationType;
};
const VerificationButton = ({ verification }: Props) => {
  const { is_verified, id } = verification;
  
  const [loading, setIsLoading] = useState(false);
  

  const handleVerification = async () => {
    setIsLoading(true);
    const res = await VerifyRegistered(id, !is_verified);
    if (res?.status === 200) {
      setIsLoading(false);
    }
  };
  return (
    <label key={id} className="flex gap-2 items-center">
      <p
        className={`text-xs ${is_verified ? "text-green-500" : "text-red-500"}`}
      >
        {is_verified ? "Verified" : "Unverified"}
      </p>
      <label
        className={`toggle py-2 ${is_verified ? "text-green-500" : "text-red-500"}`}
      >
        <input
          onChange={handleVerification}
          title="verification"
          type="checkbox"
          checked={is_verified}
        />
        {loading ? (
          <Loader  className={`size-4 rounded-full animate-spin`} />
        ) : (
          <CircleX
            aria-label={`enabled`}
            className={`size-4 rounded-full`}
          />
        )}
        {loading ? (
          <Loader  className={`size-4 rounded-full animate-spin`} />
        ) : (
          <CircleCheck aria-label={`disabled`} className={`size-4 rounded-full`} />
        )}
      </label>
    </label>
  );
};

export default VerificationButton;
