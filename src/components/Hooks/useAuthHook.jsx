import { useState } from "react";
import { Login, SignUp } from "../../adapter/Login";
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
  return {
    isLoading,
    signup,
    signin,
  };
};
export default useAuthHok;
