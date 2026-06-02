"use client"
import MunicipalityFiter from './MunicipalityFiter';



type Props = {
  children: React.ReactNode
}



const StatisticsCharts = (
  {children}: Props
) => {

  return (
    <div className="space-y-2">
    <MunicipalityFiter />
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-8 md:gap-2">
      
      {children}
    </div>
    </div>
    
  );
};

export default StatisticsCharts;
