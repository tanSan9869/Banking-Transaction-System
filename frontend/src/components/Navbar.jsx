import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center">
      <span className="text-[1.3rem] font-bold"> 🏦 BankApp </span>
      <div className="flex items-center gap-4">
        <span className="text-[0.95rem]"> 👤 {user?.fullName} </span>
        <button
          onClick={logout}
          className="bg-white text-indigo-600 px-4 py-[0.4rem] rounded-md font-bold cursor-pointer hover:bg-gray-100 transition"
        >Logout</button>

      </div>
    </nav>
  );
};

export default Navbar;
