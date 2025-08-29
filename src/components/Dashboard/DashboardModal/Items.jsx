import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, Receipt } from "lucide-react";
import { ColumnConfigDialog } from "./ColumnConfigDialog";
import parseDate from "../../../utils/DateParser";

const Items = ({ items, onChange, fields }) => {
  const defaultColumns = [{ ...fields }];
  const [columns, setColumns] = useState(() => (fields ? [...fields] : []));
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  //   const visibleColumns = columns.filter((col) => col);

  const addNewItem = () => {
    const newItem = { ...fields, id: Date.now().toString() };
    onChange([...items, newItem]);
    setEditingRow(newItem.id);
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items?.map((item, index) =>
      index === id ? { ...item, [field]: value } : item
    );
    onChange(updatedItems);
  };

  const deleteItem = (id) => {
    onChange(items.filter((item) => itemindex !== id));
  };

  useEffect(() => {
    setColumns(fields ? [...fields] : []);
  }, [fields]);

  const renderCellContent = (item, column, itemindex) => {
    const isEditing = editingRow === itemindex;

    if (!isEditing) {
      const value = item[column?.fieldTechName];
      if (column.id === "ExpenseType" && value) {
        return <Badge variant="outline">{value}</Badge>;
      }
      if (column.id === "Currency" && value) {
        return <Badge variant="secondary">{value}</Badge>;
      }
      if (column.id === "AmountDocCurr" || column.id === "AmountLocalCurr") {
        return <span className="font-mono">{Number(value).toFixed(2)}</span>;
      }
      return <span>{value}</span>;
    }

    if (column.fieldType === "String") {
      return (
        <Input
          value={item[column?.fieldTechName]}
          onChange={(e) =>
            updateItem(itemindex, column.fieldTechName, e.target.value)
          }
          className="w-full"
        />
      );
    }

    if (column.fieldType === "Number") {
      return (
        <Input
          type="number"
          value={item[column?.fieldTechName]}
          onChange={(e) =>
            updateItem(
              itemindex,
              column.fieldTechName,
              parseFloat(e.target.value) || 0
            )
          }
          className="w-full"
        />
      );
    }

    if (column.fieldtype === "Date") {
      return (
        <Input
          type="date"
          value={parseDate(item[column?.fieldTechName])}
          onChange={(e) =>
            updateItem(itemindex, column.fieldTechName, e.target.value)
          }
          className="w-full"
        />
      );
    }

    if (column.type === "Dropdown") {
      return (
        <Select
          value={item[column?.fieldTechName]}
          onValueChange={(value) =>
            updateItem(itemindex, column.fieldTechName, value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(column.dropdown).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <Input
        value={item[column?.fieldTechName]}
        onChange={(e) =>
          updateItem(itemindex, column.fieldTechName, e.target.value)
        }
        className="w-full"
      />
    );
  };

  return (
    <Card>
      <CardHeader className="bg-expense-header">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Line Items ({items?.length || 0})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnConfig(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure Columns
            </Button>
            <Button onClick={addNewItem} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items && items?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No items yet</p>
            <p>Click "Add Item" to start adding items</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-expense-table-header">
                  {columns.map((column) => {
                    return (
                      <TableHead key={column.id} className=" font-medium">
                        {column.name}
                      </TableHead>
                    );
                  })}
                  <TableHead className="text-white font-medium w-20">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items &&
                  items?.length != 0 &&
                  items?.map((item, itemindex) => (
                    <TableRow
                      key={itemindex}
                      className="hover:bg-expense-row-hover transition-colors"
                    >
                      {columns.map((column, index) => (
                        <TableCell
                          key={`column-${column.id}-${index}`}
                          className="p-3"
                        >
                          {renderCellContent(item, column, itemindex)}
                        </TableCell>
                      ))}
                      <TableCell className="p-3">
                        <div className="flex gap-1">
                          {editingRow === itemindex ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRow(null)}
                            >
                              Done
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRow(itemindex)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteItem(itemindex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <ColumnConfigDialog
        open={showColumnConfig}
        onOpenChange={setShowColumnConfig}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </Card>
  );
};

export default Items;
