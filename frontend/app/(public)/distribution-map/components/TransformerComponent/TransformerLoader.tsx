
import TrasformerLayer from "./TransformerLayer";
import { GetTransformers } from "../../../../../lib/transformer";



const TranformerLoader = async() => {
    const transformers = await GetTransformers();
  return (
    <TrasformerLayer initialData={transformers.data} />
  )
}

export default TranformerLoader