import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage data
    router.push("/.."); // Redirect to login page
  };

  return (
    <footer className=" text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out"
        >
          Log Out
        </button>
      </div>
    </footer>
  );
};

export default Footer;