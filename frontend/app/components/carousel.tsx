

type Props = {}
import Image from "next/image"
const carousel = (props: Props) => {
    return (
        <>
            <div className="carousel w-full">
                <div id="item1" className="carousel-item w-full">
                    <Image
                    image
                    />
                </div>
            </div>
            <div className="flex w-full justify-center gap-2 py-2">
                <a href="#item1" className="btn btn-xs">1</a>
            </div>
        </>

    )
}

export default carousel