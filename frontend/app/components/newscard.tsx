"use client"

import NewsContents from "./NewsContents";
import NewsHeader from "./NewsHeader";
import Divider from "./CustomDivider";
import NewsText from "./NewsText";


type Props = {
    postId: number;
    title: string;
    description: string;
    date_posted: string;
    time_posted: string;
    user_name: string;
    first_name: string;
    last_name: string;
    period: string;
    photo: string
}
const NewsCard =  (
    {   postId,
        title,
        description,
        date_posted,
        time_posted,
        user_name,
        first_name,
        last_name,
        period,
        photo,
    }: Props) => {
    return (
        <div className="card rounded-md flex flex-col lg:h-full bg-base-100/45 w-full drop-shadow-md backdrop-blur-md shadow-lg" >
            <div className="shadow-lg mb-2 p-4 rounded-md">
                {/* HEADER */}
                <NewsHeader
                    author={user_name}
                    first_name={first_name}
                    last_name={last_name}
                    profileUrl={photo}
                    date={date_posted}
                    time={time_posted}
                    period={period}
                />
                <Divider />

                {/* CONTENT */}
                <NewsContents
                    postId={postId}
                    contentType="image"
                    content={
                        [
                            "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                            "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                             "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                             "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                             
                        ]}
                />

                <Divider />

                {/* TITLE AND MESSAGE */}
                <NewsText
                    title={title}
                    description={description} />
            </div>
            {/* FOOTER LIKES AND REACTIONS */}
            <div className="px-6 pb-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200"></div>
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-300"></div>
                    <span className="pl-4 text-xs font-medium text-gray-500 self-center">+1.2k shared</span>
                </div>

                <div className="flex space-x-4">
                    <button type="button" aria-label="likes" className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div >
    )
}
export default NewsCard