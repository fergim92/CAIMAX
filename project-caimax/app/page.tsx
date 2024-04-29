import Link from 'next/link';
import MainLogo from './ui/main-logo';

export default function Page() {
  return (
    <main>
      <div className="flex flex-grow flex-col items-center justify-center p-6">
        <MainLogo />
        <button>
          <Link
            href="/login"
            className="mt-1 rounded-md bg-green-400 px-4 py-2 text-lg hover:bg-green-600"
          >
            Ingresar
          </Link>
        </button>
        <p className="text-skin-base mt-4 text-center text-lg">
          Proyecto CAIMAX de la materia Laboratorio de Sistemas Embebidos UNRN
        </p>
      </div>
    </main>
  );
}
