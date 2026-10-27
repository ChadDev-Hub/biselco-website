import React, { Suspense } from "react";
import { ComplaintsDashboardRouteButton } from "@/app/common/buttons/complaints";
import CreateComplaints from "./components/CreateComplaintsModal";
import FabIcon from "@/app/common/Fab";
import { GetComplaintStatusName } from "@/lib/private-api/server-side/complaints";
import { UserComplaints } from "@/lib/private-api/server-side/complaints";
import ComplaintsContainer from "./components/complaintContainer";
import ModernConcernCardSkeleton from "./components/modernConcernCardSkeleton";
import PageHeader from "../home/components/header";
export const dynamic = "force-dynamic";

const ComplaintsPage = () => {
  const data = UserComplaints();
  const statusName = GetComplaintStatusName();
  return (
      <div
        className="flex flex-col gap-2 items-center w-full h-full "
      >
        
        <PageHeader title={{ title: "Welcome to", subtitle: "Complaints Portal!, Need Assistance?" }} description="Contact us: 09176511859 | 09176396436 | 09107101909" />
        
 
        {/* Feature Pills */}
       
            <CreateComplaints />
          
        <section className="grid w-full p-2 grid-cols-1 gap-2">
          <Suspense fallback={<ModernConcernCardSkeleton />}>
            <ComplaintsContainer
              complaintsData={data}
              complaintsStatusName={statusName}
            />
          </Suspense>
        </section>

        <FabIcon>
          <div data-tip="Navigate Dashboard" className="tooltip tooltip-left">
            <ComplaintsDashboardRouteButton />
          </div>
        </FabIcon>
      </div>
 
  );
};
export default ComplaintsPage;
