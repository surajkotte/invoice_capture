import { Trash2, Save, RefreshCcw } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full">
          <div className="space-y-2">
            <Label htmlFor={`domain-${config.id}`}>Domain</Label>
            <Input
              id={`domain-${config.id}`}
              placeholder="https://api.example.com"
              value={config.domain}
              onChange={(e) => onUpdate(config.id, { domain: e.target.value })}
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
            />
          </div>
          <div className="flex h-full items-end gap-3">
            <Button
              onClick={() => {
                handleSave(config.id);
              }}
              className="gap-2"
              variant="destructive"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleSave} className="gap-2" variant="outline">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
