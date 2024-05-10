import { countUsers, getFilteredUsers, getUsersPages } from '@/app/lib/data';

import { Metadata } from 'next';

import FilterCreateUser from '@/app/ui/users/filter-create-user';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Usuarios',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getUsersPages(query);
  const users = await getFilteredUsers(query, currentPage);
  const totalUsers = await countUsers(query);
  const [nextUser] = await getFilteredUsers(query, currentPage + 1);
  const [prevUser] =
    currentPage - 1 > 0
      ? (await getFilteredUsers(query, currentPage - 1)).slice(-1)
      : [undefined];

  return (
    <main>
      <Toaster
        closeButton
        toastOptions={{
          classNames: {
            toast: 'bg-lightPaper dark:bg-darkPaper',
            title: 'text-foreground dark:text-[#FCF6F5]',
            description: 'text-foreground dark:text-[#FCF6F5]',
            error: 'text-danger 1px solid border-danger',
            success: 'text-success 1px solid border-success ',
            actionButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
            cancelButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
            closeButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
          },
        }}
      />
      <h1 className="text-2xl">Usuarios</h1>
      <FilterCreateUser
        data={users}
        nextPageUser={nextUser}
        prevPageUser={prevUser}
        searchParams={searchParams}
        totalPages={totalPages}
        totalUsers={totalUsers}
      />
    </main>
  );
}
