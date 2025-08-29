import React, { useEffect, useState } from "react";
import {
  addDocType,
  addHeaders,
  addSystemConfig,
  getDocType,
  getFields,
  getSystems,
  testConnection,
} from "../../adapter/admin";
import { te } from "react-day-picker/locale";

const useAdminHook = () => {
  const [systems, setSystems] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [uploadConfig, setUploadConfig] = useState("");
  const FieldTypes = ["Number", "Boolean", "String", "Date"];
  const addSystem = async (name, domain, port) => {
    const respone = await addSystemConfig(domain, name, port);
    return respone;
  };
  const AddFields = async (Fields, Type) => {
    const response = await addHeaders(Fields, Type);
    if (response?.messageType === "S") {
      const FieldsResponse =
        response?.data?.Fields &&
        response?.data?.Fields?.length != 0 &&
        response?.data?.Fields?.map((info) => {
          return {
            id: info?.id,
            name: info?.field_label,
            visible: info?.visible,
            fieldTechName: info?.name,
            fieldType: info?.fieldType,
          };
        });
      if (Type === "Header") {
        setHeaderData(FieldsResponse);
      } else {
        setItemData(FieldsResponse);
      }
    }
    return response;
  };
  const getSystem = async () => {
    const respone = await getSystems();
    if (respone?.messageType == "S") {
      setSystems(respone?.data);
    } else {
      setSystems([]);
    }
  };
  const fetchFields = async () => {
    const response1 = await getFields("Header");
    const response2 = await getFields("Item");
    if (response1?.messageType === "S") {
      console.log(response1);
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

  const addDocumentType = async (documents, size) => {
    let formattedDocumentTypes = [];
    if (documents) {
      formattedDocumentTypes = documents.split(",").toString().split(",");
      console.log(formattedDocumentTypes);
    }
    const response = await addDocType(formattedDocumentTypes, size);
    if (response?.messageType === "S") {
    } else {
    }
    return response;
  };

  const getDocumentType = async () => {
    const response = await getDocType();
    if (response?.messageType === "S") {
      const hasData = response?.data[0]?.mimetypes;
      let allowedTypes = "";
      if (hasData) {
        allowedTypes = response?.data[0]?.mimetypes?.split(",");
      }
      let maxSize = response?.data[0]?.size;
      setUploadConfig({
        allowedTypes,
        maxSize,
      });
    } else {
    }
  };

  const SystemConnectionCheck = async (domain, port) => {
    try {
      const response = await testConnection(domain, port);
      return response;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSystem();
    fetchFields();
    getDocumentType();
    testConnection("mu2r3d53.otxlab.net", "44300");
  }, []);
  return {
    addSystem,
    AddFields,
    addDocumentType,
    SystemConnectionCheck,
    systems,
    FieldTypes,
    headerData,
    itemData,
    uploadConfig,
  };
};

export default useAdminHook;
