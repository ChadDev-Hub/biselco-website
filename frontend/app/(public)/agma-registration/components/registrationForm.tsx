"use client";
import { useCallback, useRef } from "react";
import SignatureCanvas from "./signatureCanvas";
import SignaturePad from "signature_pad";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { RegisterAgma } from "@/app/actions/agma";
import { redirect, useRouter } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import Image from "next/image";
import SearchResults from "./searchResults";
import { Contact, Phone, Zap, Camera, ReceiptText, FileText} from "lucide-react";
import { FormType } from "@/types/agma";

const labelClassName =
  "label font-bold text-xs text-shadow-white text-shadow-md";
const inputClassName =
  "input w-full input-sm rounded-box focus:ring-2 focus:ring-blue-600 outline-none";
const RegistrationForm = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setError,
    clearErrors,
    reset,
  } = useForm<FormType>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const router = useRouter();
  const { showAlert } = useAlert();

  // WATCH INPUTS
  const accountNoWatched = useWatch({
    control: control,
    name: "account_no",
  });

  const ImageWatched = useWatch({
    control: control,
    name: "image",
  });

  const SampleBillWatched = useWatch({
    control: control,
    name: "sample_bill",
  });


  const AuthorizationLetterWatched = useWatch({
    control: control,
    name: "authorization_letter",
  })
  const clearSignatureErrror = () => {
    clearErrors("signature");
  };

  const ImageFile = ImageWatched?.[0];
  const SampleBillFile = SampleBillWatched?.[0];
  const AuthorizationLetter = AuthorizationLetterWatched?.[0];

  // ---------------------------------------------------------------------------
  const getSignatureFile = async (signaturePad: SignaturePad | null) => {
    if (!signaturePad) return null;

    if (signaturePad.isEmpty()) {
      return null;
    }

    const dataUrl = signaturePad.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], "signature.png", {
      type: "image/png",
    });
  };
  // ---------------------------------------------------------------------------

  const handleError = useCallback(
    (message: string) => {
      setError("account_no", {
        type: "validate",
        message,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      showAlert("error", message);
    },
    [showAlert, setError],
  );

  // HANDLE SUBMIT
  const onSubmit: SubmitHandler<FormType> = useCallback(
    async (data) => {
      const pad = signaturePadRef.current;
    
      const signature = await getSignatureFile(pad);

      if (!signature) {
        setError("signature", {
          type: "required",
          message: "Please Sign Here",
        });
        return;
      }

      const formData = new FormData();

      formData.append("account_no", data.account_no);
      formData.append("name", data.name);
      if(data.mobile_number) formData.append("mobile_no", data.mobile_number);
      formData.append("image", data.image[0]);
      if(data.sample_bill?.[0]) formData.append("sample_bill", data.sample_bill[0]);
      formData.append("signature", signature);
      if(data.authorization_letter?.[0]) formData.append("authorization_letter", data.authorization_letter[0]);
     
      const res = await RegisterAgma(formData);
      switch (res.status) {
        case 400:
          reset();
          handleError(res.error);
          redirect("/");
          break;
        case 401:
          handleError(res.error);
          break;
        case 404:
          handleError(res.error);
          break;
        case 201:
          reset();
          showAlert(
            "success",
            "Registration Successfull Please Wait Preparing Your Ticket",
          );
          signaturePadRef.current?.clear();
          const newParams = new URLSearchParams();
          newParams.set("id", res.data.id);
          router.push(`/agma-registration/registered?${newParams.toString()}`);
          break;
        default:
          break;
      }
    },
    [setError, reset, router, handleError, showAlert],
  );
  return (
    <div className="w-full flex justify-center max-w-lg">
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
        className="form flex flex-col gap-2 h-full w-full  rounded-box bg-base-200 shadow-md"
      >
        <header className="w-full bg-linear-to-r p-2 rounded-t-box from-blue-500 via-blue-300 to-violet-300">
          <h1 className="text-lg text-violet-600 font-extrabold text-shadow-2xs text-shadow-white">
            Register Now
          </h1>
        </header>
        {/* TITLE */}

        <div className="grid p-3 grid-cols gap-2 grid-cols-3">
          {/* Profile Picture */}
          <div className="flex flex-col gap-2">
            {/* IMAGE UPLOAD */}
            <section className="flex flex-col gap-3 w-full">
              <label className={labelClassName}>Your Latest Photo</label>

              {/* Modern Interactive Avatar Container */}
              <label className="relative group flex self-center items-center justify-center h-24 w-24 rounded-full border-2 border-dashed border-base-300 hover:border-violet-500 bg-base-100 hover:bg-base-200/50 cursor-pointer shadow-sm transition-all duration-200 overflow-hidden">
                <input
                  {...register("image", {
                    required: "Please Upload Your Latest Photo",
                  })}
                  capture="user"
                  title="Image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />

                {ImageFile ? (
                  /* Clean Preview: Takes up full container space smoothly */
                  <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
                    <Image
                      fill /* Uses modern Next.js absolute layout fill */
                      src={URL.createObjectURL(ImageFile)}
                      alt="Profile preview"
                      sizes="112px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Subtle hover overlay to signal you can change it */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera className="text-white w-5 h-5" />
                    </div>
                  </div>
                ) : (
                  /* Fallback Camera Placeholder State */
                  <div className="flex flex-col items-center justify-center gap-1 text-base-content/40 group-hover:text-violet-600 transition-colors duration-200">
                    <Camera className="w-6 h-6 stroke-[1.5]" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">
                      Upload
                    </span>
                  </div>
                )}
              </label>

              {/* Error Message */}
              {errors.image && (
                <p className="text-error text-xs italic">
                  <span>⚠️</span> {errors.image.message}
                </p>
              )}
            </section>

            <section className="flex flex-col gap-3">
              <label className={labelClassName}>Sample Bill <span className="text-[10px] text-base-content/40">
                (Optional)
              </span></label>
              <label className="relative group flex self-center items-center justify-center h-20 w-20 rounded-box border-2 border-dashed border-base-300 hover:border-violet-500 bg-base-100 hover:bg-base-200/50 cursor-pointer shadow-sm transition-all duration-200 overflow-hidden">
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  {...register("sample_bill")}
                />

                {SampleBillFile ? (
                  <div className="absolute inset-0 w-full h-full rounded-box overflow-hidden">
                    <Image
                      fill /* Uses modern Next.js absolute layout fill */
                      src={URL.createObjectURL(SampleBillFile)}
                      alt="Sample Bill preview"
                      sizes="112px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Subtle hover overlay to signal you can change it */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <ReceiptText className="text-white w-5 h-5" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-base-content/40 group-hover:text-violet-600 transition-colors duration-200">
                    <ReceiptText className="w-6 h-6 stroke-[1.5]" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">
                      Sample Bill
                    </span>
                  </div>
                )}
              </label>
              
            </section>

            
          </div>

          <div className="col-span-2">
            {/* ACCOUNT NO */}
            <section>
              <div className="w-full relative">
                <label className={labelClassName}>Account Number</label>
                <label
                  className={`${inputClassName} ${errors.account_no && "input-error"}`}
                >
                  <Zap size={15} />
                  <input
                    {...register("account_no", {
                      required: "Please Enter Your Account Number",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Must Be A valid Digit or Avoid using '-' or special characters",
                      },
                      minLength: {
                        value: 10,
                        message: "Invalid Account Number",
                      },
                      maxLength: {
                        value: 10,
                        message: "Please Avoid using '-' or special characters",
                      },
                    })}
                    title="Account Number"
                    type="text"
                    className="w-full "
                    placeholder="Your 10 Digit Account Number"
                  />
                </label>

                {errors.account_no && (
                  <p className="text-error text-xs italic">
                    <span>⚠️</span> {errors.account_no.message}
                  </p>
                )}
                
                  <SearchResults  setValue={setValue} input={accountNoWatched} />
                
              </div>
            </section>

            {/* NAME */}

            <section>
              <label className={labelClassName}>Account Name</label>
              <label
                className={`${inputClassName} ${errors.name && "input-error"}`}
              >
                <Contact size={15} />
                <input
                  title="Name"
                  {...register("name", { required: "Please Enter Your Name" })}
                  placeholder="Input Your Name"
                  className="w-full"
                />
              </label>

              {errors.name && (
                <p className="text-error text-xs italic">
                  <span>⚠️</span> {errors.name.message}
                </p>
              )}
            </section>

            {/* MOBILE NUMBER */}
            <section>
              <label className={labelClassName}>Mobile Number</label>
              <label
                className={`${inputClassName} ${errors.mobile_number && "input-error"}`}
              >
                <Phone size={15} />
                <input
                  {...register("mobile_number", {
                    validate: (value) => {
                      if (!value) return true
                      return /^09\d{9}$/.test(value) || "Please enter a valid mobile number";
                    } 
                  })}
                  title="Mobile"
                  type="tel"
                  placeholder="Input Your Mobile Number"
                  className="w-full"
                />
              </label>

              {errors.mobile_number && (
                <p className="text-error text-xs italic">
                  <span>⚠️</span> {errors.mobile_number.message}
                </p>
              )}
            </section>
            <section className="flex flex-col gap-3">
              <label className={labelClassName}>Authorization Letter</label>
              
              <label className="relative group flex self-center items-center justify-center h-20 w-25  rounded-box border-2 border-dashed border-base-300 hover:border-violet-500 bg-base-100 hover:bg-base-200/50 cursor-pointer shadow-sm transition-all duration-200 overflow-hidden">
                <input
                  {...register("authorization_letter")}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
                {
                  AuthorizationLetter ? (
                  <div className="absolute inset-0 w-full h-full  overflow-hidden">
                    <Image
                      fill 
                      src={URL.createObjectURL(AuthorizationLetter)}
                      alt="authorization letter"
                      className="w-full h-full object-cover group-hover:scale-105 duration-200 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <FileText className="text-white w-5 h-5" />
                    </div>

                  </div> ):
                  <div className="flex flex-col items-center justify-center gap-1 text-base-content/40 group-hover:text-violet-600 transition-colors duration-200">
                  <FileText className="w-6 h-6 stroke-[1.5]"/>
                  <span className="text-[10px] text-center font-medium tracking-wide uppercase">
                    Authorization Letter
                  </span>
                </div>}
                
              </label>
              <p className="text-info text-xs italic text-center space-x-1">
                <span>
                    Note: Required for Juridical Entity Only
                </span>
                <br />
                <span className="font-bold">Sample: Schools, Public Building, Churches, Barangay Hall, Business Buildings, Government Offices, etc.</span>
              </p>
            </section>
          </div>
        </div>

        {/* SIGNATURE */}
        <section className="w-full p-3">
          <label className={labelClassName}>Sign Here</label>
          <SignatureCanvas
            clearError={clearSignatureErrror}
            signaturePadRef={signaturePadRef}
            canvasRef={canvasRef}
          />
          {errors.signature && (
            <p className="text-error text-xs italic">
              <span>⚠️</span> {errors.signature.message}
            </p>
          )}
        </section>

        {/* SUBMIT */}
        <section className="w-full p-3">
          <button type="submit" className="btn btn-primary w-full">
            {isSubmitting ? (
              <span className="skeleton skeleton-text">Submitting...</span>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </section>
      </form>
    </div>
  );
};

export default RegistrationForm;
