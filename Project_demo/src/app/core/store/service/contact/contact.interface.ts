export interface ContactMessage {
  subject: string;
  comments: string;
  soldTo?: string;
  shipTo?: string;
  vat?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  salesOrder?: string;
}
