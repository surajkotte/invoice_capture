import React, { useRef, useState } from "react";
import { FileText, Upload, CloudUpload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const FileUpload = ({ onFileChange, isLoading }) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  return (
    <Card
      className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer
           `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%234f46e5' fill-opacity='0.4'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}
        />
      </div>
      <div className="relative z-10 p-12 text-center">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <CloudUpload className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <h3 className="text-2xl font-bold">Upload Your Invoice</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Drag and drop your invoice files here, or click to browse. We
            support PDF, XML, TXT, and DOCX formats.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isLoading?.action === "Upload" && isLoading?.state}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            {isLoading?.action === "Upload" && isLoading?.state ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Upoading
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Choose Files
              </>
            )}
          </Button>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>XML</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>TXT</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>DOCX</span>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.xml,.txt,.docx"
          className="hidden"
          multiple
          onChange={onFileChange}
        />
      </div>
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-20">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <CloudUpload className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">Drop files here</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FileUpload;
