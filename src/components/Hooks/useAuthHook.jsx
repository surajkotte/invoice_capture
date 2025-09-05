import { useState } from "react";
import { Login, Logout, SignUp } from "../../adapter/Login";
const useAuthHok = () => {
  const [isLoading, setIsLoading] = useState(false);
  const signup = async (data) => {
    setIsLoading(true);
    const response = await SignUp(data);
    setIsLoading(false);
    return response;
  };
  const signin = async (data) => {
    setIsLoading(true);
    const response = await Login(data?.email, data.password);
    setIsLoading(false);
    return response;
  };
  const signOut = async () => {
    setIsLoading(true);
    const respone = await Logout();
    setIsLoading(false);
    return respone;
  };
  return {
    isLoading,
    signup,
    signin,
    signOut,
  };
};
export default useAuthHok;
