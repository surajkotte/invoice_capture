import { useEffect, useState, useCallback } from "react";
import { uploadInvoice } from "../../adapter/Login";
import { getFields } from "../../adapter/admin";

const useDashboardHooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [headerData, setHeaderData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [backendSystem, setBackendSystem] = useState("");
  const [dialogOpen, setDialogOpen] = useState("");
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
        setFilePath(response?.fileName);
        setDialogOpen(response?.data);
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
  const fetchFields = async () => {
    const response = await getFields();
    if (response?.messageType === "S") {
      const HeaderResponse =
        response?.data?.HeaderFields &&
        response?.data?.HeaderFields?.Fields?.length != 0 &&
        response?.data?.HeaderFields?.Fields?.map((info) => {
          return {
            id: info?.id,
            name: info?.name,
            visible: info?.visible,
            fieldType: info?.fieldType,
          };
        });
      setHeaderData(HeaderResponse);
      const ItemResponse =
        response?.data?.ItemFields &&
        response?.data?.ItemFields?.Fields?.length != 0 &&
        response?.data?.ItemFields?.Fields?.map((info) => {
          return {
            id: info?.id,
            name: info?.name,
            visible: info?.visible,
            fieldType: info?.fieldType,
          };
        });
      setItemData(ItemResponse);
    } else {
      console.log(response);
    }
  };
  // Handle header field changes
  const handleHeaderChange = useCallback((updatedHeaderData) => {
    console.log(updatedHeaderData);
    setData((prevData) => ({
      ...prevData,
      header: updatedHeaderData,
    }));
  }, []);

  // Handle item field changes
  const handleItemsChange = useCallback((updatedItems) => {
    setData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  }, []);

  // Handle individual item change
  const handleSingleItemChange = useCallback((itemIndex, updatedItem) => {
    setData((prevData) => ({
      ...prevData,
      items:
        prevData.items?.map((item, index) =>
          index === itemIndex ? updatedItem : item
        ) || [],
    }));
  }, []);

  const handleSubmit = () => {
    console.log(data);
  };
  useEffect(() => {
    if (dialogOpen) {
      fetchFields();
    }
  }, [dialogOpen]);
  return {
    setBackendSystem,
    setDateRange,
    setDocumentType,
    setSearchTerm,
    setStatus,
    setUser,
    handleFilterChange,
    handleFileChange,
    setDialogOpen,
    setData,
    handleHeaderChange,
    handleItemsChange,
    handleSubmit,
    filePath,
    data,
    isLoading,
    searchTerm,
    status,
    backendSystem,
    documentType,
    user,
    dateRange,
    dialogOpen,
    headerData,
    itemData,
  };
};

export default useDashboardHooks;
