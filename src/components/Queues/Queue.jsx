import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Layers, Paperclip, MessageSquareX } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import ShowMessage from "./ShowMessage";
const Queue = () => {
  const { isLoading, queues, page, setPage } = useQueueHooks();
  const [openComponent, setOpenComponent] = useState(null);
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
  function QueueSkeletonRows({ rowCount = 5 }) {
    return Array.from({ length: rowCount }).map((_, i) => (
      <TableRow key={i}>
        <TableCell className="w-8">
          <Skeleton className="h-4 w-4 rounded-sm" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-16 rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-24 rounded" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-sm" />
            <Skeleton className="h-4 w-32" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-28" />
        </TableCell>
        <TableCell className="text-center">
          <div className="flex justify-center">
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-12" />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-12" />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-16" />
          </div>
        </TableCell>
      </TableRow>
    ));
  }
  return (
    <>
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
                  <TableHead>{t("queues.fields.created_at")}</TableHead>
                  <TableHead>{t("queues.fields.error_message")}</TableHead>
                  <TableHead>{t("queues.fields.viewattachment")}</TableHead>
                  <TableHead>{t("queues.fields.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? QueueSkeletonRows({ rowCount: 10 })
                  : queues?.data?.map((queue) => (
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

                        <TableCell>
                          {formatDateTime(queue.created_at)}
                        </TableCell>
                        <TableCell className=" text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!queue.error_log}
                            onClick={() =>
                              setOpenComponent({
                                id: queue.id,
                                task: "message",
                              })
                            }
                          >
                            <MessageSquareX className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setOpenComponent({
                                id: queue.id,
                                task: "attachment",
                              })
                            }
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
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
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
                        onClick={() => setPage(page)}
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
                      setPage((prev) => Math.min(totalPages, prev + 1))
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
      {openComponent &&
        (openComponent.task === "message" ? (
          <ShowMessage
            setOpenComponent={setOpenComponent}
            message={
              queues?.data?.find((q) => q.id === openComponent.id)?.error_log
            }
          />
        ) : (
          <div className="p-4">
            <h4 className="text-md font-semibold mb-2">Attachments</h4>
            <p>Attachment details for queue ID: {openComponent.id}</p>
          </div>
        ))}
    </>
  );
};

export default Queue;
