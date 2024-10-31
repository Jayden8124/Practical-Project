"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-white p-6 flex justify-between items-center fixed top-0 w-full shadow-lg z-50 border-b border-gray-200">

      <div className="flex space-x-10 ml-5">
        <button
          onClick={() => router.push('./home')}
          className="text-gray-800 hover:text-indigo-600 text-lg font-medium transition ease-in-out duration-300"
        >
          Home
        </button>
        <button
          onClick={() => router.push('/balance')}
          className="text-gray-800 hover:text-indigo-600 text-lg font-medium transition ease-in-out duration-300"
        >
          Balance
        </button>
        <button
          onClick={() => router.push('/list')}
          className="text-gray-800 hover:text-indigo-600 text-lg font-medium transition ease-in-out duration-300"
        >
          List
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="text-gray-800 hover:text-indigo-600 text-lg font-medium transition ease-in-out duration-300"
        >
          Profile
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
