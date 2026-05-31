import { use, Suspense } from "react";

import { GetAgmaRegistered } from "@/lib/serverFetch";
import Return from "../../common/Return";
import DownloadTicket from "./components/DownloadTicket";
import AgmaTicketSkeletonCard from "./components/agmaTicketSkeletonCard";
import AgmaTicketCardContainer from "./components/agmaTicketCardContainer";
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
    <div className="w-full   flex-col min-h-screen flex ">
      <section className="self-start p-2 flex justify-between w-full">
        <Return />
        <DownloadTicket elementId={id} />
      </section>

      <section className="flex justify-center items-center w-full flex-1">
        <Suspense fallback={<AgmaTicketSkeletonCard />}>
          <div className="hover-3d cursor-pointer ">
            <figure>
              <AgmaTicketCardContainer id={id} registered={result} />
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
