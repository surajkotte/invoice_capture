import React, { useEffect } from "react";
import { getData, submitData } from "../../adapter/Dashboard";

const useDashboardIViewHook = () => {
  const [listData, setListData] = React.useState(null);
  const submit = async (data, backendSystem) => {
    const response = await submitData(data, backendSystem);
    if (response?.messageType === "S") {
      setListData((prev) => [response?.data, ...prev]);
      return response;
    }
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
  };
};

export default useDashboardIViewHook;
