
"use client";

import { LandingPageInfoType } from "@/types/info";
import { use } from "react";
import Image from "next/image";
import Sponsor from "./sponsor";

type Props = {
  promise: Promise<LandingPageInfoType>;
  children?: React.ReactNode;
};

export default function Hero({ children, promise }: Props) {
  const { subtitle, description, badge, qoute } = use(promise);

  return (
    <div
      className="
        flex flex-col
        items-center
        pt-25
        pb-16
        gap-4
        px-2
        sm:px-2
        md:px-12
        lg:px-16
        xl:px-60
        bg-linear-to-b
        from-base-100
        to-blue-200
        overflow-x-clip
      "
    >
      <div
        className="
          grid
          gap-1
          w-full
          max-w-7xl
          mt-10
          grid-cols-1
          lg:grid-cols-2
        "
      >
        {/* Subtitle */}
        <div
          className="
            flex
            justify-center
            w-full
            lg:col-span-2
            mb-8
          "
        >
          <h1
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              text-center
              text-blue-700
              font-bold
              text-shadow-lg
            "
          >
            {subtitle}
          </h1>
        </div>

        {/* Text Content */}
        <div
          className="
            flex
            flex-col
            shrink-0
            w-full
            items-center
            gap-2
            lg:items-start
            order-2
            lg:order-1
          "
        >
          <div
            className="
              badge
              text-center
              badge-primary
              badge-outline
            "
          >
            {badge}
          </div>

          <div className="flex w-full flex-col gap-2">
            {/* TITLE */}
            <h2
              className="
                text-primary
                font-extrabold
                italic
                text-center
                lg:text-start
                text-4xl
                sm:text-3xl
                md:text-3xl
                lg:text-4xl
                whitespace-normal
                wrap-break-word
              "
            >
              {qoute}
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                text-black
                text-xl
                text-center
                my-4
                md:text-center
                lg:text-start
                wrap-break-word
                whitespace-normal
              "
            >
              {description}
            </p>
          </div>

          {/* Buttons / Children */}
          <div
            className="
              flex
              justify-center
              lg:justify-start
              w-full
              gap-4
              wrap-break-word
            "
          >
            {children}
          </div>
        </div>

        {/* Image + Sponsor */}
        <div
          className="
            order-1
            flex
            flex-col
            justify-center
            items-center
            gap-4
            px-2
            md:px-15
            lg:px-20
            lg:order-2
          "
        >
          <div className="rounded-full lg:hover-3d">
            <figure className="w-full rounded-full">
              <Image
                src="/biselco-icon.png"
                alt="BISELCO"
                width={200}
                height={200}
                priority
                sizes="200px"
              />
            </figure>
          </div>

          <Sponsor />
        </div>
      </div>
    </div>
  );
}

