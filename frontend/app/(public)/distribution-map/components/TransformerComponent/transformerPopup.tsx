"use client";

import { TransformerProperties } from "@/types/transformer";
import {Zap} from "lucide-react"
import {useState} from "react"
type Props = {
  TransformerProperties: TransformerProperties;
};

const TransformerPopup = ({ TransformerProperties }: Props) => {
    
    const [currentStatus, setCurrentStatus] = useState(TransformerProperties?.is_active);
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
          <p className="mt-1 font-semibol text-xs">
            {TransformerProperties?.village ?? "—"}
          </p>
        </div>

        <div className="rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Municipality</p>
          <p className="mt-1 font-semibold text-xs">
            {TransformerProperties?.municipality ?? "—"}
          </p>
        </div>

        <div className="col-span-2 rounded-xl bg-base-200/50 p-3">
          <p className="text-xs text-base-content/50">Transformer Type</p>
          <p className="mt-1 font-semibold text-xs">
            {TransformerProperties?.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-base-300 px-4 py-3">
        <span className="text-xs text-base-content/50">Switch</span>

        <label className="toggle toggle-xs">
            <input onClick={() => {
                setCurrentStatus(!currentStatus)
            }}  checked={currentStatus} type="checkbox"
            />
        </label>
      </div>
    </div>
  );
};

export default TransformerPopup;
