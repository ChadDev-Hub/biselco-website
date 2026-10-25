
import {GetPrimaryLines} from "@/lib/distributionLine";
import PrimaryLineLayer from "./PrimaryLineLayer";
const PrimaryLineLoader =  async() => {
    const primaryLines = await GetPrimaryLines();
  return (
    <PrimaryLineLayer initialData={primaryLines.data} />
  )
}

export default PrimaryLineLoader