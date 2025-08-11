import React, { useState } from "react";
import { Settings, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SystemConfigCard } from "./SystemConfigCard";
import { FieldManagerModal } from "./FieldManagerModal";
const Admin = () => {
  const [systemConfigs, setSystemConfigs] = useState([
    { id: "1", domain: "", systemName: "", port: "" },
  ]);
  const [headerFields, setHeaderFields] = useState([
    { id: "1", name: "", visible: true },
  ]);

  const [itemFields, setItemFields] = useState([
    { id: "1", name: "", visible: true },
  ]);
  const [headerFieldsVisible, setHeaderFieldsVisible] = useState(true);
  const [itemFieldsVisible, setItemFieldsVisible] = useState(true);

  const [fileConfig, setFileConfig] = useState({
    allowedTypes: "",
    maxSize: "",
  });

  const addSystemConfig = () => {
    const newConfig = {
      id: Date.now().toString(),
      domain: "",
      systemName: "",
      port: "",
    };
    setSystemConfigs([...systemConfigs, newConfig]);
  };
  const updateSystemConfig = (id, updates) => {
    setSystemConfigs(
      systemConfigs.map((config) =>
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const removeSystemConfig = (id) => {
    setSystemConfigs(systemConfigs.filter((config) => config.id !== id));
  };

  // Field handlers
  const addField = (type) => {
    const newField = { id: Date.now().toString(), name: "", visible: true };
    if (type === "header") {
      setHeaderFields([...headerFields, newField]);
    } else {
      setItemFields([...itemFields, newField]);
    }
  };

  const removeField = (type, id) => {
    if (type === "header") {
      setHeaderFields(headerFields.filter((field) => field.id !== id));
    } else {
      setItemFields(itemFields.filter((field) => field.id !== id));
    }
  };

  const updateField = (type, id, name) => {
    if (type === "header") {
      setHeaderFields(
        headerFields.map((field) =>
          field.id === id ? { ...field, name } : field
        )
      );
    } else {
      setItemFields(
        itemFields.map((field) =>
          field.id === id ? { ...field, name } : field
        )
      );
    }
  };

  const toggleFieldVisibility = (type) => {
    if (type === "header") {
      setHeaderFieldsVisible(!headerFieldsVisible);
    } else {
      setItemFieldsVisible(!itemFieldsVisible);
    }
  };

  const deleteAllFields = (type) => {
    if (type === "header") {
      setHeaderFields([]);
    } else {
      setItemFields([]);
    }
  };

  // Modal handlers
  const handleHeaderFieldsSave = (fields) => {
    setHeaderFields(fields);
  };

  const handleItemFieldsSave = (fields) => {
    setItemFields(fields);
  };

  const handleSave = () => {
    console.log("Saving configuration:", {
      systemConfigs,
      headerFields: headerFields.filter((field) => field.name.trim()),
      itemFields: itemFields.filter((field) => field.name.trim()),
      fileConfig,
    });
  };

  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const handleButtonClick = async () => {
    const response = await Login(
      systemDetails?.systemDomain,
      systemDetails?.port,
      "ap_processor",
      "Otvim1234!"
    );
    console.log(response);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">System Administration</h1>
                <p className="text-sm text-muted-foreground">
                  Configure system settings and field mappings
                </p>
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* System Configuration */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">System Configurations</h2>
              <p className="text-sm text-muted-foreground">
                Configure backend system connection details
              </p>
            </div>
            <Button
              onClick={addSystemConfig}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add System
            </Button>
          </div>

          <div className="space-y-4">
            {systemConfigs.map((config) => (
              <SystemConfigCard
                key={config.id}
                config={config}
                onUpdate={updateSystemConfig}
                onRemove={removeSystemConfig}
                canRemove={systemConfigs.length > 1}
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Field Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure header and item field mappings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Fields Section */}
            <Card>
              <CardHeader>
                <CardTitle>Header Fields</CardTitle>
                <CardDescription>
                  Manage header field mappings for invoice processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">Header Fields</p>
                    <p className="text-sm text-muted-foreground">
                      {headerFields.length} field
                      {headerFields.length !== 1 ? "s" : ""} configured
                    </p>
                  </div>
                  <Button
                    onClick={() => setHeaderModalOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Header
                  </Button>
                </div>
{/* 
                {headerFields.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Configured Fields:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {headerFields
                        .filter((field) => field.name.trim())
                        .map((field) => (
                          <Badge key={field.id} variant="secondary">
                            {field.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>

            {/* Item Fields Section */}
            <Card>
              <CardHeader>
                <CardTitle>Item Fields</CardTitle>
                <CardDescription>
                  Manage item field mappings for invoice processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">Item Fields</p>
                    <p className="text-sm text-muted-foreground">
                      {itemFields.length} field
                      {itemFields.length !== 1 ? "s" : ""} configured
                    </p>
                  </div>
                  <Button
                    onClick={() => setItemModalOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {/* {itemFields.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Configured Fields:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {itemFields
                        .filter((field) => field.name.trim())
                        .map((field) => (
                          <Badge key={field.id} variant="secondary">
                            {field.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* File Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>File Upload Configuration</CardTitle>
            <CardDescription>
              Configure allowed file types and size limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="allowedTypes">Allowed File Types</Label>
                <Input
                  id="allowedTypes"
                  placeholder="PDF, XML, XLSX"
                  value={fileConfig.allowedTypes}
                  onChange={(e) =>
                    setFileConfig((prev) => ({
                      ...prev,
                      allowedTypes: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple types with commas
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSize">Maximum File Size (MB)</Label>
                <Input
                  id="maxSize"
                  placeholder="10"
                  type="number"
                  value={fileConfig.maxSize}
                  onChange={(e) =>
                    setFileConfig((prev) => ({
                      ...prev,
                      maxSize: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* {fileConfig.allowedTypes && (
              <div className="space-y-2">
                <Label>File Type Preview</Label>
                <div className="flex flex-wrap gap-2">
                  {fileConfig.allowedTypes.split(",").map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type.trim().toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
          </CardContent>
        </Card>

        {/* Field Manager Modals */}
        <FieldManagerModal
          open={headerModalOpen}
          onOpenChange={setHeaderModalOpen}
          title="Header Fields Configuration"
          description="Define the header field mappings for invoice processing"
          fields={headerFields}
          onSave={handleHeaderFieldsSave}
        />

        <FieldManagerModal
          open={itemModalOpen}
          onOpenChange={setItemModalOpen}
          title="Item Fields Configuration"
          description="Define the item field mappings for invoice processing"
          fields={itemFields}
          onSave={handleItemFieldsSave}
        />
      </main>
    </div>
  );
};

export default Admin;
