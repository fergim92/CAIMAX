// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Admin = {
  id: string;
  role: number;
  name: string;
  email: string;
  username: string;
  password: string;
};

export type User = {
  id: string;
  role: number;
  name: string;
  last_name: string;
  dni: number;
  fingerprint: string | null;
  rfid: string | null;
  tag_rfid: string | null;
};

export type AccessActivity = {
  id: string;
  user_id: string;
  datetime: string;
  event: string;
  access_type: 'Huella digital' | 'RFID';
};

export type AccessActivityWithUser = {
  id: string;
  name: string;
  last_name: string;
  role: string;
  user_id: string;
  datetime: string;
  exit_datetime: string;
  event: string;
  location: string;
  access_type: 'Huella digital' | 'RFID';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type UsersTable = {
  id: string;
  name: string;
  last_name: string;
  dni: string;
  role: string;
  fingerprint: string | null;
  rfid: string | null;
  tag_rfid: string | null;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  last_name: string;
  dni: string;
};

export type UserField = {
  id: string;
  name: string;
  last_name: string;
  dni: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
