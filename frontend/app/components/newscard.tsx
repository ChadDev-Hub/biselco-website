
"server"
type Props = {
    title: string;
    description: string;
}
import Image from "next/image";
const NewsCard = ({ title, description }: Props) => {
    return (
        <div className="card flex lg:flex-row bg-base-100 w-90 lg:w-200 p-4 mx-4 shadow-sm" >
            <figure className="h-87.5 sm:h-87.5 lg:h-125">
                <Image
                    loading="eager"
                    src="https://drive.google.com/uc?export=view&id=1SnsFPQdQ1Z3Je-zj4JfUPGD_6MwL7m84"
                    alt="Image"
                    width={600}
                    height={300}
                    sizes="(min-width: 1024px) 200px, 100vw"
                    className="w-full h-full rounded-box object-contain"
                />
            </figure>
            
            <div className="card-body">
                <h2 className="text-center badge-secondary card-title text-xl">
                    {title}
                </h2>
                <p className="pt-2 sm:pt-2 lg:pt-20">{description}</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div>
            </div>
        </div >

    )
}

export default NewsCard