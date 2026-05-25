
import { useEffect, useState } from "react";
import { GetAgmaTicketAll } from "@/lib/serverFetch";
import AgmaTicketCard from "@/app/agma-registration/registered/components/ticketCard";

type RegisteredType = {
  account_no: string;
  name: string;
  phone: string;
  image: string;
  signature: string;
  account_name: string;
  village: string;
  municipality: string;
  meter_no: string;
  meter_brand: string;
  date_registered: string;
  time_registered: string;
};


const MembersTable = () => {
  const [tickets, setTickets] = useState<RegisteredType[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await GetAgmaTicketAll();
      setTickets(data.data);
    };

    fetchTickets();
  }, []);
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.isArray(tickets) && tickets.map((ticket, index) => (
        <AgmaTicketCard key={index} data={{ ...ticket, year: new Date().getFullYear().toString() }}   />
      ))}
    </div>
  );
};

export default MembersTable;
