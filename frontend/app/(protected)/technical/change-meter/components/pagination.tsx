"use client";
import  { useState, useEffect, use } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useWebsocket } from "@/app/utils/websocketprovider";

type PromiseType = {
  status: number;
  data: Page;
};

type Props = {
  data: Promise<PromiseType>;
};

type Page = {
  total_page: number;
};
const Pagination = ({ data}: Props) => {
  const pages = use(data);
  const router = useRouter();
  const currentPath = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showListPages, setShowListPages] = useState(false);
  const [loading, setLoading] = useState(false);
  const query = useSearchParams();
  const listPages = Array.from(
    totalPages ? { length: totalPages } : { length: 1 },
    (_, index) => index + 1,
  );
  // RESOLVE INITIAL DATA AND SET LOADING AFTER SETTING INTIAL DATA
  useEffect(() => {
    if (pages?.status === 200) {
      queueMicrotask(() => {
        setTotalPages(pages.data.total_page);
        setLoading(false);
      });
    }
  }, [pages]);


  useEffect(() => {
    if (query.get("page")) {
      queueMicrotask(() => setCurrentPage(parseInt(query.get("page") as string)));
    }
  },[query]);

  const buildParms = (page:number) => {
    const params = new URLSearchParams();
    query.forEach((value, key) => params.set(key, value));
    if (query.get("q")) params.set("q", query.get("q") as string);
    if (query.get("tab")) params.set("tab", query.get("tab") as string);
    params.set("page", String(page));
    return params.toString();
  }

  // HANDLE PREVIOUS PAGE
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const params = buildParms(currentPage - 1);
      setLoading(true);
      setCurrentPage(currentPage - 1);
      router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
    }
  };

  // HANDLE NEXT PAGE
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const params = buildParms(currentPage + 1);
      setLoading(true);
      setCurrentPage(currentPage + 1);
      router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
    }
  };
  // HANDLE MANUAL PAGE SELECTION
  const handleSelectPage = (page: number) => {
    if (page === currentPage) return;
    const params = buildParms(page);
    setLoading(true);
    setCurrentPage(page);
    router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
  };

  // SHOW LISTS OF PAGES WHEN DROPDOWN BUTTON IS CLICKED
  const handleShowListPages = () => {
    setShowListPages(!showListPages);
  };

  const { message } = useWebsocket();

  useEffect(() => {
    switch (message?.detail) {
      case "complaints_admin":
        queueMicrotask(() => {
          setTotalPages((prev) => Math.max(prev, message.data.total_page));
        });
        break;
      case "new_connection_created":
        queueMicrotask(() => {
          setTotalPages((prev) => Math.max(prev, message.total_page));
        });
      default:
        break;
    }
  }, [message]);
  return (
    <div className="flex gap-2 justify-items-center items-center">
      <div className="join drop-shadow-md sticky left-2">
        <button
          onClick={handlePreviousPage}
          type="button"
          className="join-item btn btn-sm"
        >
          «
        </button>
        <div className="dropdown dropdown-top dropdown-center">
          <button
            tabIndex={0}
            onClick={handleShowListPages}
            type="button"
            className="join-item  btn btn-sm"
          >
            Page {currentPage}
          </button>
          <ul
            tabIndex={-1}
            className="dropdown-content join bg-base-100 rounded-md grid grid-cols-1 max-h-20 w-24  overflow-y-scroll"
          >
            {listPages.map((page) => (
              <li
                key={page}
                onClick={() => handleSelectPage(page)}
                className="btn btn-sm"
              >
                Page {page}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleNextPage}
          type="button"
          className="join-item btn btn-sm"
        >
          »
        </button>
      </div>
      {loading && <div className="skeleton-text skeleton">Loading data...</div>}
    </div>
  );
};
export default Pagination;
