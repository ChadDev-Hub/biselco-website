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
  year: string;
};

type Props = {
  data: RegisteredType[];
};

const MembersTable = ({ data}: Props) => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
        {Array.isArray(data) &&
          data.map((ticket, index) => (
            <AgmaTicketCard key={index} data={ticket} />
          ))}

      </div>
    </section>
  );
};

export default MembersTable;
