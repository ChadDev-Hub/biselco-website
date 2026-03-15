"use server";
const baseUrl = process.env.BASESERVERURL;
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// SIGNUP ACTION
export const Signup = async (formdata: FormData) => {
  const data = formdata;
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: "POST",
    body: data,
  });
  const results = await res.json();
  if (!res.ok) {
    return {
      error: results.detail,
    };
  }
  return results;
};

// LOG IN ACTION
export const Login = async (formdata: FormData) => {
  const data = formdata;
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    body: data,
  });
  const results = await res.json();
  if (!res.ok) {
    return {
      error: results.detail,
    };
  }
  return results;
};

// LOUTOUT

export const Logout = async () => {
  const res = await fetch(`${baseUrl}/v1/auth/logout`, { method: "POST" });
  const cookieStore = await cookies();
  if (!res.ok) {
    return {
      status: res.status,
      detail: "Logout Failed",
    };
  }
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  return {
    status: res.status,
    detail: "Logout Successfull",
  };
};

// GOOGLE LOGIN
export const GoogleLoginRoute = async(secretKey?:string)=>{
  const url = secretKey? `${baseUrl}/v1/auth/google/login?secret=${secretKey}`:`${baseUrl}/v1/auth/google/login`
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.detail);
  }
  redirect(url);
}