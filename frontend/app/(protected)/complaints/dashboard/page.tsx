import { Suspense, use } from "react";
import ComplaintStats from "./components/status";
import {
  GetComplaintStats,
} from "@/lib/serverFetch";
import ComplaintsContainer from "./components/complaintsDashboardContainer";
import ComplaintDashBoardHeader from "./components/header";
import StatsSkeleton from "@/app/common/statsSkeleton";
import ModernConcernCardSkeleton from '../components/modernConcernCardSkeleton';
import Pagination from '../../technical/change-meter/components/pagination';
import PageNationLoading from '../../technical/change-meter/components/pageNationSkeleton';
import SearchComponent from "../../agma-dashboard/components/Search"
import SearchSkeleton from '../../../common/SearchSkeleton';
import {GetAllComplaints} from "@/lib/private-api/server-side/complaints";
import {GetComplaintStatusName} from "@/lib/private-api/server-side/complaints";
const DashBoardPage = ({
  searchParams,
}: {
  searchParams: Promise<{ page: number; search: string }>;
}) => {
  const params = use(searchParams);
  const complaintsData = GetAllComplaints(params.page, params.search);
  const statsData = GetComplaintStats();
  const statusName = GetComplaintStatusName();
  return (
    <div className="w-full px-2 flex flex-col items-center gap-2">
      {/* HEADER */}

      <section className="w-full flex justify-center bg-blue-700 rounded-b-4xl   ">
        <ComplaintDashBoardHeader />
      </section>
      
        {/* SECTION STATUS */}
        
          <Suspense
            fallback={
              <div className="flex justify-center w-full h-full">
                <div className="stats">
                  <StatsSkeleton numberofStats={3} />
                </div>
              </div>
            }
          >
            <ComplaintStats data={statsData} />
          </Suspense>
        

        <section className="w-full max-w-5xl justify-end flex">
          <Suspense fallback={<SearchSkeleton />}>
            {/* <TableSearch data={complaintsData} /> */}
            <SearchComponent promise={complaintsData} />
          </Suspense>
        </section>

        {/* SECTION COMPLAINTS */}
  

            <Suspense fallback={<ModernConcernCardSkeleton />}>
            <ComplaintsContainer
              complaintsStatusName={statusName}
              data={complaintsData}
            />
          </Suspense>
   
          
        

        <section className="flex justify-center w-full ">
          <Suspense fallback={<PageNationLoading />}>
            <Pagination data={complaintsData}/>
          </Suspense>
        </section>
      
    </div>
  );
};

export default DashBoardPage;
