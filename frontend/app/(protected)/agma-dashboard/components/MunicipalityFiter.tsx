"use client";
import {useSearchParams, useRouter} from "next/navigation";
import {LandPlot} from "lucide-react"

const MunicipalityFiter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "all")params.set("municipality", value);
    else params.delete("municipality");
    router.push(`?${params.toString()}`);
  }
  const municipalities = ["Coron", "Busuanga", "Culion", "Linapacan"];
  return (
    <label className="select">
      <LandPlot className="mr-2"/>
      <select
        title="Municipality"
        className="w-full"
        defaultValue="all"
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option disabled selected>
          Select Municipality
        </option>
        <option value="all">All</option>
        {municipalities.map((municipality, index) => (
          <option key={index} value={municipality.toLowerCase()}>
            {municipality}
          </option>
        ))}
      </select>
    </label>
  )
}

export default MunicipalityFiter