
import { useState, useEffect, useMemo } from "react";
import useAnalyticsHook from "../Hooks/useAnalyticsHook";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronRight, FileText, Layers } from "lucide-react";

const CHANNEL_STYLES = {
  extraction: "bg-blue-100 text-blue-700 border-blue-200",
  prompt:     "bg-purple-100 text-purple-700 border-purple-200",
  chat:       "bg-emerald-100 text-emerald-700 border-emerald-200",
  submit:     "bg-amber-100 text-amber-700 border-amber-200",
  mail_upload : "bg-amber-100 text-amber-700 border-amber-200",
  mail_extraction : "bg-blue-100 text-blue-700 border-blue-200",
  mail_submit : "bg-amber-100 text-amber-700 border-amber-200",
};

function channelBadge(channel = "") {
  const key = channel.toLowerCase();
  const cls = CHANNEL_STYLES[key] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <Badge className={cls}>
      {channel}
    </Badge>
  );
}

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? val : d.toLocaleString();
}

function shortSession(id = "") {
  return id.slice(0, 8) + "…";
}

function groupBySession(logs) {
  const map = new Map();
  for (const log of logs) {
    const key = log.session_doc_id ?? "__no_session__";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(log);
  }
  return [...map.entries()]
    .map(([sessionId, rows]) => {
      const totalCost = rows.reduce((s, r) => { return r.channel !== "submit" && r.channel !== "MAIL_SUBMIT" && r.channel !== "MAIL_UPLOAD" ? s + Number(r.total_cost ?? 0) : s; }, 0);
      const totalInputTokens = rows.reduce((s, r) => {
        return r.channel !== "submit" && r.channel !== "MAIL_SUBMIT" && r.channel !== "MAIL_UPLOAD" ? s + Number(r.input_tokens ?? 0) : s;
      }, 0);
      const totalOutputTokens = rows.reduce((s, r) => {
        return r.channel !== "submit" && r.channel !== "MAIL_SUBMIT" && r.channel !== "MAIL_UPLOAD" ? s + Number(r.output_tokens ?? 0) : s;
      }, 0);
      const latestDate = rows.reduce((max, r) => {
        const d = new Date(r.created_date ?? r.created_at ?? 0);
        return d > max ? d : max;
      }, new Date(0));
      const docId = rows.find((r) => r.document_id)?.document_id ?? null;
      const fileName = rows[0]?.file_name ?? "—";
      const fileType = rows[0]?.file_type ?? "";
      const channels = [...new Set(rows.map((r) => r.channel).filter(Boolean))];
      return { sessionId, rows, totalCost, totalInputTokens, totalOutputTokens, latestDate, docId, fileName, fileType, channels };
    })
    .sort((a, b) => b.latestDate - a.latestDate);
}

function SessionRow({ session, isOpen, onToggle }) {
  const { sessionId, rows, totalCost, totalInputTokens, totalOutputTokens, latestDate, docId, fileName, fileType, channels } = session;

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={onToggle}
      >
        <TableCell className="w-8">
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {channels.map((ch) => (
              <span key={ch}>{channelBadge(ch)}</span>
            ))}
          </div>
        </TableCell>
        <TableCell>
          {docId ? (
            <span className="font-mono text-xs text-amber-600 font-semibold">{docId}</span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </TableCell>
        <TableCell>
          <span className="inline-flex items-center gap-1 font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
            <Layers size={11} />
            {shortSession(sessionId)}
          </span>
        </TableCell>
        <TableCell>
          <span className="inline-flex items-center gap-1 text-xs">
            <FileText size={12} className="text-muted-foreground" />
            {fileName.replace(/^\d+-/, "")}
            {fileType && <span className="text-muted-foreground ml-1">{fileType}</span>}
          </span>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(latestDate.toISOString())}
        </TableCell>
        <TableCell className="text-center">
          {/* <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {rows.length} calls
          </span> */}
          <Badge className="bg-slate-200 text-slate-700 font-semibold px-2">
            {rows.length} call{rows.length !== 1 ? "s" : ""}
          </Badge>
        </TableCell>
        <TableCell className="text-xs text-right font-mono">
          {totalInputTokens.toLocaleString()}
        </TableCell>
        <TableCell className="text-xs text-right font-mono">
          {totalOutputTokens.toLocaleString()}
        </TableCell>
        <TableCell className="text-right">
          <span className="text-emerald-600 font-semibold text-sm font-mono">
            ${totalCost.toFixed(4)}
          </span>
        </TableCell>
      </TableRow>
      {isOpen &&
        rows.map((log, i) => (
          <TableRow key={i} className="bg-muted/50">
            <TableCell>
              <div className="ml-3 w-px h-full border-l-2 border-dashed border-slate-200" />
            </TableCell>

            <TableCell>{channelBadge(log.channel)}</TableCell>

            <TableCell className="font-mono text-xs text-muted-foreground">
              {log.document_id ?? "—"}
            </TableCell>
            <TableCell className="text-xs">{log.created_user ?? "—"}</TableCell>

            <TableCell className="text-xs">
              {(log.file_name ?? "").replace(/^\d+-/, "")}
            </TableCell>

            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(log.created_date ?? log.created_at)}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{log.ai_model_name ?? log.model_name ?? "—"}</TableCell>

            <TableCell className="text-xs text-right font-mono">{Number(log.input_tokens).toLocaleString()}</TableCell>
            <TableCell className="text-xs text-right font-mono">{Number(log.output_tokens).toLocaleString()}</TableCell>

            <TableCell className="text-xs text-right font-mono text-muted-foreground">
              {log.processing_time_ms ? `${(log.processing_time_ms / 1000).toFixed(1)}s` : "—"}
            </TableCell>

            <TableCell className="text-right text-xs font-mono text-emerald-600">
              ${Number(log.total_cost).toFixed(4)}
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}

const Analytics = () => {
  const { listData, logs, isLoading } = useAnalyticsHook();
  const [logData, setLogData] = useState([]);
  const [openSessions, setOpenSessions] = useState(new Set());

  const sessions = useMemo(() => {
    const rows = logData?.data ?? [];
    return groupBySession(rows);
  }, [logData]);

  const totalCount = logData?.totalCount ?? 0;

  function toggleSession(sessionId) {
    setOpenSessions((prev) => {
      const next = new Set(prev);
      next.has(sessionId) ? next.delete(sessionId) : next.add(sessionId);
      return next;
    });
  }

  function expandAll() {
    setOpenSessions(new Set(sessions.map((s) => s.sessionId)));
  }
  function collapseAll() {
    setOpenSessions(new Set());
  }
  useEffect(() => {
    setLogData(logs);
  }, [logs, listData]);
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Invoice Documents</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} · {totalCount} total calls
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <Button
              onClick={expandAll}
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Expand all
            </Button>
            <Button
              onClick={collapseAll}
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Collapse all
            </Button>
          </div>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Channel(s)</TableHead>
                <TableHead>Reg ID</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Latest Activity</TableHead>
                <TableHead className="text-center">Calls</TableHead>
                <TableHead className="text-right">Input Tokens</TableHead>
                <TableHead className="text-right">Output Tokens</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No logs available.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <SessionRow
                    key={session.sessionId}
                    session={session}
                    isOpen={openSessions.has(session.sessionId)}
                    onToggle={() => toggleSession(session.sessionId)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default Analytics;