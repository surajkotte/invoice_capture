import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export const UploadConfigDialog = ({
  open,
  onOpenChange,
  columns,
  onColumnsChange,
}) => {
  const toggleColumn = (id) => {
    const updatedColumns = columns.map((col) =>
      col.id === id ? { ...col, isVisible: !col.isVisible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const showAll = () => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      isVisible: true,
    }));
    onColumnsChange(updatedColumns);
  };

  const hideAll = () => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      isVisible: false,
    }));
    onColumnsChange(updatedColumns);
  };

  const visibleCount = columns.filter((col) => col.isVisible).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Table Columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {visibleCount} of {columns.length} columns visible
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={showAll}>
                <Eye className="h-4 w-4 mr-1" />
                Show All
              </Button>
              <Button variant="outline" size="sm" onClick={hideAll}>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide All
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center space-x-3">
                <Checkbox
                  id={column.id}
                  checked={column.isVisible}
                  onCheckedChange={() => toggleColumn(column.id)}
                />
                <Label
                  htmlFor={column.name}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {column.name}
                </Label>
                {column.isVisible && (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => onOpenChange(false)}>Apply Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
