import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutDispatcher } from "../../../redux/reducers/auth.reducer";
import toast from "react-hot-toast";

const ProfileSetting = ({ user, healthData, setOpen }) => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

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
    <div className="grid grid-cols-2 lg:grid-cols-1">
      <div className="py-4 md:py-0 md:px-4 md:pt-4 flex items-start md:gap-4 gap-2 lg:hidden">
        <div className="min-w-9 min-h-9 md:w-16 md:h-16 rounded-full bg-purple-100 flex items-center justify-center text-sm md:text-2xl font-bold text-[#8451C1] shadow">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h2 className="text-sm md:text-xl font-semibold text-gray-800">
            {user?.name || "User"}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs md:text-sm text-gray-500">
            Age {healthData?.age}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <div>
          <h4 className="font-medium text-neutral-500 text-sm md:text-md">
            Account settings
          </h4>
          <div>
            <button type="button" onClick={() => navigate("/signup/profile?mode=edit")} className="text-[11px] md:text-xs font-medium text-primary hover:text-primary-hover hover:underline transform duration-300 cursor-pointer">
              Edit profile
            </button>
          </div>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="text-[11px] md:text-xs font-medium text-primary hover:text-primary-hover hover:underline transform duration-300 cursor-pointer"
            >
              Change password
            </button>
          </div>
          {!healthData && (
            <div>
              <button
                onClick={() => navigate("/signup/profile?mode=newUser")}
                className="text-[11px] md:text-xs font-medium text-primary hover:text-primary-hover hover:underline transform duration-300 cursor-pointer"
              >
                Create health profile
              </button>
            </div>
          )}
          <div>
            <button onClick={handleLogout} className="text-[11px] md:text-xs font-medium text-primary hover:text-primary-hover hover:underline transform duration-300 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
