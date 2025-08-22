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
import useDashboardHooks from "../Hooks/useDashboardHooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2 } from "lucide-react";
import { useRef } from "react";
import DataIView from "./DashboardModal/DataIView";
import useDashboardIViewHook from "../Hooks/useDashBoardIViewHooks";

const DashBoardIView = ({
  isOpen,
  onClose,
  headerFields,
  itemFields,
  filePath,
  data,
}) => {
  const dataIViewRef = useRef();
  const { submit } = useDashboardIViewHook();
  const handleSave = () => {
    console.log(dataIViewRef.current);
    const invoiceData = dataIViewRef.current?.getInvoiceData();
    console.log("Submitting invoiceData:", invoiceData);
    submit(invoiceData);
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
