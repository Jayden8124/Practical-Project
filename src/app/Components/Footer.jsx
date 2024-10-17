import { useRouter } from 'next/navigation';

const Footer = () => {
    const router = useRouter();
  
    return (
      <button onClick={() => router.push('/login')} className="bg-gray-800 text-white px-4 py-2 rounded mt-8 mx-auto">
        Log Out
      </button>
    );
  };
  
export default Footer;