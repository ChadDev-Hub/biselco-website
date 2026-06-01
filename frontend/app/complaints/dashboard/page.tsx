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
import ModernConcernCardSkeleton from '../components/modernConcernCardSkeleton';
import Pagination from '../../(protected)/technical/change-meter/components/pagination';
import PageNationLoading from '../../(protected)/technical/change-meter/components/pageNationSkeleton';
import SearchComponent from "../../(protected)/agma-dashboard/components/Search"
import SearchSkeleton from '../../common/SearchSkeleton';
const DashBoardPage = ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; search: string }>;
}) => {
  const params = use(searchParams);
  const complaintsData = GetAllComplaints(params.page, params.search);
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
      flex
      gap-4
      py-2
      mt-2
      flex-col
      justify-start
      items-center
      w-full 
      pb-24"
      >
        {/* SECTION STATUS */}
        <section className="w-full flex justify-center px-2">
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
          <Suspense fallback={<SearchSkeleton />}>
            {/* <TableSearch data={complaintsData} /> */}
            <SearchComponent promise={complaintsData} />
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
