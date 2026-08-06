"use client";
import { FileDown } from "lucide-react";
import { use, useState, useRef, useEffect } from "react";
import { DownloadAgmaTicketToPdf } from "../../../../lib/private-api/actions/agma";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { AllTicketInfoType } from "@/types/agma"

type PromiseType = {
  data: AllTicketInfoType
};

type FormType = {
  start_page: number;
  end_page: number;
};

type Props = {
  promise: Promise<PromiseType>;
};

const DownloadAction = ({ promise }: Props) => {
  const data = use(promise);
  
  // MODAL COMPONENTS
  const modal = useRef<HTMLDialogElement>(null);

  const handleOpen = () => modal.current?.showModal();
  const handleClose = () => modal.current?.close();

  // GET DOWNLOAD REQUIREMENTS
  const current_path = usePathname();
  const params = useSearchParams();
  const tab = params.get("tab");
  const municipality = params.get("municipality");
  const [progress, setProgress] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();

  // HANDLE DOWNLOAD
  const onSubmit: SubmitHandler<FormType> = async (data) => {
    try {

      // SET INITIAL STATE
      setSuccess(false);
      setShowProgress(true);
      // CREATING NEW PARAMS AND APPENDING THE EXISTING PARAMETERS IF EXISTS
      const new_params = new URLSearchParams();
      if (tab) new_params.append("tab", tab);
      if (municipality) new_params.append("municipality", municipality);

      // SEND DOWNLOAD REQUESTS
      const res = await DownloadAgmaTicketToPdf(
        "#agma-ticket",
        `${current_path}?${new_params.toString()}`,
        data.start_page,
        data.end_page,
        setProgress,
      );

      // HANDLING RESPONSE
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agma-ticket.docx";
      a.click();
      a.remove();
      setShowProgress(false);
      setSuccess(true);
    } catch (error) {
      // HANDLE ERRORS
      console.log(error);
      setShowProgress(false);
      setSuccess(false);
      setProgress(0);
    }
  };

  // CLEANUP
  useEffect(() => {
    if (success) {
      const reset = async () => {
        setProgress(0);
        handleClose();
      };
      reset();
    }
  }, [success]);
  return (
    <>
      <button
        onClick={handleOpen}
        data-tip="Download Tickets"
        className="btn btn-sm btn-circle tooltip tooltip-bottom"
      >
        <FileDown className="size-5 text-black" />
      </button>
      <dialog ref={modal} className="modal">
        <form onSubmit={handleSubmit(onSubmit)} className="modal-box ">
          <h3 className="font-bold text-lg">Download Agma Tickets</h3>
          {showProgress && (
            <div className="w-full">
              {progress > 0 ? (
                <p className="py-4">Downloading... {progress}%</p>
              ) : (
                <p className="py-4 skeleton skeleton-text">
                  Preparing to Download
                </p>
              )}
              <progress
                value={progress}
                max="100"
                className="progress progress-primary w-full"
              >
                {progress}%
              </progress>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Page</span>
              </label>
              <input
                {...register("start_page", {
                  required: {
                    value: true,
                    message: "Start Page is required",
                  },
                  validate: (value) => {
                    if (value < 1) {
                      return "Start Page must be greater than 0";
                    }
                  },
                })}
                type="number"
                placeholder="Start Page"
                className="input input-bordered"
              />
              {errors.start_page && (
                <span className="text-red-500 text-xs italic">
                  {errors.start_page.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">End Page</span>
              </label>
              <input
                {...register("end_page", {
                  required: { value: true, message: "End Page is required" },
                  max: { value: data?.data.total_page, message: `End Page must not exceed${data?.data.total_page}` },
                  validate: (value) => {
                    if (value < 1) {
                      return "End Page must be greater than 0";
                    }
                  },
                })}
                type="number"
                placeholder="End Page"
                className="input input-bordered"
              />
              {errors.end_page && (
                <span className="text-red-500 text-xs italic">{errors.end_page.message}</span>
              )}
            </div>
          </div>
          <div className="modal-action">
            <button type="submit" disabled={showProgress} className="btn btn-primary">
              Download
            </button>
            <button type="button" disabled={showProgress} onClick={handleClose} className="btn">
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default DownloadAction;
