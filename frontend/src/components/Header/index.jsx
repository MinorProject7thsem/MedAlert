import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";
import { useLogoutMutation } from "../../services/auth";
import { logout as logoutDispatcher } from "../../redux/reducers/auth.reducer";

const Header = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (!accessToken) {
      localStorage.clear();
    }

    const result = await logout();
    if (result?.error) {
      if(result.error?.status === 401)
      {
        // Token might be invalid or expired, clear local state
        dispatch(logoutDispatcher());
        navigate("/");
        toast.error("Session expired. Please log in again.");
        return;
      }
      toast.error(
        result?.error.data.message || "Logout failed. Please try again."
      );
    } else {
      toast.success("Logged out successfully");
      dispatch(logoutDispatcher());
      navigate("/");
    }
  };

  return (
    <>
      <div className="w-full h-12 md:my-6 text-primary bg-neutral-100 flex items-center justify-between md:rounded-full pl-4 pr-2">
        <div className="w-full py-2 flex items-center justify-between">
          <div>
            <Link to='/' className="text-3xl font-bold cursor-pointer">medalert ai</Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:underline">
              HOME
            </Link>
            <Link to="/about" className="hover:underline">
              ABOUT US
            </Link>
            <Link to="/contact" className="hover:underline">
              CONTACT US
            </Link>
          </div>

          {/* Right area: auth button + mobile hamburger */}
          <div className="hidden md:flex items-center gap-4">
            {/* Auth button (keeps same look & classes) */}
            {accessToken ? (
              <button
                onClick={handleLogout}
                className="text-primary hover:text-primary-hover font-bold mr-4 cursor-pointer transition-colors duration-300"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/auth"
                className="text-primary px-6 py-1 rounded-full font-bold hover:text-primary-hover transition-color duration-300"
              >
                LOGIN
              </Link>
            )}
          </div>
          {/* hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-full text-2xl text-[#4F6FFE] hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>
      </div>

      {/* Sliding sidebar (from right). It translates 100% to the right when closed */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-neutral-100 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-300">
          <h2 className="text-lg font-semibold text-primary">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-2xl text-primary hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex flex-col text-primary">
          <Link
            to="/"
            className="text-lg hover:bg-primary hover:text-white p-4 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="text-lg hover:bg-primary hover:text-white p-4 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            ABOUT US
          </Link>
          <Link
            to="/contact"
            className="text-lg hover:bg-primary hover:text-white p-4 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            CONTACT US
          </Link>

          {/* Auth action inside sidebar for small screens */}
          <div className="mt-4 mx-auto">
            {accessToken ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-primary hover:text-primary-hover font-semibold text-xl cursor-pointer transition-colors duration-300"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="inline-block text-white bg-primary px-4 py-1 rounded-full font-semibold"
              >
                LOGIN
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;