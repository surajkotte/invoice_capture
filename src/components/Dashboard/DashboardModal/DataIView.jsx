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
      }),
  }));
  useEffect(() => {
    setInvoiceData({
      headerData: data?.header || data,
      itemsData: data?.items || data?.Items || [],
    });
    console.log(data);
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
