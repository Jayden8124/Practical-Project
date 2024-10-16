import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center sticky top-0 w-full shadow-md z-50">
      <div className="flex space-x-10">
        <button onClick={() => router.push('./')} className="text-black hover:text-red-600 text-xl font-semibold">Home</button>
        <button onClick={() => router.push('/balance')} className="text-black hover:text-red-600 text-xl font-semibold">Balance</button>
        <button onClick={() => router.push('/list')} className="text-black hover:text-red-600 text-xl font-semibold">List</button>
        <button onClick={() => router.push('/profile')} className="text-black hover:text-red-600 text-xl font-semibold">Profile</button>
      </div>
      <button onClick={() => router.push('/login')} className="bg-gray-800 text-white px-4 py-2 rounded">Log Out</button>
    </nav>
  );
};

export default Navbar;