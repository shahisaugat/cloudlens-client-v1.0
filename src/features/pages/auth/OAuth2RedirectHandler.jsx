import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../../../store/slices/authSlice";
import { useGetMeQuery } from "../../../store/api/authApi";

const OAuth2RedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query param
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  // Skip query if no token
  const { data: userData, isSuccess, isError } = useGetMeQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (token && isSuccess && userData) {
      dispatch(
        setCredentials({
          user: {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            avatarUrl: userData.avatarUrl,
          },
          accessToken: token,
        })
      );
      navigate("/dashboard");
    } else if (isError || (!token && !userData)) {
      navigate("/login");
    }
  }, [token, isSuccess, userData, isError, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFCFF]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0061AA] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
