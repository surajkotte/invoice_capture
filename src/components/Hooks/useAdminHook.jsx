import React, { useEffect, useState } from "react";
import {
  addDocType,
  addHeaders,
  addSystemConfig,
  getDocType,
  getFields,
  getSystems,
} from "../../adapter/admin";
const useAdminHook = () => {
  const [systems, setSystems] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [uploadConfig, setUploadConfig] = useState("");
  // { id: "1", name: "", visible: true, fieldType: "" },
  // {
  //   allowedTypes: "",
  //   maxSize: "",
  // }
  const FieldTypes = ["Number", "Boolean", "String", "Date"];
  const addSystem = async (name, domain, port) => {
    const respone = await addSystemConfig(domain, name, port);
    console.log(respone);
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
            name: info?.name,
            visible: info?.visible,
            fieldType: info?.fieldType,
          };
        });
      if (Type === "Header") {
        setHeaderData(FieldsResponse);
      } else {
        setItemData(FieldsResponse);
      }
    } else {
      alert("Eror adding header fields");
    }
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
  };

  const getDocumentType = async () => {
    const response = await getDocType();
    if (response?.messageType === "S") {
      const hasData = response?.data?.documentTypes?.length != 0;
      let allowedTypes = "";
      if (hasData) {
        allowedTypes = response?.data?.documentTypes?.join(",");
      }
      let maxSize = response?.data?.size;
      setUploadConfig({
        allowedTypes,
        maxSize,
      });
    } else {
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
    systems,
    FieldTypes,
    headerData,
    itemData,
    uploadConfig,
  };
};

export default useAdminHook;
