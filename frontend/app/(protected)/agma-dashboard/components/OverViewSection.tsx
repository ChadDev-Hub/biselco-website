import { Suspense } from "react";

import { GetAgmaTicketAll , GetAgmaFilters} from "../../../../lib/agma";
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
  municipality: string | string[] | undefined;
};

const OverViewSection = ({ page, year, barangay, search, municipality }: Props) => {
  const filters = GetAgmaFilters(municipality);
  const agmaTicketData = GetAgmaTicketAll(page, year, barangay, search, municipality);
  
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
