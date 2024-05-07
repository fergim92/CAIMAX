import { getUsers } from '@/app/lib/data';
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
        <table className="bg-lightPaper dark:bg-darkPaper mt-5 w-full table-auto  ">
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
                className="border-collapse border-b-2  border-stone-950 px-6 py-3 dark:border-white"
              >
                Detalles
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
                  className="border-darkPaper border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.dni}
                </td>
                <td
                  scope="row"
                  className="border-darkPaper border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {user.role}
                </td>
                <td scope="row" className=" border-collapse ">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="rounded px-4 py-2 font-bold text-white hover:text-green-600"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
