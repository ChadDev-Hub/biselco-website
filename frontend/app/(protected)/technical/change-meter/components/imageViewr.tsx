"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { motion } from 'framer-motion';
import {ImageOff} from "lucide-react";

type Props = {
  image: string | null;
  className?: string;
};

const ImageViewer = ({ image, className }: Props) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const handleOpen = useCallback(() => {
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
    setScale(1);
  }, []);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        title="View Image"
        onClick={handleOpen}
        className={`relative   cursor-pointer overflow-hidden rounded-box ${ className ? className : "border-2 border-blue-600 border-dashed ring ring-secondary" } w-34.25 h-15`}
      >
        {image? <Image
          src={image}
          alt="change meter image"
          width={137}
          height={60}
          quality={75}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 329px"
          className="object-contain  hover:scale-110 transition-all duration-200"
        />: <ImageOff width={30} height={30} className="object-contain text-red-500 stroke-1 place-self-center hover:scale-110 transition-all duration-200"/>}
      </button>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        className="modal modal-bottom  sm:px-4 md:px-[10%] lg:px-[20%] xl:px-[25%]"
      >
        <div className="modal-box relative w-full  p-2 bg-base-100">

          {/* Controls */}
          <div className="absolute top-2  right-2 z-50 flex gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="btn btn-xs"
            >
              -
            </button>

            <button
              type="button"
              onClick={zoomIn}
              className="btn btn-xs"
            >
              +
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-xs btn-error"
            >
              ✕
            </button>
          </div>

          {/* Zoom Container */}
          {open && (
            <div className="overflow-auto w-full h-[80vh]">
              <motion.div
                className="relative transition-all duration-200 mx-auto"
                style={{
                  width: `${scale * 100}%`,
                  height: `${scale * 70}vh`,
                  minWidth: "100%",
                }}
              >
                {image? <Image
                  src={image}
                  alt="change meter image"
                  fill
                  priority
                  quality={100}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 329px"
                /> : <span>No Image Available</span>}
              </motion.div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default ImageViewer;