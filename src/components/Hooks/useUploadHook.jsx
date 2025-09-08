import { useState, useEffect } from "react";
import { uploadInvoice } from "../../adapter/Login";
import { getFields, getSystems } from "../../adapter/admin";
import { submitData } from "../../adapter/Dashboard";

const useUploadHook = () => {
  const [isLoading, setIsLoading] = useState({
    action: "",
    state: false,
  });
  const [backendSystem, setBackendSystem] = useState("");
  const [systemConnections, setSystemConnections] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fieldsData, setFieldsData] = useState({
    headerData: [],
    itemData: [],
  });
  const [data, setData] = useState({
    header: [],
    items: [],
    fileName: "",
    base64File: "",
    fileType: "",
    fileSize: "",
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.target.value = null;
    handleUpload(file);
  };
  const normalizeResponseData = (responseData) => {
    if (responseData?.header) {
      return {
        header: responseData?.header || [],
        items: responseData?.items || [],
      };
    } else if (responseData?.header_fields) {
      const { header_fields, item_fields } = responseData;
      return {
        header: header_fields,
        items: item_fields || [],
      };
    } else {
      const { items, ...rest } = responseData;
      return {
        header: rest,
        items: items || [],
      };
    }
  };
  const submit = async (data) => {
    setIsLoading({
      action: "Submit",
      state: true,
    });
    const response = await submitData(data, backendSystem);
    if (response?.messageType === "S") {
      setUploadStatus("");
      return response;
    }
    setIsLoading({
      action: "",
      state: false,
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

        setUploadStatus("uploaded");
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
    const [response1, response2] = await Promise.all([
      getFields("Header"),
      getFields("Item"),
    ]);
    if (response1?.messageType === "S" && response2?.messageType === "S") {
      setFieldsData({
        headerData: response1.data.map((info) => ({
          id: info.id,
          name: info.field_label,
          visible: true,
          fieldType: info.field_type,
          fieldTechName: info.field_name,
        })),
        itemData: response2.data.map((info) => ({
          id: info.id,
          name: info.field_label,
          visible: true,
          fieldType: info.field_type,
          fieldTechName: info.field_name,
        })),
      });
    }
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
    data,
    isLoading,
    uploadStatus,
    fieldsData,
    systemConnections,
    backendSystem,
    submit,
    setBackendSystem,
    setUploadStatus,
    handleUpload,
    handleFileChange,
  };
};

export default useUploadHook;
