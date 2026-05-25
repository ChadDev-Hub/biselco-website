import { use, Suspense } from "react";
import AgmaTicketCard from "./components/agmaTicketCardContainer";
import { GetAgmaRegistered } from "@/lib/serverFetch";
import Return from "../../common/Return";
import DownloadTicket from './components/DownloadTicket';
import AgmaTicketSkeletonCard from "./components/agmaTicketSkeletonCard";
type Props = {
  searchParams: Promise<searchParamsType>;
};
type searchParamsType = {
  id: string;
};

const AgmaTicketPage = ({ searchParams }: Props) => {
  const params = use(searchParams);
  const id = params.id;
  const result = GetAgmaRegistered(id);
  return (
    <div className="w-full   flex-col min-h-screen flex   px-2">
        <section className="self-start p-4 flex justify-between w-full">
            <Return />
            <DownloadTicket elementId={id} />
        </section>
      
      <section className="flex justify-center items-center w-full flex-1">
        <Suspense fallback={<AgmaTicketSkeletonCard />}>
          <div className="hover-3d cursor-pointer">
            <figure>
              <AgmaTicketCard id={id} registered={result} />
            </figure>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

          </div>
          
        </Suspense>
        
      </section>
    </div>
  );
};

export default AgmaTicketPage;
