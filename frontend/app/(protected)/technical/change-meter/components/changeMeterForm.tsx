"use client";
import BiselcoMap from "@/app/common/Map";
import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { queryConsumer } from "@/lib/serverFetch";
import Image from "next/image";
import { SubmitChangeMeter } from "@/app/actions/changeMeter";
import { useLoading } from "@/app/common/loadingIndication";
import { useSearchParams } from "next/navigation";
import { Archivo_Black } from "next/font/google";
import ElectricMeter from "../../components/electricMeterSvg";
import { useCallback } from "react";
import { useAlert } from "@/app/common/alert";
type FormField = {
  dateAccomplished: string;
  accountNumber: string;
  consumerName: string;
  pullOutMeterNumber: string;
  pullOutMeterBrand: string;
  pullOutMeterReading: number;
  NewMeterNumber: string;
  NewMeterBrand: string;
  NewMeterSealed: string;
  InitialMeterReading: number;
  lat: number | undefined;
  lon: number | undefined;
  remarks: string | undefined;
  accomplishedBy: string;
  attachment?: File;
};

type Consumer = {
  account_name: string;
  account_no: string;
  meter_brand: string;
  meter_no: string;
  municipality: string;
  village: string;
  geolocation: Location;
};

type Location = {
  type: string;
  coordinates: [number, number];
};

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

const ChangeMeterForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormField>();
  const [consumer, setConsumer] = useState<Consumer[]>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<string>("");
  const { showLoading } = useLoading();
  const useParams = useSearchParams();
  const { showAlert } = useAlert();
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const handleOpen = () => modalRef.current?.showModal();
  const handleClose = useCallback(() => {
    modalRef.current?.close();
  }, []);
  // WATCH COORDINATES
  const lon = useWatch({
    control: control,
    name: "lon",
  });
  const lat = useWatch({
    control: control,
    name: "lat",
  });
  // WATCH ACCOUNT NUMBER INPUT
  const consumerSearch = useWatch({
    control: control,
    name: "accountNumber",
    defaultValue: "",
  });

  // WATH CONSUMER NAME
  const consumerName = useWatch({
    control: control,
    name: "consumerName",
    defaultValue: "",
  });

  // WATCH IMAGE UPLOAD
  const attachment = useWatch({
    control: control,
    name: "attachment",
  });

  useEffect(() => {
    if (consumerSearch === "") {
      setValue("consumerName", "");
      setValue("pullOutMeterNumber", "");
      setValue("pullOutMeterBrand", "");
      setValue("lat", undefined);
      setValue("lon", undefined);
    }
  }, [consumerSearch, setValue]);

  // DEBOUNCE CONSUMER QUERY
  const [debounceSearch] = useDebounce(consumerSearch, 500);

  useEffect(() => {
    if (!debounceSearch) {
      queueMicrotask(() => setConsumer([]));
      return;
    }
    if (debounceSearch === selectedConsumer) {
      queueMicrotask(() => setConsumer([]));
      return;
    }
    const fetchConsumer = async () => {
      const res = await queryConsumer(debounceSearch);
      if (res.status === 200) {
        setConsumer(res.data);
      }
    };
    fetchConsumer();
  }, [debounceSearch, selectedConsumer]);

  // HANDLE SELECTED CONSUMER
  const selectConsumer = (account: Consumer) => {
    setSelectedConsumer(account.account_no);
    setValue("accountNumber", account.account_no);
    setValue("consumerName", account.account_name);
    setValue("pullOutMeterNumber", account.meter_no);
    setValue("pullOutMeterBrand", account.meter_brand);
    setValue("lat", account.geolocation.coordinates[1]);
    setValue("lon", account.geolocation.coordinates[0]);
    setConsumer([]);
  };
  // HANDLE SUBMIT
  const onSubmit: SubmitHandler<FormField> = useCallback(
    async (data) => {
      const NewData = new FormData();
      NewData.append("dateAccomplished", data.dateAccomplished);
      NewData.append("accountNumber", data.accountNumber);
      NewData.append("consumerName", data.consumerName);
      NewData.append("pullOutMeterNumber", data.pullOutMeterNumber);
      NewData.append("pullOutMeterBrand", data.pullOutMeterBrand);
      NewData.append(
        "pullOutMeterReading",
        data.pullOutMeterReading.toString(),
      );
      NewData.append("NewMeterNumber", data.NewMeterNumber);
      NewData.append("NewMeterBrand", data.NewMeterBrand);
      NewData.append("NewMeterSealed", data.NewMeterSealed);
      NewData.append(
        "InitialMeterReading",
        data.InitialMeterReading.toString(),
      );
      NewData.append("lat", data.lat?.toString() ?? "");
      NewData.append("lon", data.lon?.toString() ?? "");
      if (data.remarks?.trim()) {
        NewData.append("remarks", data.remarks);
      }
      NewData.append("accomplishedBy", data.accomplishedBy);
      if (data.attachment?.[0]) {
        NewData.append("attachment", data.attachment[0]);
      }
      showLoading(true, "Submitting Change Meter...");
      const page = useParams.get("page") as unknown as number;

      const res = await SubmitChangeMeter(NewData, page ? page : 1);
      switch (res?.status) {
        case 201:
          console.log(res);
          reset();
          showLoading(false);
          showAlert("success", "Successfully submitted change meter");
          break;
        case 403:
          showLoading(false);
          setError("lat", { message: res.data });
          break;
        case 404:
          showLoading(false);
          setError("lon", { message: res.data });
          break;
        default:
          break;
      }
    },
    [reset, setError, showLoading, useParams, showAlert],
  );

  return (
    <>
      <button
        type="button"
        data-tip="Add Change Meter"
        title="Change Meter Form"
        onClick={handleOpen}
        className="btn btn-primary btn-circle btn-sm tooltip tooltip-right tooltip-xs"
      >
        <svg
          width={25}
          height={25}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
              stroke="#1C274C"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke="#1C274C"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <dialog ref={modalRef} className="modal  xl:px-20  modal-bottom">
        <div className='px-2 w-full  modal-box border drop-shadow-md z-10   glass rounded-box  border"'>
          <div
            className={`sticky top-0 text-lg text-blue-800 pb-2 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}
          >
            Change Meter Form
            <button
              onClick={handleClose}
              className="btn absolute z-100 top-1 right-2 btn-xs btn-circle"
            >
              X
            </button>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex overflow-x-auto  overflow-y-auto h-full flex-col gap-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  {/* Date Accomplished */}
                  <div>
                    <label className="label font-bold text-xs">
                      Date Accomplished
                    </label>
                    <input
                      {...register("dateAccomplished", { required: true })}
                      title="Date Accomplished"
                      className="input w-full"
                      type="date"
                    />
                    {errors.dateAccomplished && (
                      <span className=" text-red-500 italic text-xs">
                        Date Accomplished is required
                      </span>
                    )}
                  </div>
                  {/* Account Number  */}
                  <div className="relative">
                    <label className="label font-bold text-xs">
                      Account Number
                    </label>
                    <input
                      {...register("accountNumber", { required: true })}
                      name="accountNumber"
                      title="Account Number"
                      placeholder="Search Account here..."
                      className="input dropdown  w-full"
                      type="text"
                    />
                    {errors.accountNumber && (
                      <span className="  text-red-500 italic text-xs">
                        Account Number is required
                      </span>
                    )}
                    {consumer.length > 0 ? (
                      <ul className="dropdown-conten rounded-box drop-shadow-md  grid grid-cols-1 menu absolute max-h-60 overflow-y-auto w-full bg-base-100  z-10">
                        {consumer.map((item: Consumer) => (
                          <li
                            key={item.account_no}
                            onClick={() => selectConsumer(item)}
                          >
                            <a>
                              {item.account_no} - {item.account_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {/* Consumer Name */}
                  <div>
                    <label className="label font-bold text-xs">
                      Consumer Name
                    </label>
                    <input
                      {...register("consumerName", {
                        required: "Account Name is required",
                      })}
                      title="Consumer Name"
                      placeholder="Conumer Name"
                      className="input w-full"
                      type="text"
                    />
                    {errors.consumerName && (
                      <span className=" text-red-500 italic text-xs">
                        {errors.consumerName.message}
                      </span>
                    )}
                  </div>

                  {/* Pull out Meter */}
                  <div className="flex flex-col gap-1">
                    <label className="label font-bold text-xs  ">
                      Pullout Meter
                    </label>
                    <input
                      {...register("pullOutMeterNumber", {
                        required: "Please Input Pullout Meters",
                      })}
                      title="Pullout Meter Number"
                      placeholder="Meter Number"
                      className="input w-full "
                      type="text"
                    />
                    {errors.pullOutMeterNumber && (
                      <span className="text-red-500 italic text-xs">
                        {errors.pullOutMeterNumber.message}
                      </span>
                    )}
                    <input
                      {...register("pullOutMeterBrand", {
                        required: "Please Input Pullout Meters",
                      })}
                      title="Pullout Meter Brand"
                      placeholder="Brand"
                      className="input w-full"
                      type="text"
                    />
                    {errors.pullOutMeterBrand && (
                      <span className="text-red-500 italic text-xs">
                        {errors.pullOutMeterBrand.message}
                      </span>
                    )}
                    <input
                      {...register("pullOutMeterReading", {
                        required: "Please Input Pullout Meters",
                      })}
                      title="Pullout Meter Reading"
                      placeholder="Reading"
                      className="input  w-full"
                      type="number"
                    />
                    {errors.pullOutMeterReading && (
                      <span className="text-red-500 italic text-xs">
                        {errors.pullOutMeterReading.message}
                      </span>
                    )}
                  </div>
                  {/* New Meter */}
                  <div className="flex flex-col gap-1">
                    <label className="label font-bold text-xs">New Meter</label>
                    <input
                      {...register("NewMeterNumber", {
                        required: "Please Input New Meters",
                      })}
                      title="New Meter Number"
                      placeholder="Meter Number"
                      className="input w-full"
                      type="text"
                    />
                    {errors.NewMeterNumber && (
                      <span className="text-red-500  italic text-xs">
                        {errors.NewMeterNumber.message}
                      </span>
                    )}
                    <input
                      {...register("NewMeterBrand", {
                        required: "Please Input New Meters",
                      })}
                      title="New Meter Brand"
                      placeholder="Brand"
                      className="input w-full"
                      type="text"
                    />
                    {errors.NewMeterNumber && (
                      <span className="text-red-500 italic text-xs">
                        {errors.NewMeterNumber.message}
                      </span>
                    )}
                    <input
                      {...register("NewMeterSealed", {
                        required: "Please Input New Meters",
                      })}
                      title="New Meter Sealed"
                      placeholder="Meter Sealed"
                      className="input  w-full"
                      type="text"
                    />
                    {errors.NewMeterSealed && (
                      <span className="text-red-500  italic text-xs">
                        {errors.NewMeterSealed.message}
                      </span>
                    )}
                    <input
                      {...register("InitialMeterReading", {
                        required: "Please Input New Meters",
                      })}
                      title="New Meter Reading"
                      placeholder="Initial Reading"
                      className="input  w-full"
                      type="number"
                    />
                    {errors.InitialMeterReading && (
                      <span className="text-red-500 italic text-xs">
                        {errors.InitialMeterReading.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  {/* Location */}
                  <div className="border-gray-200 w-full inset-shadow-md shadow drop-shadow-md">
                    <input
                      type="hidden"
                      {...register("lon", {
                        required: "Please Select Location",
                      })}
                    />
                    <input
                      type="hidden"
                      {...register("lat", {
                        required: "Please Select Location",
                      })}
                    />

                    <label className="label font-bold text-xs">Location</label>
                    <BiselcoMap
                      markerPopup={`${consumerName ? `${consumerName} Electric Meter` : ""}`}
                      markerSvg={<ElectricMeter />}
                      consumermeters={lon && lat ? [lon, lat] : undefined}
                      onSelectLocation={(lat, lon) => {
                        setValue("lat", lat);
                        setValue("lon", lon);
                      }}
                    />
                    {errors.lat && (
                      <span className="text-red-500  italic text-xs">
                        {errors.lat?.message}
                      </span>
                    )}
                  </div>

                  {/* IMAGE */}
                  <div className="flex flex-col self-center items-center justify-center ">
                    <label className="label font-bold text-xs">
                      {" "}
                      Upload Image
                    </label>
                    <input
                      className="file-input"
                      type="file"
                      accept="image/*"
                      {...register("attachment", {
                        required: "Please Upload Image of the Electric Meter",
                      })}
                    />
                    {errors.attachment && (
                      <span className="text-red-500 talic text-xs">
                        {errors.attachment.message}
                      </span>
                    )}
                    {attachment?.[0] && (
                      <Image
                        src={
                          attachment ? URL.createObjectURL(attachment[0]) : ""
                        }
                        alt="Image"
                        width={200}
                        height={200}
                        sizes="(min-width: 1024px) 200px, 100vw"
                        className="max-h-40 w-auto h-auto mt-4 drop-shadow-2xl drop-shadow-gray-700"
                      />
                    )}
                  </div>
                </div>
                {/* Remarks */}
                <div>
                  <label className="label font-bold text-xs">Remarks</label>
                  <input
                    title="Remarks"
                    {...register("remarks")}
                    placeholder="Remarks"
                    className="input w-full"
                    type="text"
                  />
                </div>
                {/* Accomplished By */}
                <div>
                  <label className="label font-bold text-xs">
                    {" "}
                    Accomplished By
                  </label>
                  <input
                    {...register("accomplishedBy", {
                      required: "Input Who Installed the Meter",
                    })}
                    type="text"
                    title="Accomplished by"
                    placeholder="Accomplished By"
                    className="input w-full"
                  />
                  {errors.accomplishedBy && (
                    <span className="text-red-500  italic text-xs">
                      {errors.accomplishedBy.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-1 md:col-span-2">
                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn w-full btn-accent`}
                >
                  {isSubmitting ? (
                    <p className="skeleton skeleton-text">Submitting..</p>
                  ) : (
                    <p>Submit Change Meter</p>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ChangeMeterForm;
