import { Suspense } from "react";
import { GetAgmaFilters, GetAgmaTicketAll } from "../../../../lib/serverFetch";
import MembersTable from "./MembersTicket";
import Pagination from "../../technical/change-meter/components/pagination";
import MembersTicketSkeleton from "./MembersTicketSkeleton";
import NavbarTools from "./Tools";
import Filter from "./Filter";
import FilterSkeleton from "./FilterSkeleton";
import PageNationLoading from "../../technical/change-meter/components/pageNationSkeleton";
import SearchSkeleton from "../../../common/SearchSkeleton";
import SearchComponent from "./Search";
type Props = {
  search: string | string[] | undefined;
  page: string | string[] | undefined;
  year: string | string[] | undefined;
  barangay: string | string[] | undefined;
};

const OverViewSection = ({ page, year, barangay, search }: Props) => {
  const filters = GetAgmaFilters();
  const agmaTicketData = GetAgmaTicketAll(page, year, barangay, search);
  
  return (
    <section>
      <NavbarTools>
        {/* Filter */}
        <Suspense fallback={<FilterSkeleton />}>
          <Filter data={filters} />
        </Suspense>
        {/* Search */}
        <Suspense fallback={<SearchSkeleton />}>
          <SearchComponent promise={agmaTicketData} />
        </Suspense>
      </NavbarTools>
      <Suspense key={`${year}-${page}`} fallback={<MembersTicketSkeleton />}>
        <MembersTable data={agmaTicketData} />
        {/* <MembersTable  data={tabDatas} /> */}
      </Suspense>
      <div className="my-6 w-full flex justify-center">
        <Suspense fallback={<PageNationLoading />}>
          <Pagination data={agmaTicketData} />
        </Suspense>
      </div>
    </section>
  );
};

export default OverViewSection;
