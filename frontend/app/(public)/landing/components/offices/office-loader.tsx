import { GetOffices } from "@/lib/public-api/offices";
import BiselcoOffices from "./biselcoOfficesLayer";

const OfficeLoader = async() =>{
    const offices = await GetOffices();

  return (
    <BiselcoOffices initialData={offices.data}/>
  )
}

export default OfficeLoader