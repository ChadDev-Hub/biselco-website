"use client";
import Image from "next/image";
import {motion} from "framer-motion";
type Props = {
  image_src: string;
  title: string;
  description: string;
};

const EventCard = ({ image_src, title, description }: Props) => {
  return (
    <div className="card card-side relative bg-base-100 shadow-md  w-90 sm:w-auto md:w-auto">
        <motion.h1 className="text-3xl  -rotate-45 text-primary absolute top-1 -left-10 z-10 transform font-extrabold mb-4">Events</motion.h1>

      <figure className="shrink-0 w-32 sm:w-40 md:w-48">
        <Image
          src={image_src}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="card-body min-w-0">
        <h2 className="card-title wrap-break-words whitespace-normal">{title}</h2>
        <p className="wrap-break-word whitespace-normal">{description}</p>

        <div className="card-actions justify-end">
          <button className="btn btn-primary">Register</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
