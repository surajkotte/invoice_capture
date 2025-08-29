import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useToast } from "../Hooks/useToastHook";
import { useRef } from "react";
import DataIView from "./DashboardModal/DataIView";

const DashBoardIView = ({
  isOpen,
  onClose,
  headerFields,
  itemFields,
  filePath,
  submit,
  data,
}) => {
  const { toast } = useToast();
  const dataIViewRef = useRef();
  const handleSave = async () => {
    console.log(dataIViewRef.current);
    const invoiceData = dataIViewRef.current?.getInvoiceData();
    console.log("Submitting invoiceData:", invoiceData);
    const response = await submit(invoiceData);

    if (response?.messageType === "S") {
      dataIViewRef.current?.clearInvoiceData();
      toast({
        title: "Invoice submitted successfully",
        variant: "default",
      });
      onClose();
    } else {
      toast({
        title: response?.message || "Failed to submit invoice",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    dataIViewRef.current?.clearInvoiceData();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="p-4">
      <DialogContent className="max-w-[85%] h-full p-2">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex w-full justify-between">
            <div className="flex">
              <DialogTitle className="flex items-center justify-between">
                Validation
              </DialogTitle>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Submit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-screen bg-background w-full">
          <div className="w-full p-6 h-[calc(100vh-80px)]">
            <ResizablePanelGroup
              direction="horizontal"
              className="rounded-lg border w-full"
            >
              <ResizablePanel defaultSize={60} minSize={40}>
                {console.log(data)}
                <DataIView
                  headerFields={headerFields}
                  itemFields={itemFields}
                  data={data}
                  ref={dataIViewRef}
                  //  handleSubmit={handleSave}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={30}>
                {filePath && (
                  <iframe
                    src={`http://localhost:3000/files/${filePath}`}
                    //title={isFileUploaded?.fileName}
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashBoardIView;
