import { Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FieldManagerPopover } from "./FieldManagerPopover";

export const FieldConfigCard = ({
  title,
  description,
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  onToggleVisibility,
  onDeleteAllFields,
  fieldsVisible,
}) => {
  const visibleFields = fields.filter((field) => field.visible);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <FieldManagerPopover
            onAddField={onAddField}
            onToggleVisibility={onToggleVisibility}
            onDeleteField={fields.length > 0 ? onDeleteAllFields : undefined}
            isVisible={fieldsVisible}
            canDelete={fields.length > 0}
          >
            <Button size="sm" variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Manage Fields
            </Button>
          </FieldManagerPopover>
        </div>
      </CardHeader>
      {fieldsVisible && (
        <CardContent className="space-y-4">
          {visibleFields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No fields configured. Click "Manage Fields" to add some.
            </p>
          ) : (
            visibleFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={`Field ${index + 1}`}
                    value={field.name}
                    onChange={(e) => onUpdateField(field.id, e.target.value)}
                  />
                </div>
                {visibleFields.length > 1 && (
                  <Button
                    onClick={() => onRemoveField(field.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      )}
    </Card>
  );
};
