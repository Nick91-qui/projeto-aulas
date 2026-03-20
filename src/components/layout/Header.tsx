import Link from "next/link";

export function Header() {
  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold hover:text-blue-100 transition-colors"
        >
          Química Ensino Médio
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/assuntos"
                className="hover:text-blue-200 transition-colors"
              >
                Assuntos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
