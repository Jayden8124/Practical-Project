import { useRouter } from 'next/navigation';

const Footer = () => {
    const router = useRouter();

    const handleLogout = () => {
      localStorage.clear(); // Clear all local storage data
      router.push('/auth'); // Redirect to login page
    };

    return (
      <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded mt-8 mx-auto">
        Log Out
      </button>
    );
};

export default Footer;
