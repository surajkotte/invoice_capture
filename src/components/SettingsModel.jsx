import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setUserSettings } from "../adapter/Dashboard";
import { useToast } from "./Hooks/useToastHook";
import i18n from "../i18n";
import {
  language_mapper,
  date_format_mapping,
  currency_format_mapping,
} from "../utils/Mapper";
const SettingsModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    language: "English",
    dateformat: "DD/MM/YYYY",
    currency: "USD ($)",
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    console.log(field, value);
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const response = await setUserSettings(config);
    if (response?.messageType === "S") {
      i18n.changeLanguage(config.language);
      toast({ title: "Settings saved successfully", variant: "default" });
    } else {
      toast({
        title: response?.message || "Failed to save settings",
        variant: "destructive",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Application Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select
              value={config.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full p-2 rounded-md border border-input bg-background text-sm"
            >
              {Object.entries(language_mapper).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Format</label>
            <select
              value={config.dateformat}
              onChange={(e) => handleChange("dateformat", e.target.value)}
              className="w-full p-2 rounded-md border border-input bg-background text-sm"
            >
              {Object.entries(date_format_mapping).map(([code, format]) => (
                <option key={code} value={code}>
                  {format}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency Format</label>
            <select
              value={config.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="w-full p-2 rounded-md border border-input bg-background text-sm"
            >
              {Object.entries(currency_format_mapping).map(([code, format]) => (
                <option key={code} value={code}>
                  {format}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-muted/50 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
