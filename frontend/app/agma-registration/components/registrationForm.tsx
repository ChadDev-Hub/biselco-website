"use client"
import {  useCallback, useRef } from "react"
import SignatureCanvas from "./signatureCanvas"
import SignaturePad from "signature_pad"
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { RegisterAgma } from "@/app/actions/agma";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import Image from "next/image"


type FormType = {
  account_no: string;
  name: string;
  mobile_number: string;
  image: File;
  signature: File;
}
const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors }, control, setError, clearErrors, reset } = useForm<FormType>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const labelClass = "label font-bold text-black text-shadow-white text-shadow-md"
  const inputClass = "input w-full"
  const router = useRouter();
  const { showAlert } = useAlert();
  const ImageWatched = useWatch({
    control: control,
    name: "image",
  })

  const clearSignatureErrror = () => {
    clearErrors("signature");
  }

  const ImageFile = ImageWatched?.[0];

  // FUNCTIONS

  // ---------------------------------------------------------------------------
  const getSignatureFile = async (
    signaturePad: SignaturePad | null
  ) => {

    if (!signaturePad) return null;

    if (signaturePad.isEmpty()) {
      return null;
    }

    const dataUrl = signaturePad.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    return new File(
      [blob],
      "signature.png",
      {
        type: "image/png",
      }
    );
  };
  // ---------------------------------------------------------------------------

  const handleError = useCallback((message: string) => {
    setError("account_no", {
      type: "validate",
      message
    })
    window.scrollTo({ top: 0, behavior: "smooth" });
    showAlert("error", message);
  }, [showAlert, setError])



  // HANDLE SUBMIT
  const onSubmit: SubmitHandler<FormType> = useCallback(async (data) => {
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
    formData.append("mobile_no", data.mobile_number);
    formData.append("image", data.image[0]);
    formData.append("signature", signature);

    const res = await RegisterAgma(formData);
    switch (res.status) {
      case 401:
        handleError(res.error)
        break;
      case 404:
        handleError(res.error)
        break;
      case 201:
        reset();
        signaturePadRef.current?.clear();
        const newParams = new URLSearchParams();
        newParams.set("id", res.data.id);
        router.push(`/agma-registration/registered?${newParams.toString()}`);
        break;
      default:
        break;
    }
  }, [setError, reset, router, handleError])





  return (
    <div className="w-full flex justify-center px-0 sm:px-32">
      <form onSubmit={(e) => { handleSubmit(onSubmit)(e); }} className="form flex flex-col gap-2 h-full w-full  rounded-box p-2 bg-base-200/45 drop-shadow-md shadow">
        {/* TITLE */}
        <h1 className="text-3xl text-violet-600 font-extrabold text-shadow-2xs text-shadow-white">Register Now</h1>

        {/* ACCOUNT NO */}
        <section>
          <label className={labelClass}>Account Number</label>
          <input
            {...register("account_no", { required: "Please Enter Your Account Number" })}
            title="Account Number"
            type="text"
            className={inputClass}
            placeholder="Your 10 Digit Account Number" />
          {errors.account_no && <p className="text-error text-xs italic"> {errors.account_no.message}</p>}
        </section>

        {/* NAME */}

        <section>
          <label className={labelClass}>
            Name
          </label>
          <input title="Name"
            {...register("name", { required: "Please Enter Your Name" })}
            placeholder="Input Your Name"
            className={inputClass} />
          {errors.name && <p className="text-error text-xs italic"> {errors.name.message}</p>}
        </section>

        {/* MOBILE NUMBER */}
        <section>
          <label className={labelClass}>
            Mobile Number
          </label>
          <input
            {...register("mobile_number", { required: "Please Enter Your Mobile Number" })}
            title="Mobile" type="text" placeholder="Input Your Mobile Number" className={inputClass} />
          {errors.mobile_number && <p className="text-error text-xs italic"> {errors.mobile_number.message}</p>}
        </section>

        {/* IMAGE UPLOAD */}
        <section>
          <label className={labelClass}>
            Image
          </label>
          <input
            {...register("image", { required: "Please Upload Your Latest Photo" })}
            capture="user"
            title="Image"
            type="file"
            accept="image/*"
            className={`file-input w-full`} />
          {errors.image && <p className="text-error text-xs italic"> {errors.image.message}</p>}
          {/* IMAGE PREVIEW */}

          {
            ImageFile && (
              <div className="flex p-2 justify-center items-center">
                <Image
                  width={100}
                  height={100}
                  src={URL.createObjectURL(ImageFile)}
                  alt="image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover w-1/2 drop-shadow-md shadow-md"
                />
              </div>
            )
          }
        </section>


        {/* SIGNATURE */}
        <section>
          <label className={labelClass}>
            Signature
          </label>
          <SignatureCanvas
            clearError={clearSignatureErrror}
            signaturePadRef={signaturePadRef}
            canvasRef={canvasRef} />
          {errors.signature && <p className="text-error text-xs italic"> {errors.signature.message}</p>}
        </section>

        {/* SUBMIT */}
        <section>
          <button type="submit" className="btn btn-primary w-full">Submit</button>
        </section>
      </form>
    </div>
  )
}

export default RegistrationForm