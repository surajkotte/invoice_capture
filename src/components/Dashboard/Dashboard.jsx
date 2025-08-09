import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";
import { CalendarIcon, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useDashboardHooks from "../Hooks/useDashboardHooks";
import DashboardList from "./DashboardList";
const Dashboard = () => {
  const {
    setBackendSystem,
    setDateRange,
    setDocumentType,
    setSearchTerm,
    setStatus,
    setUser,
    handleFilterChange,
    searchTerm,
    status,
    backendSystem,
    documentType,
    user,
    dateRange,
  } = useDashboardHooks();
  return (
    <div className="w-full h-full bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Invoice Management</h1>
                <p className="text-sm text-muted-foreground">
                  Upload, manage and track invoice documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* <UploadDialog> */}
              <Select value={backendSystem} onValueChange={setBackendSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Backend System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sap-sys1">SAP (System 1)</SelectItem>
                  <SelectItem value="sap-sys2">SAP (System 2)</SelectItem>
                  <SelectItem value="oracle">Oracle ERP</SelectItem>
                  <SelectItem value="netsuite">NetSuite</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Invoices
              </Button>
            </div>
          </div>
        </div>
      </header>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10"
            />
          </div>

          {/* Status */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Document Type */}
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xml">XML</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          {/* User */}
          <Select value={user} onValueChange={setUser}>
            <SelectTrigger>
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john.doe">John Doe</SelectItem>
              <SelectItem value="jane.smith">Jane Smith</SelectItem>
              <SelectItem value="mike.johnson">Mike Johnson</SelectItem>
              <SelectItem value="sarah.wilson">Sarah Wilson</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} -{" "}
                      {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleFilterChange} className="ml-auto">
            Apply Filters
          </Button>
        </div>
      </Card>
      <DashboardList />
    </div>
  );
};

export default Dashboard;
