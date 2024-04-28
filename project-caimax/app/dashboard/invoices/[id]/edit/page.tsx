/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

// UUIDs vs. Auto-incrementing Keys
// We use UUIDs instead of incrementing keys (e.g., 1, 2, 3, etc.).
// This makes the URL longer; however, UUIDs eliminate the risk of ID collision, are globally unique,
// and reduce the risk of enumeration attacks - making them ideal for large databases.
// However, if you prefer cleaner URLs, you might prefer to use auto-incrementing keys.

export const metadata: Metadata = {
  title: 'Edit invoices',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // const [invoice, customers] = await Promise.all([
  //   fetchInvoiceById(id),
  //   fetchCustomers(),
  // ]);
  // if (!invoice) {
  //   notFound();
  // }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}
