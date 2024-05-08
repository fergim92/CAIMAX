import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAccessActivityByUserId, getUserById } from '@/app/lib/data';
import moment from 'moment';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { UserForm } from '@/app/ui/users/user-form';

// UUIDs vs. Auto-incrementing Keys
// We use UUIDs instead of incrementing keys (e.g., 1, 2, 3, etc.).
// This makes the URL longer; however, UUIDs eliminate the risk of ID collision, are globally unique,
// and reduce the risk of enumeration attacks - making them ideal for large databases.
// However, if you prefer cleaner URLs, you might prefer to use auto-incrementing keys.

export const metadata: Metadata = {
  title: 'Detalles',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [user, userActivity] = await Promise.all([
    getUserById(id),
    getAccessActivityByUserId(id),
  ]);

  if (!user) {
    notFound();
  }
  return (
    <main>
      <div className="flex justify-between">
        <h1 className="text-2xl">Detalles de usuario</h1>
        <Link href="/dashboard/users">
          <Button color="primary" variant="ghost" className="flex md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Button>
          <Button
            color="primary"
            variant="ghost"
            className="hidden md:flex"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            }
          >
            Volver
          </Button>
        </Link>
      </div>

      <UserForm data={user} />
      <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
        <table className="bg-lightPaper dark:bg-darkPaper mt-5 w-full table-auto">
          <thead className=" bg-gray-300 font-bold uppercase dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Acceso
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Lugar
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Entrada
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Salida
              </th>
            </tr>
          </thead>
          <tbody>
            {userActivity.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-2 text-center">
                  No hay registros
                </td>
              </tr>
            ) : (
              userActivity.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-collapse text-center hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <td
                    scope="row"
                    className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                  >
                    {activity.access_type}
                  </td>
                  <td
                    scope="row"
                    className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                  >
                    {activity.location}
                  </td>
                  <td
                    scope="row"
                    className="border-collapse  border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                  >
                    {moment(activity.datetime).format('DD/MM/YYYY')}
                  </td>
                  <td
                    scope="row"
                    className="border-collapse  border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                  >
                    {moment(activity.datetime).format('HH:mm:ss')}
                  </td>
                  <td scope="row" className=" px-2 py-1">
                    {moment(activity.exit_datetime).format('HH:mm:ss')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
