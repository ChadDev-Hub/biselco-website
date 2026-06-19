"use client";
import { useState, useEffect } from "react";
import { AgmaVerificationType } from "@/types/agma";
import {CircleCheck, CircleX} from 'lucide-react'
import {VerifyRegistered} from "@/app/actions/agma";

type Props = {
  verification: AgmaVerificationType;
};
const VerificationButton = ({ verification }: Props) => {
  const { is_verified, id } = verification;
  const [verifiedStatus, setVerifiedStatus] = useState<boolean>();

  useEffect(() => {
    console.log(is_verified);
    setVerifiedStatus(is_verified);
  }, [is_verified]);
  

  const handleVerification = async() => {
    const res = await VerifyRegistered(id, !verifiedStatus);
    if (res?.status === 200) {
      console.log(res.data.message);
    }
  }
  return (
    <label className="flex gap-2 items-center">
      <p className={`text-xs ${verifiedStatus ? "text-green-500" : "text-red-500"}`}>{verifiedStatus ? "Verified" : "Unverified"}</p>
      <label className={`toggle py-2 ${verifiedStatus ? "text-green-500" : "text-red-500"}`}>
            <input onClick={handleVerification} title="verification" type="checkbox" checked={verifiedStatus} />
            <CircleCheck aria-label={`enabled`} className={`size-4 rounded-full`}/>
            <CircleX aria-label={`disabled`} className={ `size-4 rounded-full`}/>
      </label>
    </label>
  );
};

export default VerificationButton;
