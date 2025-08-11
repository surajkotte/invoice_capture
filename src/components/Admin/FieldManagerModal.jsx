import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FieldManagerModal = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSave,
}) => {
  const [localFields, setLocalFields] = useState(fields);

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      name: "",
      visible: true,
    };
    setLocalFields([...localFields, newField]);
  };

  const removeField = (id) => {
    setLocalFields(localFields.filter((field) => field.id !== id));
  };

  const updateField = (id, name) => {
    setLocalFields(
      localFields.map((field) => (field.id === id ? { ...field, name } : field))
    );
  };

  const handleSave = () => {
    onSave(localFields.filter((field) => field.name.trim()));
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalFields(fields); // Reset to original fields
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Field Configuration</Label>
            <Button
              onClick={addField}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {localFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fields configured.</p>
                <p className="text-sm">
                  Click "Add Field" to create your first field.
                </p>
              </div>
            ) : (
              localFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`field-${field.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Field {index + 1}
                    </Label>
                    <Input
                      id={`field-${field.id}`}
                      placeholder="Enter field name"
                      value={field.name}
                      onChange={(e) => updateField(field.id, e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => removeField(field.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={handleCancel} variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Fields
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
