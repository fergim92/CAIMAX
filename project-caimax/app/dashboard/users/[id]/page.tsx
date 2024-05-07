import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAccessActivityByUserId, getUserById } from '@/app/lib/data';
import moment from 'moment';

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
      <h1>
        {user.last_name} {user.name}: {user.dni}
      </h1>
      <form>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name}
          readOnly
          className="block w-full border border-stone-950 p-2 text-black dark:border-gray-700"
        />
      </form>
      <table className="bg-lightPaper dark:bg-darkPaper mt-5 w-full table-auto  ">
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
              Evento
            </th>
            <th
              scope="col"
              className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
            >
              Fecha
            </th>
            <th
              scope="col"
              className="border-collapse border-b-2 border-stone-950 px-6 py-3 dark:border-white"
            >
              Hora
            </th>
          </tr>
        </thead>
        <tbody>
          {userActivity.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-2 text-center">
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
                  className="border-darkPaper border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {activity.access_type}
                </td>
                <td
                  scope="row"
                  className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {activity.event}
                </td>
                <td
                  scope="row"
                  className="border-collapse  border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {moment(activity.datetime).format('DD/MM/YYYY')}
                </td>
                <td scope="row" className=" px-2 py-1">
                  {moment(activity.datetime).format('HH:mm:ss')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
