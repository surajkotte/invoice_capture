import { useState, useEffect, useCallback } from "react";
import UploadHeader from "./UploadHeader";
import UploadItems from "./UploadItems";
import { UploadPrompts } from "./UploadPrompts";
import { useToast } from "../Hooks/useToastHook";
const UploadDataView = ({ headerFields, itemFields, view, data, submit }) => {
  const [invoiceData, setInvoiceData] = useState({
    headerData: [],
    itemsData: [],
    rawFile: "",
    fileName: "",
    fileType: "",
    fileSize: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await submit(invoiceData);
      if (response?.messageType === "S") {
        toast({
          title: "Invoice submitted successfully",
          variant: "default",
        });
        setInvoiceData({
          headerData: [],
          itemsData: [],
          rawFile: "",
          fileName: "",
          fileType: "",
          fileSize: "",
        });
      } else {
        toast({
          title: response?.message || "Failed to submit invoice",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error?.message || "Failed to submit invoice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = async () => {
    setInvoiceData({
      headerData: [],
      itemsData: [],
      rawFile: "",
      fileName: "",
      fileType: "",
      fileSize: "",
    });
  };
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
        const field = itemFields?.find((f) => f.name === key);
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
      <div className="flex flex-col space-y-6 h-full">
        {view === "validation" ? (
          <>
            <UploadHeader
              fields={headerFields}
              onChange={handleHeaderChange}
              data={invoiceData?.headerData}
              handleSubmit={handleSubmit}
              handleClear={handleClear}
              isLoading={isLoading}
            />
            <UploadItems
              fields={itemFields}
              onChange={handleItemsChange}
              items={invoiceData?.itemsData}
            />
          </>
        ) : (
          <UploadPrompts />
        )}
      </div>
    </div>
  );
};

export default UploadDataView;
