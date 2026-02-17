"use client";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        // Send token to your backend
        await fetch("http://localhost:8000/auth/google", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        });

        window.location.href = "/"; 
      }}
      onError={() => console.log("Login Failed")}
    />
  );
}
