import { useEffect, useState } from "react";
import {
  addDocType,
  addHeaders,
  addSystemConfig,
  getDocType,
  getFields,
  getSystems,
  testConnection,
  delete_systemconfig,
} from "../../adapter/admin";

const useAdminHook = () => {
  const [systems, setSystems] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [uploadConfig, setUploadConfig] = useState("");
  const [isLoading, setIsLoading] = useState({
    action: "",
    status: false,
    id: "",
  });

  const FieldTypes = ["Number", "Boolean", "String", "Date"];

  const addSystem = async (name, domain, port, is_default, id) => {
    return await addSystemConfig(domain, name, port, id, is_default);
  };

  const AddFields = async (Fields, Type) => {
    const response = await addHeaders(Fields, Type);

    if (response?.messageType === "S") {
      const FieldsResponse =
        response?.data?.Fields?.map((info) => ({
          id: info?.id,
          name: info?.name || info?.field_label,
          visible: info?.visible ?? true,
          fieldTechName: info?.fieldTechName || info?.Field_name,
          fieldType: info?.fieldType || info?.field_type,
          translations: info?.translations || [],
        })) || [];

      if (Type === "Header") {
        setHeaderData(FieldsResponse);
      } else {
        setItemData(FieldsResponse);
      }
    }
    return response;
  };

  const getSystem = async () => {
    setIsLoading({ action: "get_system", status: true, id: "" });
    const response = await getSystems();
    if (response?.messageType === "S") {
      setSystems(response?.data || []);
    } else {
      setSystems([]);
    }
    setIsLoading({ action: "", status: false, id: "" });
  };

  const fetchFields = async () => {
    const response1 = await getFields("Header");
    const response2 = await getFields("Item");

    if (response1?.messageType === "S") {
      const HeaderResponse =
        response1?.data?.map((info) => ({
          id: info?.id,
          name: info?.field_label || info?.name,
          visible: true,
          fieldType: info?.field_type || info?.fieldType,
          fieldTechName: info?.field_name || info?.fieldTechName,
          translations: info?.translations || [],
        })) || [];
      setHeaderData(HeaderResponse);
    }

    if (response2?.messageType === "S") {
      const ItemResponse =
        response2?.data?.map((info) => ({
          id: info?.id,
          name: info?.field_label || info?.name,
          visible: true,
          fieldType: info?.field_type || info?.fieldType,
          fieldTechName: info?.field_name || info?.fieldTechName,
          translations: info?.translations || [], 
        })) || [];
      setItemData(ItemResponse);
    }
  };

  const addDocumentType = async (documents, size) => {
    let formattedDocumentTypes = [];
    if (documents) {
      formattedDocumentTypes = documents.split(",").map((d) => d.trim());
    }
    return await addDocType(formattedDocumentTypes, size);
  };

  const getDocumentType = async () => {
    const response = await getDocType();
    if (response?.messageType === "S" && response?.data?.length > 0) {
      const data = response.data[0];
      setUploadConfig({
        allowedTypes: data?.mimetypes || "",
        maxSize: data?.size || "",
      });
    }
  };

  const handleTestConnection = async (id) => {
    try {
      setIsLoading({ action: "test", status: true, id: id });
      const response = await testConnection(id);
      if (response?.messageType === "S") {
        setSystems((prev) =>
          prev.map((sys) =>
            sys.id === response?.data?.id
              ? { ...sys, connectionStatus: response?.data?.connectionStatus }
              : sys,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading({ action: "", status: false, id: "" });
    }
  };

  const delete_system = async (id) => {
    try {
      setIsLoading({ action: "delete", status: true, id: id }); 
      const response = await delete_systemconfig(id);
      return response;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading({ action: "", status: false, id: "" });
    }
  };

  useEffect(() => {
    getSystem();
    fetchFields();
    getDocumentType();
  }, []);

  return {
    addSystem,
    AddFields,
    addDocumentType,
    handleTestConnection,
    delete_system,
    isLoading,
    systems,
    FieldTypes,
    headerData,
    itemData,
    uploadConfig,
  };
};

export default useAdminHook;
