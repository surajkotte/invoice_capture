import React from "react";
import Header from "./Header";
import Items from "./Items";
import useDashboardHooks from "../../Hooks/useDashboardHooks";

const DataIView = ({ headerFields, itemFields, data }) => {
  const { handleHeaderChange, handleItemsChange } = useDashboardHooks();

  return (
    <div id="form-section" className="w-full h-full overflow-y-auto pr-2">
      <div className="flex flex-col space-y-6">
        <Header
          fields={headerFields}
          onChange={handleHeaderChange}
          data={data?.header || data}
        />
        <Items
          fields={itemFields}
          onChange={handleItemsChange}
          items={data?.items || data?.Items || []}
        />
      </div>
    </div>
  );
};

export default DataIView;
