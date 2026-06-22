"use client";
import AgmaTicketCard from "@/app/agma-registration/registered/components/ticketCard";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
import { TicketInfoType } from "@/types/agma";

//

type PromiseType = {
  status: number;
  data: {
    data: TicketInfoType[];
  };
};

type Props = {
  data: Promise<PromiseType>;
};

const MembersTable = ({ data }: Props) => {
  const Tickets = use(data);
  const { message } = useWebsocket();

  const [consumerTickets, setConsumerTickets] = useState<TicketInfoType[] | []>(
    () => {
      return Tickets.data.data || [];
    },
  );
 
  useEffect(() => {
    const setInitialData = async () => {
      return setConsumerTickets(Tickets.data.data || []);
    };
    setInitialData();
  }, [Tickets]);

  useEffect(() => {
    switch (message?.detail) {
      case "new_registered":
        const setTicket = async () => {
          setConsumerTickets((prev) => {
            const existingData = prev.filter(
              (ticket) => ticket.id !== message.new_regs.id,
            );
            return [message.new_regs, ...existingData];
          });
        };
        setTicket();
        break;
      case "agma_verified_consumer":
          const update = async () => {
            setConsumerTickets((prev) =>
            prev.map((ticket) =>
              ticket.id === message.data.id
                ? {
                    ...ticket,
                    is_verified: message.data.is_verified,
                  }
                : ticket,
            ),
          )};
          update();
        break;
      default:
        break;
    }
  }, [message]);

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
