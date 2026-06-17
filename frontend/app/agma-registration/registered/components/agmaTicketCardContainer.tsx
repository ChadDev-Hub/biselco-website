"use client";

import { use } from "react";
import AgmaTicketCard from "./ticketCard";
import {useRouter} from "next/navigation";
type PromiseType = {
  status?: number;
  data: RegisteredType;
};

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
  registered: Promise<PromiseType>;
  id: string;
};

const AgmaTicketCardContainer = ({ registered }: Props) => {
  const data = use(registered);
  const router = useRouter();
  if(data.status === 404) router.push("/");
  return (
    <AgmaTicketCard data={data.data} />
  );
};

export default AgmaTicketCardContainer;
