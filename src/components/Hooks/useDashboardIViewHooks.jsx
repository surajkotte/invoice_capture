import React from "react";

const useDashboardIViewHook = () => {
  const submit = (data) => {
    console.log(data);
  };
  return {
    submit,
  };
};

export default useDashboardIViewHook;
