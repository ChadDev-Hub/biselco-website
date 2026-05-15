

type Props = {
    children: React.ReactNode
}

const TechnicalPageLayout = async({children}: Props) => {
  return (
    <div className='flex flex-col items-center justify-start w-full '>
        <main className='container pb-14 sm:pb-0 pt-2 px-2 mb-4'>
            {children}
        </main>
    </div>
  )
}

export default TechnicalPageLayout;