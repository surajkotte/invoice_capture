import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FieldManagerPopover = ({
  children,
  onAddField,
  onDeleteField,
  onToggleVisibility,
  isVisible = true,
  canDelete = true,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <Button
            onClick={onAddField}
            size="sm"
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>

          {onToggleVisibility && (
            <>
              <Separator />
              <Button
                onClick={onToggleVisibility}
                size="sm"
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                {isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Fields
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Fields
                  </>
                )}
              </Button>
            </>
          )}

          {onDeleteField && canDelete && (
            <>
              <Separator />
              <Button
                onClick={onDeleteField}
                size="sm"
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete All Fields
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
