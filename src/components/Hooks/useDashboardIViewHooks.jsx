import React from "react";
import { submitData } from "../../adapter/Dashboard";

const useDashboardIViewHook = () => {
  const submit = async (data) => {
    const response = await submitData({data});
    console.log(response)
  };
  return {
    submit,
  };
};

export default useDashboardIViewHook;
