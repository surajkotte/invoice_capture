import React, { useEffect, useState } from "react";
import { getData, submitData } from "../../adapter/Dashboard";

const useDashboardIViewHook = () => {
  const [listData, setListData] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const submit = async (data, backendSystem) => {
    setIsSubmitLoading(true);
    const response = await submitData(data, backendSystem);
    if (response?.messageType === "S") {
      setListData((prev) => [response?.data, ...prev]);
      return response;
    }
    setIsSubmitLoading(false);
  };
  const fetchData = async () => {
    const response = await getData();
    if (response?.messageType === "S") {
      setListData(response?.data || []);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return {
    submit,
    listData,
    isSubmitLoading,
  };
};

export default useDashboardIViewHook;
