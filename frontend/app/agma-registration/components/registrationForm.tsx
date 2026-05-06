"use client"
import { useRef } from "react"
import SignatureCanvas from "./signatureCanvas"


const RegistrationForm = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelClass = "label font-bold text-black text-shadow-white text-shadow-md"
  const inputClass = "input w-full"



  // FUNCTIONS
  const saveSignature = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL('image/png');
    console.log("Signature Data:", dataURL);
    // You can now send this Base64 string to your FastAPI backend
  };

  return (
    <div className="w-full flex justify-center">
      <form action="" className="form w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-box p-2 bg-base-200/45 drop-shadow-md shadow">
        {/* TITLE */}
        <h1 className="text-3xl text-violet-600 font-extrabold text-shadow-2xs text-shadow-white">Register Now</h1>


        {/* ACCOUNT NO */}

        <section>
          <label className={labelClass}>Account Number</label>
        
          <input
          title="Account Number"
          type="text"
          className= {inputClass}
          placeholder="Your 10 Digit Account Number" />

        </section>

        {/* NAME */}

        <section>
          <label className={labelClass}>
            Name
          </label>
          <input title="Name"
          placeholder="Input Your Name"
           className={inputClass} />
        </section>

        {/* MOBILE NUMBER */}
        <section>
          <label className={labelClass}>
            Mobile Number
          </label>
          <input title="Mobile" type="text" placeholder="Input Your Mobile Number" className={inputClass} />
        </section>

        {/* IMAGE UPLOAD */}
        <section>
          <label className={labelClass}>
            Image
          </label>
          <input capture="user" title="Image"  type="file" accept="image/*" className={`file-input w-full`} />
        </section>


        {/* SIGNATURE */}
        <section>
          <label className={labelClass}>
            Signature
          </label>
          <SignatureCanvas canvasRef={canvasRef} />
        </section>

        {/* SUBMIT */}
        <section>
          <button onClick={saveSignature} className="btn btn-primary w-full">Submit</button>
        </section>
      </form>
    </div>
  )
}

export default RegistrationForm