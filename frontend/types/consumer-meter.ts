export type Consumer = {
  account_name: string;
  account_no: string;
  meter_brand: string;
  meter_no: string;
  municipality: string;
  village: string;
  geolocation: Location;
};

export type Location = {
  type: string;
  coordinates: [number, number];
};
