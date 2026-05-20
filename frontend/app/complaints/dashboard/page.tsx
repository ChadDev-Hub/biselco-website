import { Suspense, use } from "react";
import Stats from "./components/status";
import {
  GetAllComplaints,
  GetComplaintStats,
  ComplaintStatusName,
} from "@/lib/serverFetch";
import ComplaintsContainer from "./components/complaintsDashboardContainer";
import ComplaintDashBoardHeader from "./components/header";
import StatsSkeleton from "@/app/common/statsSkeleton";
import TableSearch from "./components/tableSearch";
import TableSearchSkeleton from "./components/tableSearchSkeleton";
import ModernConcernCardSkeleton from '../components/modernConcernCardSkeleton';
import Pagination from '../../(protected)/technical/change-meter/components/pagination';
import PageNationLoading from '../../(protected)/technical/change-meter/components/pageNationSkeleton';

const DashBoardPage = ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; q: string }>;
}) => {
  const params = use(searchParams);
  const complaintsData = GetAllComplaints(params.page, params.q);
  const statsData = GetComplaintStats();
  const statusName = ComplaintStatusName();
  return (
    <div className=" min-h-screen w-full  ">
      {/* HEADER */}

      <section className="w-full bg-blue-700 rounded-b-4xl   ">
        <ComplaintDashBoardHeader />
      </section>
      <main
        className="
      container
      flex
      gap-4
      py-2
      px-0
      mt-2
      flex-col
      justify-start
      lg:items-center 
      pb-21"
      >
        {/* SECTION STATUS */}
        <section>
          <Suspense
            fallback={
              <div className="flex justify-center w-full h-full">
                <div className="stats">
                  <StatsSkeleton numberofStats={3} />
                </div>
              </div>
            }
          >
            <Stats data={statsData} />
          </Suspense>
        </section>

        <section className="w-full max-w-5xl justify-end flex">
          <Suspense fallback={<TableSearchSkeleton />}>
            <TableSearch data={complaintsData} />
          </Suspense>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
          <Suspense fallback={<ModernConcernCardSkeleton />}>
            <ComplaintsContainer
              complaintsStatusName={statusName}
              data={complaintsData}
            />
          </Suspense>
        </section>

        <section className="flex justify-center w-full ">
          <Suspense fallback={<PageNationLoading />}>
            <Pagination data={complaintsData}/>
          </Suspense>
          

        </section>
      </main>
    </div>
  );
};

export default DashBoardPage;
