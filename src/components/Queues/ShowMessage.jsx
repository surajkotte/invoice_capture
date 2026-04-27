import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
const ShowMessage = ({ setOpenComponent, message }) => {
  return (
    <div className="w-full h-full z-150 fixed left-0 top-0 bg-black/50 flex items-center justify-center">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-md font-semibold mb-2">Error Message</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenComponent(null)}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="p-5">{message}</p>
      </Card>
    </div>
  );
};

export default ShowMessage;
