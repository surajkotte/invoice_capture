import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X, Languages, ArrowLeft } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FieldManagerModal = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSave,
  fieldTypes,
}) => {
  const [localFields, setLocalFields] = useState([]);
  
  const [editingTranslationsFor, setEditingTranslationsFor] = useState(null);

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      name: "",
      visible: true,
      fieldType: "",
      fieldTechName: "",
      translations: [],
    };
    setLocalFields([...localFields, newField]);
  };

  const removeField = (id) => {
    setLocalFields(localFields.filter((field) => field.id !== id));
  };

  const updateField = (id, value, fieldType) => {
    setLocalFields(
      localFields.map((field) =>
        field.id === id ? { ...field, [fieldType]: value } : field,
      ),
    );
  };

  const updateTranslation = (fieldId, index, key, value) => {
    setLocalFields(
      localFields.map((field) => {
        if (field.id === fieldId) {
          const newTranslations = [...field.translations];
          newTranslations[index] = { ...newTranslations[index], [key]: value };
          return { ...field, translations: newTranslations };
        }
        return field;
      }),
    );
  };

  const addTranslation = (fieldId) => {
    setLocalFields(
      localFields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            translations: [
              ...(field.translations || []),
              { language: "", label: "" },
            ],
          };
        }
        return field;
      }),
    );
  };

  const removeTranslation = (fieldId, indexToRemove) => {
    setLocalFields(
      localFields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            translations: field.translations.filter(
              (_, idx) => idx !== indexToRemove,
            ),
          };
        }
        return field;
      }),
    );
  };

  const handleSave = () => {
    onSave(localFields.filter((field) => field.name.trim()));
    onOpenChange(false);
    setEditingTranslationsFor(null); 
  };

  const handleCancel = () => {
    setLocalFields(fields);
    onOpenChange(false);
    setEditingTranslationsFor(null); 
  };

  useEffect(() => {
    const initializedFields = fields?.map((f) => ({
      ...f,
      translations: f.translations || [],
    }));
    setLocalFields(initializedFields || []);
  }, [fields]);

  const activeField = localFields.find((f) => f.id === editingTranslationsFor);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[900px]">
        
        {!editingTranslationsFor ? (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Field Configuration</Label>
                <Button onClick={addField} size="sm" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Field
                </Button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {localFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No fields configured.</p>
                  </div>
                ) : (
                  localFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-muted-foreground">Field {index + 1}</Label>
                        <div className="flex flex-row gap-2">
                          <Input
                            placeholder="Enter field name"
                            value={field.name}
                            onChange={(e) => updateField(field.id, e.target.value, "name")}
                          />
                          <Select
                            value={field.fieldType}
                            onValueChange={(e) => updateField(field.id, e, "fieldType")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Field Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes?.map((info, idx) => (
                                <SelectItem key={idx} value={info}>{info}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Enter technical name"
                            value={field.fieldTechName}
                            onChange={(e) => updateField(field.id, e.target.value, "fieldTechName")}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-5">
                        <Button
                          onClick={() => setEditingTranslationsFor(field.id)} 
                          size="icon"
                          variant={field.translations?.length > 0 ? "default" : "secondary"}
                          title="Manage Translations"
                        >
                          <Languages className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => removeField(field.id)}
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save Fields
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setEditingTranslationsFor(null)} 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 -ml-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Translations for "{activeField?.name || 'Unnamed Field'}"</DialogTitle>
                  <DialogDescription>
                    Configure multiple languages for this specific field.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4 min-h-[40vh]">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Configured Languages</Label>
                <Button 
                  onClick={() => addTranslation(activeField.id)} 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Language
                </Button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {activeField?.translations?.length === 0 ? (
                   <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                     <Languages className="h-8 w-8 mx-auto mb-2 opacity-50" />
                     <p>No translations configured.</p>
                     <p className="text-xs mt-1">Click "Add Language" to get started.</p>
                   </div>
                ) : (
                  activeField?.translations?.map((trans, tIndex) => (
                    <div key={tIndex} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                      <Select
                        value={trans.language}
                        onValueChange={(val) => updateTranslation(activeField.id, tIndex, "language", val)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (EN)</SelectItem>
                          <SelectItem value="de">German (DE)</SelectItem>
                          <SelectItem value="fr">French (FR)</SelectItem>
                          <SelectItem value="es">Spanish (ES)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Type translated label here..."
                        value={trans.label}
                        onChange={(e) => updateTranslation(activeField.id, tIndex, "label", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeTranslation(activeField.id, tIndex)}
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setEditingTranslationsFor(null)} className="gap-2">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};