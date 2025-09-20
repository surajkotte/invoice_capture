import { Trash2, Save, RefreshCcw, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SystemConfigCard = ({
  config,
  onUpdate,
  onRemove,
  canRemove,
  handleSave,
  handleTestConnection,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">System Details</CardTitle>
        {canRemove && (
          <Button
            onClick={() => onRemove(config.id)}
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 w-full">
          <div className="space-y-2">
            <Label htmlFor={`domain-${config.id}`}>Domain</Label>
            <Input
              id={`domain-${config.id}`}
              placeholder="https://api.example.com"
              value={config.domain}
              onChange={(e) => onUpdate(config.id, { domain: e.target.value })}
              disabled={
                isLoading?.status &&
                isLoading?.id === config?.id &&
                isLoading?.action === "test"
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`systemName-${config.id}`}>System Name</Label>
            <Input
              id={`systemName-${config.id}`}
              placeholder="SAP(SYS1)"
              value={config.systemName}
              onChange={(e) =>
                onUpdate(config.id, { systemName: e.target.value })
              }
              disabled={
                isLoading?.status &&
                isLoading?.id === config?.id &&
                isLoading?.action === "test"
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`port-${config.id}`}>Port</Label>
            <Input
              id={`port-${config.id}`}
              placeholder="8080"
              type="number"
              value={config.port}
              onChange={(e) => onUpdate(config.id, { port: e.target.value })}
              disabled={
                isLoading?.status &&
                isLoading?.id === config?.id &&
                isLoading?.action === "test"
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                id={`default-${config.id}`}
                type="checkbox"
                checked={config.is_default}
                onChange={(e) =>
                  onUpdate(config.id, { is_default: e.target.checked })
                }
                className="h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={
                  isLoading?.status &&
                  isLoading?.id === config?.id &&
                  isLoading?.action === "test"
                }
              />
              <Label htmlFor={`default-${config.id}`}>Default</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Connection Status</Label>
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  config.connectionStatus === "active"
                    ? "bg-green-500 animate-pulse"
                    : config.connectionStatus === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  config.connectionStatus === "connected"
                    ? "text-green-700"
                    : config.connectionStatus === "error"
                    ? "text-red-700"
                    : "text-gray-600"
                }`}
              >
                {config.connectionStatus === "active"
                  ? "Connected"
                  : config.connectionStatus === "error"
                  ? "Connection Failed"
                  : "Not Connected"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => handleTestConnection(config.id)}
            className="gap-2"
            variant="secondary"
            disabled={
              !config.domain ||
              !config.port ||
              (isLoading?.status && isLoading?.id === config?.id)
            }
          >
            {isLoading?.action === "test" &&
            isLoading?.status &&
            isLoading?.id === config?.id ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> checking connection
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSave(config.id)}
            className="gap-2"
            variant="default"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
