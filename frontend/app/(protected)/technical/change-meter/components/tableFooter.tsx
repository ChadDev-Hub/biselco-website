"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";




type PromiseType = {
    status: number;
    data: Data;
} | undefined

type Data = {
    data: unknown[];
    total_page: number;
}

type Props = {
    data: Promise<PromiseType>;
}
const TableFooter = ({ data }: Props) => {
    use(data);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showListPages, setShowListPages] = useState(false);
    const listPages = Array.from({ length: totalPages }, (_, index) => index + 1);

    // RESOLVE INITIAL DATA AND SET LOADING AFTER SETTING INTIAL DATA
    useEffect(() => {
        data.then((res) => {
            if (res?.status === 200) {
                queueMicrotask(() => {
                    setTotalPages(res.data.total_page);
                    setLoading(false);
                })
            }
        })
    }, [data]);

    // HANDLE PREVIOUS PAGE
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setLoading(true);
            setCurrentPage(currentPage - 1);
        }
    };

    // HANDLE NEXT PAGE
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setLoading(true);
            setCurrentPage(currentPage + 1)

        };
    }
    // HANDLE MANUAL PAGE SELECTION
    const handleSelectPage = (page: number) => {
        if (page === currentPage) return;
        setLoading(true);
        setCurrentPage(page);
    }

    // SHOW LISTS OF PAGES WHEN DROPDOWN BUTTON IS CLICKED
    const handleShowListPages = () => {
        setShowListPages(!showListPages);
    }

    // ROUTER CHANGE TO FETCH NEW CHANGE METER DATA
    useEffect(() => {
        router.replace(`/technical/change-meter/?page=${currentPage}`, { scroll: false });
    }, [currentPage, router]);
    
    return (
        <tfoot className="glass whitespace-nowrap P-4">
            <tr className="glass bg-transparent">
                <td colSpan={12} >
                    <div className="flex gap-2 justify-items-center items-center">
                        <div className="join drop-shadow-md border-white">
                            <button onClick={handlePreviousPage} type="button" className="join-item btn btn-sm">«</button>
                            <div className="dropdown dropdown-top dropdown-center">
                                <button tabIndex={0} onClick={handleShowListPages} type="button" className="join-item  btn btn-sm">Page {currentPage}</button>
                                    <ul tabIndex={-1} className="dropdown-content join bg-base-100 rounded-md grid grid-cols-1 max-h-20 w-24  overflow-y-scroll">
                                        {listPages.map((page) => (
                                            <li key={page}  onClick={() => handleSelectPage(page)} className="btn btn-sm"  >
                                                Page {page}
                                            </li>
                                        ))}
                                    </ul>
                                
                            </div>
                            <button onClick={handleNextPage} type="button" className="join-item btn btn-sm">»</button>
                        </div>
                        {loading && <div className="skeleton-text skeleton">
                            Loading data...
                        </div>}
                    </div>
                </td>
            </tr>
        </tfoot>
    )
}
export default TableFooter;