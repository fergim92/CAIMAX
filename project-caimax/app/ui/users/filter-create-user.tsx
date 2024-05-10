'use client';
import { Button } from '@nextui-org/react';
import Search from '@/app/ui/search';
import { useEffect, useState } from 'react';
import { UsersTable } from '@/app/lib/definitions';
import { UsersTableComponent } from './table';
import Pagination from '../pagination';
import { CreateUserForm } from './create-form';
import { motion, AnimatePresence } from 'framer-motion';

const FilterCreateUser = ({
  data,
  nextPageUser,
  prevPageUser,
  searchParams,
  totalPages,
  totalUsers,
}: {
  data: UsersTable[];
  prevPageUser: UsersTable | undefined;
  nextPageUser: UsersTable;
  searchParams?: {
    query?: string;
    page?: string;
  };
  totalPages: number;
  totalUsers: number;
}) => {
  const [activeForm, setActiveForm] = useState(false);
  const [users, setUsers] = useState(data);
  const [pages, setPages] = useState(totalPages);
  const [cantUsers, setCantUsers] = useState(totalUsers);
  const query = searchParams?.query;
  useEffect(() => {
    setUsers(data);
    setPages(pages);
  }, [data, cantUsers, query]);
  useEffect(() => {
    setPages(totalPages);
  }, [totalPages]);
  useEffect(() => {
    setCantUsers(totalUsers);
  }, [totalUsers]);

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <Search placeholder="Buscar usuarios" />
        <div>
          <Button
            color="success"
            onClick={() => {
              setActiveForm(!activeForm);
            }}
            endContent={
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
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            }
          >
            Nuevo usuario
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {activeForm && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <CreateUserForm
              setActiveForm={setActiveForm}
              users={users}
              setUsers={setUsers}
              setPages={setPages}
              searchParams={searchParams}
              prevPageUser={prevPageUser}
              pages={pages}
              totalUsers={totalUsers}
              setCantUsers={setCantUsers}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <div className="relative overflow-x-auto overflow-y-hidden shadow-xl sm:rounded-lg">
        <UsersTableComponent
          users={users}
          setUsers={setUsers}
          nextPageUser={nextPageUser}
          searchParams={searchParams}
          setPages={setPages}
          totalUsers={cantUsers}
          setCantUsers={setCantUsers}
          pages={pages}
        />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pages} />
      </div>
    </>
  );
};

export default FilterCreateUser;
