import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

function getStatusBadge(status) {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-success/10 text-success hover:bg-success/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-warning/10 text-warning hover:bg-warning/20"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="secondary"
          className="bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getFileTypeIcon(fileType) {
  return <FileText className="w-4 h-4 text-muted-foreground" />;
}

const DashboardList = (list_data) => {
  const [currentPage, setCurrentPage] = useState(1);
  const data = list_data?.data;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const paginatedCourses = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Invoice Documents</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Created User</TableHead>
                <TableHead>Backend System</TableHead>
                <TableHead>File Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCourses &&
                paginatedCourses?.length != 0 &&
                paginatedCourses?.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {invoice.document_id}
                    </TableCell>
                    <TableCell>{getStatusBadge("completed")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon(invoice.file_type)}
                        <span className="font-medium">{invoice.file_type}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={invoice.file_name}
                    >
                      {invoice.file_name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.created_date).toLocaleString()}
                    </TableCell>
                    <TableCell>{invoice.created_user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.system_name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.file_size}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {paginatedCourses?.length === 0 && (
        <div className="text-center py-8">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Data found</h3>
        </div>
      )}
    </Card>
  );
};

export default DashboardList;
