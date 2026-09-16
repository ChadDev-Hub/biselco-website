
"use client";

type Props = {
    title: string;
    description: string
    date: string
}

const header = ({
    title,
    description,
    date
}: Props) => {
  return (
   
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-base-content">
            {title}
          </h1>
          <p className="mt-3 text-base text-base-content/70">
            {description}{" "}
            <span className="font-semibold text-base-content">
              {date}
            </span>
          </p>
        </div>
  )
}

export default header