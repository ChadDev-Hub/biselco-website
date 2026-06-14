"use client";
import AgmaTicketCard from "@/app/agma-registration/registered/components/ticketCard";
import { use, useState, useEffect} from "react";
import {useWebsocket} from "@/app/utils/websocketprovider";

type RegisteredType = {
  id: string;
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
  year: string;
};

type PromiseType = {
  status: number;
  data: {
    data: RegisteredType[];
  };
};

type Props = {
  data: Promise<PromiseType>;
};

const MembersTable = ({ data }: Props) => {
  const Tickets = use(data);
  const {message} = useWebsocket();
  const [consumerTickets, setConsumerTickets] = useState<RegisteredType[]>(()=>{
  return Tickets.data.data || []});
  
  useEffect(()=>{
    const setInitialData = async()=>{
      return setConsumerTickets(Tickets.data.data || [])};
      setInitialData()
    },
  [Tickets])

  useEffect(() => {
    if (message?.detail === "new_registered"){
      const setTicket = async()=>{
        setConsumerTickets((prev)=>{
          const existingData = prev.filter((ticket)=>ticket.id !== message.new_regs.id);
        return [message.new_regs, ...existingData] 
        })};
      setTicket();
    }
  },[message]);
 
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
        {Array.isArray(consumerTickets) &&
          consumerTickets.map((ticket, index) => (
              <AgmaTicketCard key={index} data={ticket} />
          ))}
      </div>
    </section>
  );
};

export default MembersTable;
