import { auth } from '@/auth';

const UserInfo = async () => {
  const session = await auth();
  return (
    <p className="mb-3 text-center">
      Bienvenido{' '}
      <span className=" font-bold text-green-400">{session?.user?.name}!</span>
    </p>
  );
};

export default UserInfo;
