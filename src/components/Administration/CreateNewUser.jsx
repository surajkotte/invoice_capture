import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Mail, Shield } from "lucide-react";
import { useToast } from "../Hooks/useToastHook";
import { create_new } from "../../adapter/Administration";

const CreateNewUser = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email_address: "",
  });

  const [permissions, setPermissions] = useState({
    dashboard: false,
    configuration: false,
    upload: false,
    prompt: false,
    chat: false,
    analytics: false,
    usermanagement: false,
  });

  const handlePermissionChange = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetForm = () => {
    setFormData({ username: "", email_address: "" });
    setPermissions({
      dashboard: false,
      configuration: false,
      upload: false,
      prompt: false,
      chat: false,
      analytics: false,
      usermanagement: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email_address) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please provide both a name and an email address.",
      });
      return;
    }

    setIsLoading(true);

    const formattedPermissions = {
      dashboard: permissions.dashboard ? "X" : null,
      configuration: permissions.configuration ? "X" : null,
      upload: permissions.upload ? "X" : null,
      prompt: permissions.prompt ? "X" : null,
      chat: permissions.chat ? "X" : null,
      analytics: permissions.analytics ? "X" : null,
      usermanagement: permissions.usermanagement ? "X" : null,
    };

    const payload = {
      username: formData.username,
      email_address: formData.email_address,
      permissions: formattedPermissions,
    };

    try {
      // 🚨 Replace this with your actual API call
      const response = await create_new(
        payload?.username,
        payload?.email_address,
        payload?.permissions,
      );
      if (response?.messageType === "S") {
        toast({
          title: "User Created Successfully",
          description: "An email with setup instructions has been sent.",
          variant: "default",
        });
        resetForm();
        onSuccess(); // Trigger a refresh of the table in the parent component
        onClose(); // Close the modal
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create user",
          description: response?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const permissionList = [
    { id: "dashboard", label: "Dashboard Access" },
    { id: "configuration", label: "Configuration & Admin" },
    { id: "upload", label: "Upload Invoices" },
    { id: "prompt", label: "Prompt Engineering" },
    { id: "chat", label: "Chat Capabilities" },
    { id: "analytics", label: "View Analytics" },
    { id: "usermanagement", label: "User Management" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user and configure their module authorizations.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-user-form"
          onSubmit={handleSubmit}
          className="space-y-6 py-4"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Full Name</Label>
                <Input
                  id="username"
                  placeholder="Jane Doe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email_address: e.target.value,
                      })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2 border-b pb-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Module Authorizations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border">
              {permissionList.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={perm.id}
                    checked={permissions[perm.id]}
                    onCheckedChange={() => handlePermissionChange(perm.id)}
                  />
                  <Label
                    htmlFor={perm.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {perm.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-user-form" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create & Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewUser;
