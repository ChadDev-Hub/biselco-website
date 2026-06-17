"use client"
import AdminGoogleLogin from "./adminGoogleLogin";
import { GoogleLoginRoute } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler} from "react-hook-form";


type FormType = {
    adminLoginSecretKey: string
}
const LoginForm = () => {
  const router = useRouter()
  const {
    register,
    setError,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<FormType>();
  const handleLogin: SubmitHandler<FormType>=async(data) => {
    const res = await GoogleLoginRoute(data.adminLoginSecretKey);
    switch (res?.status) {
      case 200:
         router.push(res.data.url);
        break;
      case 409:
        setError("adminLoginSecretKey", { message: res.error });
        break;
      default:
        break;
    }
  }
  return (
    <div className="w-full flex justify-center bg-base-100 p-6 text-center rounded-box shadow-md max-w-md">
      <form onSubmit={handleSubmit(handleLogin)}>
        <label className="label font-bold">Admin Login Secret Key</label>
        <input
          {...register("adminLoginSecretKey", {required:{value:true, message:"Admin Login Secret Key is required"}})}
          type="text"
          className="input w-full rounded-full mb-2"
          placeholder="Input Admin Login Secret Key"
        />
        {errors.adminLoginSecretKey && (
          <span className="text-red-500 text-center text-xs italic">
            {errors.adminLoginSecretKey.message}
          </span>
        )}
        <div className="flex justify-center items-center">
          <div className="flex items-center rounded-full border overflow-hidden">
            <AdminGoogleLogin isLoading={isSubmitting}/>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
