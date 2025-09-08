import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import UploadDataView from "./UploadDataView";
const UploadDashboard = ({
  data,
  selectedView,
  fieldsInfo,
  submit,
  handleUploadPrompt,
}) => {
  return (
    <div className="min-h-screen min-w-full bg-background w-full">
      <div className="w-full h-[calc(100vh-80px)]">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-full"
        >
          <ResizablePanel defaultSize={60} minSize={40}>
            <UploadDataView
              headerFields={fieldsInfo?.headerData}
              itemFields={fieldsInfo?.itemData}
              view={selectedView}
              data={data}
              submit={submit}
              handleUploadPrompt={handleUploadPrompt}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            {data && data?.fileName && (
              <iframe
                src={`http://localhost:3000/files/${data?.fileName}`}
                //title={isFileUploaded?.fileName}
                className="w-full h-full"
                style={{ border: "none" }}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default UploadDashboard;
