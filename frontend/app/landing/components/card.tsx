"use client"
import Image from 'next/image'
type Props = {
    image_src: string
    title: string
    description: string
}

const EventCard = ({ image_src, title, description }: Props) => {
    return (
        <div className="card card-side bg-base-100 shadow-md drop-shadow-md">
            <figure>
                <Image
                    width={400}
                    height={400}
                    src={image_src}
                    alt={title}
                    sizes='(min-width: 1024px) 200px, 100vw'
                    className='h-full w-full object-contain'
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title wrap-break-word">{title}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Watch</button>
                </div>
            </div>
        </div>
    )
}

export default EventCard