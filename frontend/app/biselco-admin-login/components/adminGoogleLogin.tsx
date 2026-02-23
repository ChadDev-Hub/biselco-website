"use client"

import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { useAlert } from '@/app/common/alert';
type Props = {
    adminLoginSecretKey: string;
}

const AdminGoogleLogin = ({adminLoginSecretKey}:Props) => {

    const {showAlert} = useAlert();
  return (
    <GoogleLogin
      type="standard"
      onSuccess={async (credentialResponse) => {
        if(!adminLoginSecretKey || adminLoginSecretKey.trim() === ''){
            showAlert("error", "Please Enter Admin Login Secret Key");
            return
        } 
        // Send token to your backend
        const res = await fetch(`http://localhost:8000/v1/auth/google/admin/${adminLoginSecretKey}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        });
        if (!res.ok) {
          switch (res.status) {
            case 403:
                showAlert("error", (await res.json().then((data) => data.detail)));
                break;
            default:
                break;
          }
          return;
        }
        window.location.href = "/";
      }}
      onError={() => showAlert("error", "Login Failed")}
    />
  )
}
export default AdminGoogleLogin