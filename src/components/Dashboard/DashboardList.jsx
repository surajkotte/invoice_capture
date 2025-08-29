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
} from "lucide-react";

const mockInvoices = [
  {
    regId: "INV-2024-001",
    status: "completed",
    fileType: "PDF",
    fileName: "invoice_2024_001.pdf",
    createdAt: "2024-01-15 10:30:00",
    createdUser: "John Doe",
    backendSystem: "SAP (System 1)",
    fileSize: "2.3 MB",
  },
  {
    regId: "INV-2024-002",
    status: "processing",
    fileType: "XML",
    fileName: "invoice_data_002.xml",
    createdAt: "2024-01-15 11:15:00",
    createdUser: "Jane Smith",
    backendSystem: "SAP (System 2)",
    fileSize: "156 KB",
  },
  {
    regId: "INV-2024-003",
    status: "failed",
    fileType: "PDF",
    fileName: "invoice_batch_003.pdf",
    createdAt: "2024-01-15 09:45:00",
    createdUser: "Mike Johnson",
    backendSystem: "Oracle ERP",
    fileSize: "4.1 MB",
  },
  {
    regId: "INV-2024-004",
    status: "pending",
    fileType: "CSV",
    fileName: "invoice_export_004.csv",
    createdAt: "2024-01-15 14:20:00",
    createdUser: "Sarah Wilson",
    backendSystem: "NetSuite",
    fileSize: "89 KB",
  },
  {
    regId: "INV-2024-005",
    status: "completed",
    fileType: "XML",
    fileName: "structured_invoice_005.xml",
    createdAt: "2024-01-14 16:30:00",
    createdUser: "John Doe",
    backendSystem: "SAP (System 1)",
    fileSize: "234 KB",
  },
];

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

const DashboardList = (data) => {
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
              {console.log(data)}
              {data?.data && data?.data != null && data?.length != 0 ? (
                data?.data?.map((invoice) => (
                  <TableRow key={invoice.regId} className="hover:bg-muted/50">
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}

              {/* {mockInvoices.map((invoice) => (
                <TableRow key={invoice.regId} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{invoice.regId}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(invoice.fileType)}
                      <span className="font-medium">{invoice.fileType}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={invoice.fileName}
                  >
                    {invoice.fileName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.createdAt}
                  </TableCell>
                  <TableCell>{invoice.createdUser}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.backendSystem}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.fileSize}
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default DashboardList;
