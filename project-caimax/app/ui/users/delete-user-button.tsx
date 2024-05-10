'use client';
import { deleteUser } from '@/app/lib/actions';
import { UsersTable } from '@/app/lib/definitions';
import { Button } from '@nextui-org/react';
import { useContext } from 'react';
import ThemeContext from '@/context/theme-context';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const DeleteUserButton = ({
  users,
  user,
  setUsers,
  nextPageUser,
  searchParams,
  setPages,
  setCantUsers,
  totalUsers,
  pages,
  isDisabled,
  setPending,
}: {
  users: UsersTable[];
  user: UsersTable;
  setUsers: (users: UsersTable[]) => void;
  nextPageUser: UsersTable;
  searchParams?: {
    query?: string;
    page?: string;
  };
  setPages: (pages: number) => void;
  setCantUsers: (cantUsers: number) => void;
  totalUsers: number;
  pages: number;
  isDisabled: boolean;
  setPending: (pending: boolean) => void;
}) => {
  const currentPage = Number(searchParams?.page);
  const query = searchParams?.query;
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <Button
      className="border-danger font-bold hover:border-1 hover:text-danger"
      variant="light"
      size="sm"
      isDisabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          Swal.fire({
            title: `Estas seguro de eliminar a "${user.name} ${user.last_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            iconColor: 'red',
            background: theme === 'dark' ? '#17222e' : '#FCF6F5',
            color: theme === 'dark' ? '#FCF6F5' : '#101820',
            confirmButtonColor: 'red',
            confirmButtonText: 'Si, deseo eliminarlo!',
            cancelButtonColor: theme === 'dark' ? '#17222e' : '#FCF6F5',
            cancelButtonText: `<span style="color: ${theme === 'dark' ? '#FCF6F5' : '#101820'}">Cancelar</span>`,
          }).then((result) => {
            if (result.isConfirmed) {
              setPending(true);
              toast.promise(
                deleteUser(user.id).then(() => {
                  if (
                    users.length === 1 &&
                    query === undefined &&
                    currentPage > 1
                  ) {
                    router.push(`/dashboard/users?page=${currentPage - 1}`);
                  } else if (users.length === 1 && currentPage > 1) {
                    router.push(
                      `/dashboard/users?page=${currentPage - 1}&query=${query}`,
                    );
                  }
                  if (users.length === 1 && currentPage == 1) {
                    setUsers([]);
                  } else if (nextPageUser !== undefined) {
                    setUsers([
                      ...users.filter((item) => item.id !== user.id),
                      nextPageUser,
                    ]);
                  } else {
                    setUsers([...users.filter((item) => item.id !== user.id)]);
                  }
                }),
                {
                  loading: 'Eliminando usuario...',
                  success: 'Usuario eliminado!',
                  error: 'Error al eliminar usuario!',
                },
              );
              if (totalUsers % 6 === 5 && pages > 1) {
                setPages(pages - 1);
              }
              setCantUsers(totalUsers - 1);
              setTimeout(() => {
                setPending(false);
              }, 1000);
            }
          });
        }
      }}
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
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </Button>
  );
};
