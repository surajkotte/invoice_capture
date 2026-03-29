import { useState, useEffect } from "react";
import { uploadInvoice } from "../../adapter/Login";
import { getFields, getSystems } from "../../adapter/admin";
import { submitData, uploadInvoicePrompt } from "../../adapter/Dashboard";

const useUploadHook = () => {
  const [isLoading, setIsLoading] = useState({
    action: "",
    state: false,
  });
  const [sceTemplate, setSceTemplate] = useState({});
  const [backendSystem, setBackendSystem] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
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
    log_data: "",
  });
  const handleFileChange = async(event) => {
    const file = event.target.files[0];
    event.target.value = null;
    setSelectedFile(file);
    const response = await handleUpload(file);
    return response;
  };
  const normalizeResponseData = (responseData) => {
    return {
      header: responseData?.headerData || {},
      items: responseData?.itemsData || [],
    };
  };
  // const normalizeResponseData = (responseData) => {
  //   if (responseData?.header) {
  //     return {
  //       header: responseData?.header || [],
  //       items: responseData?.items || [],
  //     };
  //   } else if (responseData?.header_fields) {
  //     const { header_fields, item_fields } = responseData;
  //     return {
  //       header: header_fields,
  //       items: item_fields || [],
  //     };
  //   } else {
  //     const { items, ...rest } = responseData;
  //     return {
  //       header: rest,
  //       items: items || [],
  //     };
  //   }
  // };
  const submit = async (data) => {
    setIsLoading({
      action: "Submit",
      state: true,
    });
    const response = await submitData(data, backendSystem, sceTemplate);
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
    setIsLoading({ action: "Upload", state: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      // NOTE: We completely removed fetchFields() here!
      const response = await uploadInvoice(formData);
      
      if (response?.messageType == "S") {
        const normalizedData = normalizeResponseData(response?.data);
        
        // 1. Immediately set the Translated UI Fields from the backend response
        if (response?.uiFields) {
          setFieldsData({
            headerData: response.uiFields.headerFields,
            itemData: response.uiFields.itemFields
          });
        }

        // 2. Set the Extracted Data
        setData({
          normalizedData,
          fileName: response?.fileName,
          base64File: response?.base64Files,
          fileType: response?.fileType,
          fileSize: response?.fileSize,
          log_data: response?.log_data,
        });
        
        setUploadStatus("uploaded");
        return response;
      } else {
        return response;
      }
    } catch (error) {
      return { messageType: "E", message: error.message };
    } finally {
      setIsLoading({ action: "", state: false });
    }
  };
  // const handleUpload = async (file) => {
  //   setIsLoading({
  //     action: "Upload",
  //     state: true,
  //   });
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     fetchFields();
  //     const response = await uploadInvoice(formData);
  //     if (response?.messageType == "S") {
  //       const normalizedData = normalizeResponseData(response?.data);
  //       setData({
  //         normalizedData,
  //         fileName: response?.fileName,
  //         base64File: response?.base64Files,
  //         fileType: response?.fileType,
  //         fileSize: response?.fileSize,
  //         log_data: response?.log_data,
  //       });
  //       setUploadStatus("uploaded");
  //       return response;
  //     } else {
  //       return response;
  //     }
  //   } catch (error) {
  //     return { messageType: "E", message: error.message };
  //   } finally {
  //     setIsLoading({
  //       action: "",
  //       state: false,
  //     });
  //   }
  // };
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
  const handleUploadPrompt = async (promptMessage) => {
    setIsLoading({
      action: "Prompt",
      state: true,
    });
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("filename", data?.fileName);
    formData.append("prompt", promptMessage);
    formData.append("session_id", data?.log_data?.session_doc_id);
    formData.append("base64file", data?.base64File);
    try {
      fetchFields();
      const response = await uploadInvoicePrompt({
        filename: data?.fileName,
        prompt: promptMessage,
        session_id: data?.log_data?.session_doc_id,
        base64file: data?.base64File,
      });
      if (response?.messageType == "S") {
        const normalizedData = normalizeResponseData(response?.data);
        setData({
          normalizedData,
          fileName: response?.fileName,
          base64File: response?.base64File,
          fileType: response?.fileType,
          fileSize: data?.fileSize,
          log_data: data?.log_data,
        });
        setUploadStatus("uploaded");
        return response;
      } else {
        alert(response?.message);
        return response;
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
    sceTemplate,
    setSceTemplate,
    handleUploadPrompt,
    submit,
    setBackendSystem,
    setUploadStatus,
    handleUpload,
    handleFileChange,
  };
};

export default useUploadHook;
