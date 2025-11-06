import { Metadata } from 'next';
import { getDashboardStats, getRecentActivity } from '@/app/lib/data';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { UsersIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const stats = await getDashboardStats();
  const recentActivity = await getRecentActivity(5);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-lightPaper dark:bg-darkPaper">
          <CardHeader className="flex gap-3">
            <UsersIcon className="h-8 w-8 text-blue-500" />
            <div className="flex flex-col">
              <p className="text-sm text-default-500">Total Usuarios</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardBody>
        </Card>

        <Card className="bg-lightPaper dark:bg-darkPaper">
          <CardHeader className="flex gap-3">
            <ClockIcon className="h-8 w-8 text-green-500" />
            <div className="flex flex-col">
              <p className="text-sm text-default-500">Registros Hoy</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">{stats.todayActivity}</p>
          </CardBody>
        </Card>

        <Card className="bg-lightPaper dark:bg-darkPaper">
          <CardHeader className="flex gap-3">
            <CalendarIcon className="h-8 w-8 text-purple-500" />
            <div className="flex flex-col">
              <p className="text-sm text-default-500">Registros esta Semana</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">{stats.weekActivity}</p>
          </CardBody>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card className="bg-lightPaper dark:bg-darkPaper">
        <CardHeader>
          <h2 className="text-xl font-semibold">Actividad Reciente</h2>
        </CardHeader>
        <CardBody>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-default-200 pb-3 last:border-b-0"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {activity.name} {activity.last_name}
                    </p>
                    <p className="text-sm text-default-500">
                      {activity.event} - {activity.access_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-default-500">
                      {new Date(activity.datetime).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-default-500">
              No hay actividad registrada aún
            </p>
          )}
        </CardBody>
      </Card>
    </main>
  );
}
