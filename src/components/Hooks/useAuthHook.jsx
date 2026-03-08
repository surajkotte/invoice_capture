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
    if(response?.messageType === "S"){
      const { csrfToken, ...userData } = response.data;
      if (csrfToken) {
        sessionStorage.setItem("csrfToken", csrfToken);
      }
    }
    setIsLoading(false);
    return response;
  };
  const signOut = async () => {
    try{
    setIsLoading(true);
    const respone = await Logout();

    return respone;
    }catch(err){
      console.log(err);
    }finally{
      sessionStorage.removeItem("csrfToken");
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    signup,
    signin,
    signOut,
  };
};
export default useAuthHok;
