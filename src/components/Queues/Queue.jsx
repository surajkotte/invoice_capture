import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Layers, Paperclip } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { t } from "i18next";
import useQueueHooks from "../Hooks/useQueueHooks";
import { formatToUserDisplay } from "../../utils/DateParser";
const Queue = () => {
  const { isLoading, queues, page, setPage } = useQueueHooks();
  const totalPages = Math.ceil(queues?.count / 10);
  function shortSession(id = "") {
    return id.slice(0, 8) + "…";
  }
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const customDate = formatToUserDisplay(isoString);
    const localTime = new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${customDate} ${localTime}`;
  };
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Queued Documents</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  {t("queues.fields.id")}
                </TableHead>
                <TableHead>{t("queues.fields.file_name")}</TableHead>
                <TableHead>{t("queues.fields.mail_id")}</TableHead>
                <TableHead>{t("queues.fields.status")}</TableHead>
                <TableHead>{t("queues.fields.error_message")}</TableHead>
                <TableHead>{t("queues.fields.created_at")}</TableHead>
                <TableHead>{t("queues.fields.viewattachment")}</TableHead>
                <TableHead>{t("queues.fields.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues?.data?.map((queue) => (
                <TableRow key={queue.id}>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                      <Layers size={11} />
                      {shortSession(queue.id)}
                    </span>
                  </TableCell>
                  <TableCell>{queue.filename}</TableCell>
                  <TableCell>{queue.email_id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        queue.status === "PENDING_BATCH"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {t(`${queue.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{queue.error_log}</TableCell>
                  <TableCell>{formatDateTime(queue.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
                  name={t("dashboard.previous")}
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
                ),
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
                  name={t("dashboard.next")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default Queue;
