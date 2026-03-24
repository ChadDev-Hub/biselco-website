"use client";
import React, { useState, useEffect, use  } from "react";
import { useRouter } from "next/navigation";
import { useWebsocket } from "@/app/utils/websocketprovider";



type PromiseType = {
    status: number;
    data: Page;
}


type Props = {
    data: Promise<PromiseType>;
    pageUrl: string;
}

type Page = {
    total_page: number
}
const TableFooter = ({ data, pageUrl }: Props) => {
    const pages = use(data);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showListPages, setShowListPages] = useState(false);
    const [loading, setLoading] = useState(false);
    const listPages = Array.from( totalPages ? { length: totalPages } : { length: 1 }, (_, index) => index + 1);
    
    // RESOLVE INITIAL DATA AND SET LOADING AFTER SETTING INTIAL DATA
    useEffect(() => {
        if (pages?.status === 200) {
            queueMicrotask(()=>{
                setTotalPages(pages.data.total_page);
                setLoading(false);
            })  
        }
    },[pages]);

    // HANDLE PREVIOUS PAGE
    const handlePreviousPage = () => {
        if (currentPage > totalPages) {
            setLoading(true);
            setCurrentPage(currentPage - 1);
            router.replace(`${pageUrl}?page=${currentPage - 1}`, { scroll: false });
        }
    };

    // HANDLE NEXT PAGE
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setLoading(true);
            setCurrentPage(currentPage + 1);
            router.replace(`${pageUrl}?page=${currentPage + 1}`, { scroll: false });
        };
    }
    // HANDLE MANUAL PAGE SELECTION
    const handleSelectPage = (page: number) => {
        if (page === currentPage) return;
        setLoading(true);
        setCurrentPage(page);
        router.replace(`${pageUrl}?page=${page}`, { scroll: false });
    }

    // SHOW LISTS OF PAGES WHEN DROPDOWN BUTTON IS CLICKED
    const handleShowListPages = () => {
        setShowListPages(!showListPages);
    }

    const message = useWebsocket()

    useEffect(() => {
        switch (message?.detail) {
            case "post_change_meter":
                queueMicrotask(() => {
                    
                    setTotalPages((prev) => Math.max(prev, message.total_page));
                })
                break;
            case "deleted_change_meter":
                queueMicrotask(() => {
                    
                    setTotalPages((prev) => Math.max(prev, message.total_page));
            })
            default:
                break;
        }
    }, [message]);
    return (
        <tfoot className="whitespace-nowrap P-4">
            <tr >
                <th colSpan={15}>
                    <div className="flex gap-2 justify-items-center items-center">
                        <div className="join drop-shadow-md sticky left-2">
                            <button onClick={handlePreviousPage} type="button" className="join-item btn btn-sm">«</button>
                            <div className="dropdown dropdown-top dropdown-center">
                                <button tabIndex={0} onClick={handleShowListPages} type="button" className="join-item  btn btn-sm">Page {currentPage}</button>
                                <ul tabIndex={-1} className="dropdown-content join bg-base-100 rounded-md grid grid-cols-1 max-h-20 w-24  overflow-y-scroll">
                                    {listPages.map((page) => (
                                        <li key={page} onClick={() => handleSelectPage(page)} className="btn btn-sm"  >
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
                </th>
            </tr>
        </tfoot>
    )
}
export default TableFooter;