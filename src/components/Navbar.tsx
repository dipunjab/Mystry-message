"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    setLoading(false);
  };

  const handleLoginRedirect = () => {
    setLoading(true);
    router.push("/sign-in");
    setLoading(false);

  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-gray-900 hover:text-gray-700"
            >
              🕵️‍♂️ Mystery Message
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                  Welcome, {user?.username || user?.email}
                </span>
                <Button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLoginRedirect}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
