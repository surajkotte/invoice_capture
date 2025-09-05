import { useEffect, useState, useCallback } from "react";
import { uploadInvoice } from "../../adapter/Login";
import { getFields, getSystems } from "../../adapter/admin";

const useDashboardHooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [headerData, setHeaderData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [systemConnections, setSystemConnections] = useState(null);
  const [backendSystem, setBackendSystem] = useState("");
  const [rawData, setRawData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState("");
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState({
    header: [],
    items: [],
    fileName: "",
    base64File: "",
    fileType: "",
    fileSize: "",
  });
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
  const normalizeResponseData = (responseData) => {
    if (responseData?.header) {
      return {
        header: responseData?.header || [],
        items: responseData?.items || [],
      };
    } else {
      const { items, ...rest } = responseData;
      return {
        header: rest,
        items: items || [],
      };
    }
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
      fetchFields();
      const response = await uploadInvoice(formData);
      if (response?.messageType == "S") {
        const normalizedData = normalizeResponseData(response?.data);
        setData({
          normalizedData,
          fileName: response?.fileName,
          base64File: response?.base64File,
          fileType: response?.fileType,
          fileSize: response?.fileSize,
        });
        // setRawData(response?.base64File);
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
    const response1 = await getFields("Header");
    const response2 = await getFields("Item");
    if (response1?.messageType === "S") {
      const HeaderResponse = response1?.data?.map((info) => {
        return {
          id: info?.id,
          name: info?.field_label,
          visible: true,
          fieldType: info?.field_type,
          fieldTechName: info?.field_name,
        };
      });
      setHeaderData(HeaderResponse);
    }
    if (response2?.messageType === "S") {
      const ItemResponse = response2?.data?.map((info) => {
        return {
          id: info?.id,
          name: info?.field_label,
          visible: true,
          fieldType: info?.field_type,
          fieldTechName: info?.field_name,
        };
      });
      setItemData(ItemResponse);
    }
  };
  // Handle header field changes
  const handleHeaderChange = useCallback((updatedHeaderData) => {
    console.log(data);
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
    const fetchSystems = async () => {
      const response = await getSystems();
      if (response?.messageType == "S") {
        setSystemConnections(response?.data);
      }
    };
    fetchSystems();
  }, []);
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
    rawData,
    systemConnections,
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
