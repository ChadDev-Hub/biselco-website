
"use server"
type Props = {
    title: string;
    description: string;
}
import NewsContents from "./NewsContents";
import NewsHeader from "./NewsHeader";
import Divider from "./CustomDivider";
const NewsCard = async ({ title, description }: Props) => {
    return (
        <div className="card flex flex-col lg:h-full bg-base-100 lg:w-200 p-4  drop-shadow-2xl" >

            <div className="card-border p-4 rounded-box">
                {/* HEADER */}
                <NewsHeader
                    author="Richard"
                    profileUrl="https://lh3.googleusercontent.com/a/ACg8ocL4MtgkdVBQWMcjROm0OfbTaPWBS1Lqbah9zcbjr6TB9W0JYsgO=s396-c-no"
                    date="Jan 28, 2026"
                    time="11:40 pm"
                />

                <Divider/>

                {/* CONTENT */}
                <NewsContents
                contentType="image"
                content={
                    [
                    "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                    "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                    "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                    "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA",
                    "https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA"
                ]}
                />

             
                <Divider/>
                {/* TITLE AND MESSAGE */}
                <div className="px-6 py-2">
                    <h2 className="text-2xl font-extrabold text-blue-900 mb-2 leading-snug">
                        {title}
                    </h2>
                    <p className="text-yellow-600  text-sm line-clamp-4">
                        {description}
                    </p>
                </div>
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div >
    )
}
export default NewsCard