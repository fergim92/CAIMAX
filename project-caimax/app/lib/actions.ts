/* eslint-disable indent */
'use server';

import { z } from 'zod';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';

export type State = {
  errors?: {
    name?: string[];
    last_name?: string[];
    dni?: string[];
    role?: string[];
    fingerprint?: string[];
    rfid?: string[];
    tag_rfid?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  last_name: z.string(),
  dni: z.string(),
  role: z.string(),
  fingerprint: z.string().nullable(),
  rfid: z.string().nullable(),
  tag_rfid: z.string().nullable(),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas';
        default:
          return 'Algo salio mal :(';
      }
    }
    throw error;
  }
}

// const CreateInvoice = FormSchema.omit({ id: true });

// export async function createInvoice(prevState: State, formData: FormData) {
//   // Validate form using Zod
//   const validatedFields = CreateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Invoice.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;
//   const date = new Date().toISOString().split('T')[0];

//   // Insert data into the database
//   try {
//     await sql`
//         INSERT INTO invoices (customer_id, amount, status, date)
//         VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//       `;
//   } catch (error) {
//     // If a database error occurs, return a more specific error.
//     return {
//       message: 'Database Error: Failed to Create Invoice.',
//     };
//   }

//   // Revalidate the cache for the invoices page and redirect the user.
//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

const UpdateUser = FormSchema.omit({ id: true });

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    last_name: formData.get('last_name'),
    dni: formData.get('dni'),
    role: formData.get('role'),
    fingerprint: formData.get('fingerprint'),
    rfid: formData.get('rfid'),
    tag_rfid: formData.get('tag_rfid'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar usuario.',
    };
  }

  const { name, last_name, dni, role, fingerprint, rfid, tag_rfid } =
    validatedFields.data;

  try {
    await sql`
        UPDATE users
        SET name = ${name}, last_name = ${last_name}, dni = ${dni}, 
        role = ${role}, fingerprint = ${fingerprint}, rfid = ${rfid}, tag_rfid = ${tag_rfid}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update User.' };
  }

  revalidatePath(`/dashboard/users/${id}`);
  redirect(`/dashboard/users/${id}`);
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Usuario eliminado.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
  }
}
