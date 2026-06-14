"use client";
import BiselcoMap from "@/app/common/Map";
import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { queryConsumer } from "@/lib/serverFetch";
import { CirclePlus } from "lucide-react"
import { SubmitChangeMeter } from "@/app/actions/changeMeter";
import { useLoading } from "@/app/common/loadingIndication";
import { useSearchParams } from "next/navigation";
import ElectricMeter from "../../components/electricMeterSvg";
import { useCallback } from "react";
import { useAlert } from "@/app/common/alert";
import ImageViewer from "./imageViewr";
import { Camera } from "lucide-react"

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
  realtimeImage?: File;
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
  const [imagePreview, setImagePreview] = useState<File | undefined>(undefined);

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

  // WATCH REALTIME IMAGE
  const realtime_image = useWatch({
    control: control,
    name: "realtimeImage",
  })

  

  useEffect(()=>{
    if(attachment){
      setValue("realtimeImage", undefined)
      queueMicrotask(()=> setImagePreview(attachment))
      return;
    }
  },[attachment,setValue])

  useEffect(()=>{
    if (!realtime_image) return
    if(realtime_image){
      setValue("attachment", undefined)
      queueMicrotask(()=> setImagePreview(realtime_image))

      navigator.geolocation.getCurrentPosition((position)=>{
        setValue("lat", position.coords.latitude)
        setValue("lon", position.coords.longitude)
      })
      return;
    }
  },[realtime_image,setValue])

  

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
        NewData.append("attachment",imagePreview?.[0]);
      }
      showLoading(true, "Submitting Change Meter...");
      const page = useParams.get("page") as unknown as number;

      const res = await SubmitChangeMeter(NewData, page ? page : 1);
      switch (res?.status) {
        case 201:
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
    [reset, setError, showLoading, useParams, showAlert, imagePreview],
  );

  return (
    <>
      <button
        type="button"
        data-tip="Add Change Meter"
        title="Change Meter Form"
        onClick={handleOpen}
        className="btn btn-active btn-circle btn-sm tooltip tooltip-right tooltip-xs"
      >
        <CirclePlus />
      </button>
      <dialog ref={modalRef} className="modal modal-bottom">
        <div className='px-2 w-full mx-auto  modal-box max-w-3xl border drop-shadow-md z-10 bg-base-100 rounded-box  border"'>
          <div
            className={`sticky top-0 z-100`}
          >
            <button
              type="button"
              onClick={handleClose}
              className="btn absolute z-100 -top-4 right-0 btn-sm btn-circle"
            >
              X
            </button>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex overflow-x-clip  overflow-y-auto h-full flex-col gap-2"
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
                      className="input input-sm w-full"
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
                      className="input input-sm dropdown  w-full"
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
                      className="input input-sm w-full"
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
                      className="input input-sm w-full "
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
                      className="input input-sm w-full"
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
                      className="input input-sm  w-full"
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
                      className="input input-sm w-full"
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
                      className="input input-sm w-full"
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
                      className="input input-sm w-full"
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
                      className="input input-sm shadow  w-full"
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
                  <div className="border-gray-200 w-full">
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



                    {/* IMAGE */}
                    <div className="flex flex-col self-center items-center justify-center ">
                      <label className="label font-bold text-xs">
                        Upload Image
                      </label>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className="file-input file-input-sm file-input-success"
                          type="file"
                          accept="image/*"
                          {...register("attachment", {
                            required: "Please Upload Image of the Electric Meter",
                          })}
                        />
                        <span className="text-xs"> OR</span>
                        <label title="Capture  Realtime Image" data-tip="Take Picture" className="btn btn-active btn-circle cursor-pointer tooltip-left tooltip">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            {...register("realtimeImage", {
                            })}
                          />
                          <Camera  className=" text-emerald-500 t" />
                        </label>

                      </div>



                      {errors.attachment && (
                        <span className="text-red-500 talic text-xs">
                          {errors.attachment.message}
                        </span>
                      )}
                      {imagePreview?.[0] && (
                        <div className="mt-2">
                          <ImageViewer
                            image={imagePreview ? URL.createObjectURL(imagePreview?.[0]) : ""}
                          />
                        </div>

                      )}
                    </div>

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
                </div>
                {/* Remarks */}
                <div>
                  <label className="label font-bold text-xs">Remarks</label>
                  <input
                    title="Remarks"
                    {...register("remarks")}
                    placeholder="Remarks"
                    className="input input-sm w-full"
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
                    className="input input-sm w-full"
                  />
                  {errors.accomplishedBy && (
                    <span className="text-red-500  italic text-xs">
                      {errors.accomplishedBy.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="modal-action">
                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-sm  w-full btn-accent`}
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
