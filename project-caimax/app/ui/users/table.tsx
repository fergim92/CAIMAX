'use client';
import Link from 'next/link';
import { DeleteUserButton } from '@/app/ui/users/delete-user-button';
import { Button } from '@nextui-org/react';
import { UsersTable } from '@/app/lib/definitions';
import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';

export const UsersTableComponent = ({
  users,
  setUsers,
  nextPageUser,
  searchParams,
  setPages,
  pages,
  totalUsers,
  setCantUsers,
}: {
  users: UsersTable[];
  setUsers: (users: UsersTable[]) => void;
  nextPageUser: UsersTable;
  searchParams?: {
    query?: string;
    page?: string;
  };
  setPages: (pages: number) => void;
  totalUsers: number;
  setCantUsers: (cantUsers: number) => void;
  pages: number;
}) => {
  const [pending, setPending] = useState(false);
  return (
    <table className="mt-5 w-full table-auto bg-lightPaper dark:bg-darkPaper">
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
            Huella
          </th>
          <th
            scope="col"
            className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
          >
            RFID
          </th>
          <th
            scope="col"
            className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
          >
            Tag RFID
          </th>
          <th
            scope="col"
            className="border-collapse border-b-2 border-r-2 border-stone-950 px-6 py-3 dark:border-white"
          >
            Ver
          </th>
          <th
            scope="col"
            className="border-collapse border-b-2  border-stone-950 px-6 py-3 dark:border-white"
          >
            Borrar
          </th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={9} className="py-2 text-center">
              No hay registros en esta página
            </td>
          </tr>
        ) : (
          users?.map((user) => (
            <tr
              key={user?.id}
              className="border-collapse text-center hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <td
                scope="row"
                className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                {user?.name}
              </td>
              <td
                scope="row"
                className=" border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                {user?.last_name}
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                {user?.dni}
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                {user?.role}
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                <div className="flex items-center justify-center">
                  {user?.fingerprint !== null ? (
                    <CheckIcon className="h-6 w-6" />
                  ) : (
                    <XMarkIcon className="h-6 w-6" />
                  )}
                </div>
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                <div className="flex items-center justify-center">
                  {user?.rfid !== null ? (
                    <CheckIcon className="h-6 w-6" />
                  ) : (
                    <XMarkIcon className="h-6 w-6" />
                  )}
                </div>
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                <div className="flex items-center justify-center">
                  {user?.tag_rfid !== null ? (
                    <CheckIcon className="h-6 w-6" />
                  ) : (
                    <XMarkIcon className="h-6 w-6" />
                  )}
                </div>
              </td>
              <td
                scope="row"
                className="border-collapse border-r-2 border-stone-950 px-2 py-1 dark:border-white"
              >
                <Link href={`/dashboard/users/${user?.id}`}>
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
                <DeleteUserButton
                  user={user}
                  setUsers={setUsers}
                  users={users}
                  nextPageUser={nextPageUser}
                  searchParams={searchParams}
                  setPages={setPages}
                  pages={pages}
                  setCantUsers={setCantUsers}
                  totalUsers={totalUsers}
                  setPending={setPending}
                  isDisabled={pending}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
