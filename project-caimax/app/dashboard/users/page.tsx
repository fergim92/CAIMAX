import { getUsers } from '@/app/lib/data';
import { DeleteUserButton } from '@/app/ui/users/delete-button';
import { Button } from '@nextui-org/react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Usuarios',
};

export default async function Page() {
  const users = await getUsers();

  if (!users) {
    return <p>No hay usuarios</p>;
  }
  return (
    <main>
      <h1 className="text-2xl">Usuarios</h1>
      <div className="relative overflow-x-auto overflow-y-hidden shadow-xl sm:rounded-lg">
        <table className="mt-5 w-full table-auto bg-paper">
          <thead className=" bg-gray-300 font-bold uppercase dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Apellido
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                DNI
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Rol
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
              >
                Detalles
              </th>
              <th
                scope="col"
                className="border-collapse border-b-2  border-stone-950 px-6 py-3 dark:border-white"
              >
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-collapse text-center hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <td
                  scope="row"
                  className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.name}
                </td>
                <td
                  scope="row"
                  className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.last_name}
                </td>
                <td
                  scope="row"
                  className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.dni}
                </td>
                <td
                  scope="row"
                  className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.role}
                </td>
                <td
                  scope="row"
                  className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  <Link href={`/dashboard/users/${user.id}`}>
                    <Button
                      className="border-primary font-bold hover:border-1 hover:text-primary"
                      variant="light"
                      size="sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </Button>
                  </Link>
                </td>
                <td scope="row" className=" border-collapse ">
                  <DeleteUserButton data={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
