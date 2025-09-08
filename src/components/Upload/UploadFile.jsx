import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUploadHook from "../Hooks/useUploadHook";
import FileUpload from "./FileUpload";
import UploadDashboard from "./UploadDashboard";

const UploadFile = () => {
  const [activeView, setActiveView] = useState("validation");
  const {
    isLoading,
    handleFileChange,
    uploadStatus,
    data,
    fieldsData,
    systemConnections,
    backendSystem,
    handleUploadPrompt,
    submit,
    setBackendSystem,
  } = useUploadHook();

  return (
    <div className="h-full w-full space-y-6">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  Invoice Extractor
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={backendSystem}
                onValueChange={setBackendSystem}
                disable={isLoading?.state}
                className="bg-foreground"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Backend System" />
                </SelectTrigger>
                <SelectContent>
                  {systemConnections?.map((info) => {
                    return (
                      <SelectItem value={info}>{info?.system_name}</SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                variant={
                  uploadStatus && activeView === "validation"
                    ? "default"
                    : "ghost"
                }
                size="sm"
                disabled={!uploadStatus}
                onClick={() => setActiveView("validation")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Validation
              </Button>
              <Button
                variant={activeView === "prompts" ? "default" : "ghost"}
                size="sm"
                disabled={!uploadStatus}
                onClick={() => setActiveView("prompts")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Prompts
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="w-full">
          {!uploadStatus ? (
            <FileUpload onFileChange={handleFileChange} isLoading={isLoading} />
          ) : (
            <UploadDashboard
              data={data}
              submit={submit}
              selectedView={activeView}
              fieldsInfo={fieldsData}
              handleUploadPrompt={handleUploadPrompt}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
