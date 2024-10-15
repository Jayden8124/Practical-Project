import React from 'react';
// import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <nav className="flex space-x-4">
          <button onClick={() => router.push('/.')} className="text-gray-700 hover:text-black">
            Home
          </button>
          <button onClick={() => router.push('/balance')} className="text-gray-700 hover:text-black">
            Balance
          </button>
          <button onClick={() => router.push('/list')} className="text-gray-700 hover:text-black">
            List
          </button>
          <button onClick={() => router.push('/profile')} className="text-gray-700 hover:text-black">
            Profile
          </button>
        </nav>
        <button onClick={() => router.push('/logout')} className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
          Log Out
        </button>
      </header>

      <main className="flex items-center justify-center flex-1 p-8">
        <div className="w-full max-w-2xl p-8 bg-gray-200 rounded-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 mb-4 bg-gray-300 rounded-full">
              <Image
                src="/placeholder.png"
                alt="User Placeholder"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-bold">Mr. Pakkhapol Saekow</h2>
            <p className="text-gray-600">Tue Oct 15 2024 21:40:51</p>
          </div>
          <button className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
            Check In
          </button>
        </div>
      </main>
    </div>
  );
}