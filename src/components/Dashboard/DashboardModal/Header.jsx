import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import parseDate from "../../../utils/DateParser";

const Header = ({ data, onChange, fields }) => {
  const updateField = (fieldName, value) => {
    const updatedData = { ...data, [fieldName]: value };
    onChange(updatedData);
  };
  return (
    <Card className="shadow-md border border-muted h-full">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
          <User className="h-5 w-5" />
          Header
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields?.map((field) => (
            <div
              key={field.id}
              className={
                field?.fieldType !== "TextArea"
                  ? "flex flex-col gap-1.5"
                  : "flex flex-col gap-1.5 lg:col-span-3"
              }
            >
              <Label htmlFor={field.id}>
                {field.name}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.fieldType === "Dropdown" ? (
                <Select
                  value={data[field.fieldTechName] || ""}
                  onValueChange={(value) =>
                    updateField(field.fieldTechName, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${field.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(field.dropdown).map((option, index) => (
                      <SelectItem key={`${option}${index}`} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.fieldType === "Date" ? (
                <Input
                  type="date"
                  value={parseDate(data[field.fieldTechName])}
                  onChange={(e) =>
                    updateField(field.fieldTechName, e.target.value)
                  }
                  className="w-full"
                />
              ) : field.fieldType === "String" ? (
                <Input
                  id={field.id}
                  value={data[field.fieldTechName]}
                  onChange={(e) =>
                    updateField(field.fieldTechName, e.target.value)
                  }
                  placeholder={`Enter ${field.name}`}
                />
              ) : field.fieldType === "Number" ? (
                <Input
                  id={field.id}
                  value={data[field.fieldTechName]}
                  onChange={(e) =>
                    updateField(field.fieldTechName, e.target.value)
                  }
                  placeholder={`Enter ${field.name}`}
                />
              ) : (
                <Textarea
                  id={field.id}
                  value={data[field.fieldTechName]}
                  onChange={(e) =>
                    updateField(field.fieldTechName, e.target.value)
                  }
                  placeholder={`Enter additional ${field.name}`}
                  className="min-h-[100px]"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
