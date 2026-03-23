"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

type AdminHeaderProps = {
  userEmail?: string | null;
};

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/admin" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-800">Admin</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin/assuntos"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Assuntos
              </Link>
              <Link
                href="/admin/aulas"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Aulas
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-gray-600 hidden md:block">
                {userEmail}
              </span>
            )}
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
