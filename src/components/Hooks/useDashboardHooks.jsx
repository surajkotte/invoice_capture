import { useState } from "react";

const useDashboardHooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [backendSystem, setBackendSystem] = useState("");
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [user, setUser] = useState("");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
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
  return {
    setBackendSystem,
    setDateRange,
    setDocumentType,
    setSearchTerm,
    setStatus,
    setUser,
    handleFilterChange,
    searchTerm,
    status,
    backendSystem,
    documentType,
    user,
    dateRange,
  };
};

export default useDashboardHooks;
