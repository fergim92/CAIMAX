import { getAccessActivity } from '@/app/lib/data';
import { Metadata } from 'next';
import moment from 'moment';

export const metadata: Metadata = {
  title: 'Registros',
};

export default async function Page() {
  const access_activity = await getAccessActivity();

  if (!access_activity) {
    return <p>No hay registros</p>;
  }
  return (
    <main>
      <h1 className="text-2xl">Registros</h1>
      <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
        <table className="mt-5 w-full table-auto bg-paper  ">
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
                Acceso
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
            {access_activity.map((activity) => (
              <tr
                key={activity.id}
                className="border-collapse text-center hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <td
                  scope="row"
                  className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {activity.name}
                </td>
                <td
                  scope="row"
                  className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
                >
                  {activity.last_name}
                </td>
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
                  {activity.role}
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
