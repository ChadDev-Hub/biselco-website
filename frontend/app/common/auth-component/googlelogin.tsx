"use client";
import { GoogleLogin } from "@react-oauth/google";


export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      type="standard"
      
      onSuccess={async (credentialResponse) => {
        // Send token to your backend
        const res = await fetch("http://localhost:8000/v1/auth/google", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        });
        console.log(res)
        if (!res.ok) {
          return;
        }
        window.location.href = "/";
      }}
      onError={() => console.log("Login Failed")}
    />
  );
}
