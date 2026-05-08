
import { use, Suspense } from "react"
import AgmaTicketCard from "./components/agmaTicketCard"
import { GetAgmaRegistered } from "@/lib/serverFetch"
type Props = {
    searchParams: Promise<searchParamsType>
}
type searchParamsType = {
    id: string
}



const AgmaTicketPage = ({searchParams}: Props) => {
    const params = use(searchParams)
    const id = params.id
    const result = GetAgmaRegistered(id)
    
  return (
    <div className="w-full min-h-screen flex justify-center items-center px-2">
        <Suspense fallback={<div>Loading...</div>}>
        <AgmaTicketCard registered={result}/>
        </Suspense>
    </div>
  )
}

export default AgmaTicketPage;