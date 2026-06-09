export type AgmaEventType = {
  id?: number;
  title?: string;
  description?: string;
  target_date?: number;
  is_active?: boolean;
  qoute_title?: string;
  qoute_description?: string;
  footer?: string;
  image_src?: string;
  abrevation?: { char: string; color: string }[];
};
