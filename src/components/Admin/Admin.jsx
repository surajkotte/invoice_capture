import React, { useEffect, useState } from "react";
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
import { useToast } from "../Hooks/useToastHook";
import { SystemConfigCard } from "./SystemConfigCard";
import { FieldManagerModal } from "./FieldManagerModal";
import useAdminHook from "../Hooks/useAdminHook";
import { useTranslation } from "react-i18next";
const Admin = () => {
  const { t, i18n } = useTranslation();
  const {
    addSystem,
    AddFields,
    addDocumentType,
    handleTestConnection,
    delete_system,
    systems,
    FieldTypes,
    headerData,
    itemData,
    uploadConfig,
    isLoading,
  } = useAdminHook();
  // const [systemConfigs, setSystemConfigs] = useState([
  //   { id: "1", domain: "", systemName: "", port: "" },
  // ]);

  const [systemConfigs, setSystemConfigs] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);

  const [itemFields, setItemFields] = useState(itemData);
  const [headerFieldsVisible, setHeaderFieldsVisible] = useState(true);
  const [itemFieldsVisible, setItemFieldsVisible] = useState(true);

  const [fileConfig, setFileConfig] = useState({
    allowedTypes: "",
    maxSize: "",
  });
  const { toast } = useToast();
  const handleDocTypeSave = async () => {
    if (!fileConfig?.allowedTypes && !fileConfig?.maxSize) {
      toast({
        title: "Error",
        description: "Please provide allowed file types or max size",
        variant: "destructive",
      });
    } else {
      const response = await addDocumentType(
        fileConfig?.allowedTypes,
        fileConfig?.maxSize,
      );
      if (response?.messageType === "S") {
        toast({
          title: "Success",
          description: "Document type configuration saved successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Error saving document type configuration",
          variant: "destructive",
        });
      }
    }
  };
  const addSystemConfig = () => {
    const newConfig = {
      id: "new" + Date.now().toString(),
      domain: "",
      systemName: "",
      port: "",
      is_default: false,
      connectionStatus: "error",
    };
    setSystemConfigs([...systemConfigs, newConfig]);
  };
  const updateSystemConfig = (id, updates) => {
    setSystemConfigs((prev) =>
      prev.map((config) => {
        if (updates.is_default) {
          if (config.id === id) {
            return { ...config, ...updates };
          }
          return { ...config, is_default: false };
        }
        return config.id === id ? { ...config, ...updates } : config;
      }),
    );
  };

  const removeSystemConfig = async (id) => {
    const response = await delete_system(id);
    if (response?.messageType == "S") {
      toast({
        title: "Success",
        description: "System config removed successfully",
        variant: "success",
      });
      setSystemConfigs(systemConfigs.filter((config) => config.id !== id));
    } else {
      toast({
        title: "Error",
        description:
          "Unable to delete System config, Please contact system administrator",
        variant: "Error",
      });
    }
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
          field.id === id ? { ...field, name } : field,
        ),
      );
    } else {
      setItemFields(
        itemFields.map((field) =>
          field.id === id ? { ...field, name } : field,
        ),
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
  const handleHeaderFieldsSave = async (Fields) => {
    const response = await AddFields(Fields, "Header");
    if (response?.messageType === "S") {
      toast({
        title: "Success",
        description: `Header fields added successfully`,
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: `Error adding Header fields`,
        variant: "destructive",
      });
    }
  };

  const handleItemFieldsSave = async (Fields) => {
    const response = await AddFields(Fields, "Item");
    if (response?.messageType === "S") {
      toast({
        title: "Success",
        description: `Item fields added successfully`,
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: `Error adding Item fields`,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (id) => {
    const system_Info =
      systemConfigs?.length != 0 &&
      systemConfigs.find((info) => info?.id === id);
    const response = await addSystem(
      system_Info?.systemName,
      system_Info?.domain,
      system_Info?.port,
      system_Info?.is_default,
      system_Info?.id || "",
    );
    if (response?.messageType === "S") {
      toast({
        title: "Success",
        description: "System configuration saved successfully",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Error saving system configuration",
        variant: "destructive",
      });
    }
  };

  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  useEffect(() => {
    const temp = systems?.map((info) => {
      return {
        id: info?.id,
        domain: info?.system_domain,
        systemName: info?.system_name,
        port: info?.system_port,
        is_default: info?.is_default,
        connectionStatus: info?.connectionStatus,
      };
    });
    setSystemConfigs(temp);
  }, [systems]);

  useEffect(() => {
    if (headerData && headerData?.length != 0) {
      setHeaderFields(headerData);
    }
  }, [headerData]);
  useEffect(() => {
    if (itemData && itemData?.length != 0) {
      setItemFields(itemData);
    }
  }, [itemData]);

  useEffect(() => {
    setFileConfig({
      allowedTypes: uploadConfig?.allowedTypes,
      maxSize: uploadConfig?.maxSize,
    });
  }, [uploadConfig]);

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
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* System Configuration */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {t("admin.system_configuration.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("admin.system_configuration.description")}
              </p>
            </div>
            <Button
              onClick={addSystemConfig}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("admin.system_configuration.add_system")}
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading.action === "get_system" && isLoading.status ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-blue-500">Loading systems...</span>
              </div>
            ) : systemConfigs.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                No system configurations found.
              </div>
            ) : (
              systemConfigs.map((config) => (
                <SystemConfigCard
                  key={config.id}
                  config={config}
                  onUpdate={updateSystemConfig}
                  onRemove={removeSystemConfig}
                  canRemove={systemConfigs.length > 1}
                  handleSave={handleSave}
                  handleTestConnection={handleTestConnection}
                  isLoading={isLoading}
                />
              ))
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">
              {t("admin.field_configuration.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("admin.field_configuration.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Fields Section */}
            <Card>
              <CardHeader>
                <CardTitle>Header Fields</CardTitle>
                <CardDescription>
                  {t("admin.field_configuration.hedaer_field_description")}
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
                  {t("admin.field_configuration.item_field_description")}
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
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>
                  {t("admin.file_upload_configuration.title")}
                </CardTitle>
                <CardDescription>
                  {t("admin.file_upload_configuration.description")}
                </CardDescription>
              </div>
              <div className="flex">
                <Button onClick={handleDocTypeSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="allowedTypes">{t("admin.file_upload_configuration.alloed_file_types")}</Label>
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
                <Label htmlFor="maxSize">{t("admin.file_upload_configuration.file_size_limit")}</Label>
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
          fieldTypes={FieldTypes}
          onSave={handleHeaderFieldsSave}
        />

        <FieldManagerModal
          open={itemModalOpen}
          onOpenChange={setItemModalOpen}
          title="Item Fields Configuration"
          description="Define the item field mappings for invoice processing"
          fields={itemFields}
          fieldTypes={FieldTypes}
          onSave={handleItemFieldsSave}
        />
      </main>
    </div>
  );
};

export default Admin;
