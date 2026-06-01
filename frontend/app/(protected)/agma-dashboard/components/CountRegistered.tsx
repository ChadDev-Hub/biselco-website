"use client"



type PromiseType=  {
  status:number;
  data?:CountRegistered[];
  error?:string;
}

type CountRegistered = {
  name?: string; 
  value?: number
}

type Props = {
  registerCountPromise: Promise<PromiseType>
}
const CountRegistered = ({registerCountPromise}: Props) => {
  return (
    <div>CountRegistered</div>
  )
}

export default CountRegistered