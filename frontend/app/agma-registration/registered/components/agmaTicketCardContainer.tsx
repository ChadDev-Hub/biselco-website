"use client";

import { use } from "react";
import AgmaTicketCard from "./ticketCard";
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
};

type Props = {
  registered: Promise<PromiseType>;
  id: string;
};

const AgmaTicketCardContainer = ({ registered }: Props) => {
  const { data } = use(registered);
  const year = new Date().getFullYear();

  return (
    <AgmaTicketCard data={{ ...data, year: year.toString() }} />
  );
};

export default AgmaTicketCardContainer;
