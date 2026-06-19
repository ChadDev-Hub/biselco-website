"use client";
import { FunnelPlusIcon } from "lucide-react";
import { useState, use } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";

type PromiseType = {
  status: number;
  data: FilterType;
};
type Props = {
  data: Promise<PromiseType>;
};

type FilterType = {
  year: number[];
  barangay: string[];
  municipality: string[];
};

const Filter = ({ data }: Props) => {
  const initialData = use(data);
  if (initialData.status === 403) redirect("/");
  if (initialData.status === 401) redirect("/");
  const years = initialData.data.year;
  const barangays = initialData.data.barangay;
  const municipalities = initialData.data.municipality;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleOpen = () => setDropdownOpen(!dropdownOpen);
  const router = useRouter();
  const searchParms = useSearchParams();
  const pathname = usePathname();

  const buildParms = (key: string, value: string | number | undefined, reset_brgy?: boolean) => {
    const params = new URLSearchParams();
    searchParms.forEach((value, key) => 
      params.set(key, value));
    params.set(key, String(value));
    if (reset_brgy) params.delete("barangay");
    return params.toString();
  };

  return (
    <div
      className={`dropdown dropdown-bottom z-10 ${dropdownOpen ? "dropdown-open" : "dropdown-close"}`}
    >
      <button
        type="button"
        title="Filter"
        onClick={handleOpen}
        className="btn btn-rounded btn-sm btn-circle"
      >
        <FunnelPlusIcon className="size-5 text-black" />
      </button>
      <div className="dropdown-content space-y-2 menu menu-compact bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {/* YEAR FILTER */}
        <div className="flex justify-between  gap-2">
          <label className="label font-bold">Year </label>
          <select
            onChange={(e) => {
              router.push(`${pathname}?${buildParms("year", e.target.value)}`);
            }}
            title="Select Year"
            className="select select-bordered select-sm w-fit max-w-xs"
            defaultValue={undefined}
          >
            <option value={undefined}>All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {/* VILLAGE FILTER=*/}
        <div className="flex justify-between  gap-2">
          <label className="label font-bold">Barangay</label>
          <select
            onChange={(e) => {
              router.push(
                `${pathname}?${buildParms("barangay", e.target.value)}`,
              );
            }}
            title="Select Year"
            className="select select-bordered select-sm w-fit max-w-xs"
            defaultValue={undefined}
          >
            <option value={undefined}>All</option>
            {barangays.map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </div>

        {/* MUNICIPALITY FILTER */}
        <div className="flex justify-between  gap-2">
          <label className="label font-bold">Municipality</label>
          <select
            onChange={(e) => {
              router.push(`${pathname}?${buildParms("municipality", e.target.value, true)}`);
            }}
            title="Select Year"
            className="select select-bordered select-sm w-fit max-w-xs"
            defaultValue={undefined}
          >
            <option value={undefined}>All</option>
            {municipalities.map((mun) => (
              <option key={mun} value={mun}>
                {mun}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;
