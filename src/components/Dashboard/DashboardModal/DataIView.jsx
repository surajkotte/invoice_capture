import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import Header from "./Header";
import Items from "./Items";
import useDashboardHooks from "../../Hooks/useDashboardHooks";

const DataIView = ({ headerFields, itemFields, data, ref }) => {
  //const { handleHeaderChange, handleItemsChange } = useDashboardHooks();
  const [invoiceData, setInvoiceData] = useState({
    headerData: [],
    itemsData: [],
    rawFile: "",
    fileName: "",
    fileType: "",
    fileSize: "",
  });

  const handleHeaderChange = useCallback((updatedHeaderData) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      headerData: updatedHeaderData,
    }));
  }, []);

  const handleItemsChange = useCallback((updatedItems) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      itemsData: updatedItems,
    }));
  }, []);
  useImperativeHandle(ref, () => ({
    getInvoiceData: () => invoiceData,
    clearInvoiceData: () =>
      setInvoiceData({
        headerData: [],
        itemsData: [],
        rawFile: "",
        fileName: "",
        fileType: "",
        fileSize: "",
      }),
  }));
  useEffect(() => {
    const Header_Data = headerFields?.reduce((acc, field) => {
      const value = data?.normalizedData?.header
        ? data?.normalizedData?.header[field.name] || ""
        : data?.normalizedData[field.name] || "";
      acc[field.fieldTechName] = value;
      return acc;
    }, {});
    const Item_Data = data?.normalizedData?.items?.map((item) => {
      let new_item = {};
      Object.keys(item).forEach((key) => {
        const field = itemFields.find((f) => f.name === key);
        if (field) {
          new_item[field.fieldTechName] = item[key] || "";
        }
      });
      return new_item;
    });

    setInvoiceData({
      headerData: Header_Data,
      itemsData: Item_Data,
      rawFile: data?.base64File || "",
      fileName: data?.fileName || "",
      fileType: data?.fileType || "",
      fileSize: data?.fileSize || "",
    });
  }, [data]);
  return (
    <div id="form-section" className="w-full h-full overflow-y-auto pr-2">
      <div className="flex flex-col space-y-6">
        <Header
          fields={headerFields}
          onChange={handleHeaderChange}
          data={invoiceData?.headerData}
        />
        <Items
          fields={itemFields}
          onChange={handleItemsChange}
          items={invoiceData?.itemsData}
        />
      </div>
    </div>
  );
};

export default DataIView;
