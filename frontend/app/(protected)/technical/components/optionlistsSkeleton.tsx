"use client"
type Props = {
    forms: number
}
const OptionListsSkeleton = ({ forms}: Props) => {
    const numberofForms = Array.from({length: forms}, (_, index) => index);
  return (
    <div className='flex flex-col justify-center items-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 w-fit justify-center  items-center'>
                    {numberofForms?.map((form) =>
                    (
                        <div key={form} className="skeleton w-100 glass h-60 flex flex-col gap-2 p-4">
                            <div className="skeleto glass h-10 w-1/3 rounded-box justify-items-start">

                            </div>
                            <div className="skeleton h-20 w-full justify-items-start rounded-box glass">

                            </div>
                            <div className="skeleton glass mt-4 h-10 w-1/3 self-end">

                            </div>
                        </div>
                    ))}
            </div>
        </div>
  )
}

export default OptionListsSkeleton;