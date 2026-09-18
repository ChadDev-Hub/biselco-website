"use client";


import { PromiseType } from "@/types/promise";
import { TransformerProperties, Transformers } from "@/types/transformer";
import { Zap } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {User} from "@/types/user"; 
type Props = {
  TransformerProperties: TransformerProperties;
  setData: Dispatch<SetStateAction<PromiseType<Transformers > | undefined>>
  user?:User
};

const TransformerPopup = ({ TransformerProperties, setData, user }: Props) => {
    const [currentStatus, setCurrentStatus] = useState(TransformerProperties?.is_active);
    const handleSwitch = (
        transformer: TransformerProperties
    ) => {
        setCurrentStatus((prev) => !prev);
        setData((prev)=>{
            if(!prev?.data) return prev;
            const feature = prev.data.features.find((feature) => feature.properties.id === transformer.id);
            if(!feature) return prev;
            
            feature.properties.is_active = !feature.properties.is_active
            const newData = {
              ...prev,
              data: {
                ...prev.data,
                features: prev.data.features.map((f) => f.properties.id === transformer.id ? feature : f)
              },
            };

            return newData
        })
    }
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-300 bg-base-200/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
              Transformer
            </p>

            <h3 className="font-bold text-base-content text-xs">
              {TransformerProperties?.transformer_id ?? "Unknown"}
            </h3>
          </div>
        </div>

        {/* Status */}
        <div
          className={`badge gap-1.5 badge-xs  badge-outline badge-soft ${
            currentStatus ? "badge-success" : "badge-error"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {currentStatus ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Village</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.village ?? "—"}
          </p>
        </div>
        {/* Municipality */}
        <div className="rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Municipality</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.municipality ?? "—"}
          </p>
        </div>

          {/* CONNECTED CONSUMERS */}
        <div className="rounded-xl col-span-2 bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Connected Consumers</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.connected_consumer ?? "—"}
          </p>
        </div>
          {/* TRANSFORMER TYPE */}
        <div className="col-span-2 rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Transformer Type</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.description}
          </p>
        </div>


            {/* KVA RATING */}
        <div className="col-span-2 rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">KVA Rating</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.kva_rating ?? "—"}
          </p>
        </div>
        {/* PRIMARY VOLTAGE RATING */}

        <div className=" rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Primary Voltage Rating(Kv)</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.primary_voltage_rating_kv ?? "—"}
          </p>
        </div>

        {/* SECONDARY VOLTAGE RATING */}
        <div className=" rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Secondary Voltage Rating(Kv)</p>
          <p className="mt-1 font-semibold text-xs w-full text-center">
            {TransformerProperties?.secondary_voltage_rating_kv ?? "—"}
          </p>
        </div>
      </div>


      {/* Footer */}
      {user && user?.roles.map((role) => role.name).includes("admin") && <div className="flex items-center justify-between border-t border-base-300 px-4 py-3">
        <span className="text-xs text-base-content/50">Switch</span>

        <label className="toggle toggle-xs">
            <input onChange={() => handleSwitch(TransformerProperties)}  checked={currentStatus} type="checkbox"
            />
        </label>
      </div>}
    </div>
  );
};

export default TransformerPopup;
