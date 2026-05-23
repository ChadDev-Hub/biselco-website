type Props = {
  children: React.ReactNode;
};

const TechnicalPageLayout = async ({ children }: Props) => {
  return (
    <div className="flex min-h-screen pt-4 pb-20 flex-col items-center justify-start w-full ">
      {children}
    </div>
  );
};

export default TechnicalPageLayout;
