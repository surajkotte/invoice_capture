import { useState } from "react";
import { uploadInvoice } from "../../adapter/Login";

const useDashboardHooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [backendSystem, setBackendSystem] = useState("");
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState({
    action: "",
    state: false,
  });
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.target.value = null;
    handleUpload(file);
  };
  const handleFilterChange = () => {
    onFiltersChange({
      searchTerm,
      backendSystem,
      status,
      documentType,
      user,
      dateRange,
    });
  };
  const handleUpload = async (file) => {
    setIsLoading({
      action: "Upload",
      state: true,
    });
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    try {
      const response = await uploadInvoice(formData);
      if (response?.messageType == "S") {
        setData(response?.data);
      } else {
        alert(response?.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading({
        action: "",
        state: false,
      });
    }
  };
  return {
    setBackendSystem,
    setDateRange,
    setDocumentType,
    setSearchTerm,
    setStatus,
    setUser,
    handleFilterChange,
    handleFileChange,
    data,
    isLoading,
    searchTerm,
    status,
    backendSystem,
    documentType,
    user,
    dateRange,
  };
};

export default useDashboardHooks;
