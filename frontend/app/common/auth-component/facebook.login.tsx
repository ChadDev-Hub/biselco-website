
"use client";
import { FacebookLoginRoute } from '../../../lib/private-api/auth';
import { ApiError } from '../../../types/api-error';

const FacebookLogin = () => {
    const handleLogin = async () => {
      try {
        const res = await FacebookLoginRoute();
        window.location.href = res.url;
        localStorage.setItem("LoginStatus", "true");
      } catch (error) {
        if (error instanceof ApiError) {
          alert(error.message);
        } else if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  return (
    <div className="aura text-blue-500  aura-dual w-full">
        <button onClick={handleLogin} className="btn w-full  bg-[#1A77F2] text-white border-[#005fd8]">
      <svg
        aria-label="Facebook logo"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path
          fill="white"
          d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
        ></path>
      </svg>
      Facebook
    </button>

    </div>
    
  );
};

export default FacebookLogin;
