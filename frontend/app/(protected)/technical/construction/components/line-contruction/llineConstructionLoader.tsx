import {GetLineConstruction} from '@/lib/private-api/server-side/line-construction';
import LineConstructionLayer from './lineConstructionContent';

const LineConstructionLoader = async() => {
    const data = await GetLineConstruction();
  return <LineConstructionLayer data={data.data} />
}

export default LineConstructionLoader;