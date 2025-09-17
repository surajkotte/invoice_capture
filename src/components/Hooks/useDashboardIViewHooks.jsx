import React, { useEffect, useState } from "react";
import { getData, submitData } from "../../adapter/Dashboard";

const useDashboardIViewHook = () => {
  const [listData, setListData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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
    const response = await getData(currentPage);
    if (response?.messageType === "S") {
      setListData({
        data: response?.data?.data || [],
        totalCount: response?.data?.totalCount || 0,
      });
      // setListData(response?.data?.data || []);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  return {
    submit,
    setCurrentPage,
    currentPage,
    listData,
    isSubmitLoading,
  };
};

export default useDashboardIViewHook;
