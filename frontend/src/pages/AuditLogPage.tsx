import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  ScrollText,
  X,
} from 'lucide-react';
import { auditApi } from '../lib/api.ts';
import { getApiErrorMessage } from '../lib/http.ts';
import type {
  AuditLog,
  AuditLogFilters,
  AuditLogPagination,
} from '../types/api.ts';

/* ------------------------------------------------------------------ helpers */

const actionLabels: Record<string, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE_MENU: 'Tambah menu',
  UPDATE_MENU: 'Ubah menu',
  DELETE_MENU: 'Hapus menu',
  CREATE_STALL: 'Tambah warung',
  UPDATE_STALL: 'Ubah warung',
  DELETE_STALL: 'Hapus warung',
  CREATE_REVIEW: 'Tambah review',
  UPDATE_REVIEW: 'Ubah review',
  DELETE_REVIEW: 'Hapus review',
};

const targetLabels: Record<string, string> = {
  USERS: 'Pengguna',
  STALLS: 'Warung',
  MENU_ITEMS: 'Menu',
  REVIEWS: 'Review',
  FLAGS: 'Flag',
};

function actionLabel(action: string): string {
  return actionLabels[action] ?? action;
}

function targetLabel(table: string): string {
  return targetLabels[table] ?? table;
}

type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

function actionTone(action: string): BadgeTone {
  if (action === 'LOGIN') return 'primary';
  if (action === 'LOGOUT') return 'neutral';
  if (action.startsWith('CREATE_')) return 'success';
  if (action.startsWith('UPDATE_')) return 'warning';
  if (action.startsWith('DELETE_')) return 'danger';
  return 'neutral';
}

const toneClass: Record<BadgeTone, string> = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-700',
};

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatMetadata(metadata: unknown): string {
  if (metadata === null || metadata === undefined) return 'Tidak ada metadata.';
  if (typeof metadata === 'string') return metadata;
  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return String(metadata);
  }
}

function describeMetadata(metadata: unknown): string {
  if (typeof metadata !== 'object' || metadata === null) return '-';
  const m = metadata as Record<string, unknown>;
  if (typeof m.role === 'string') return `Role: ${m.role}`;
  if (typeof m.ip_address === 'string') return m.ip_address;
  if (typeof m.result === 'string') return m.result;
  if (typeof m.name === 'string') return m.name;
  const after = m.after as Record<string, unknown> | undefined;
  if (after && typeof after.name === 'string') return after.name;
  return 'Lihat detail';
}

/* ------------------------------------------------ Detail Modal Component */
function DetailModal({
  log,
  onClose,
}: {
  log: AuditLog | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!log) {
      setDetail(null);
      return;
    }
    setLoading(true);
    setError('');
    auditApi
      .getById(log.id)
      .then(setDetail)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [log]);

  if (!log) return null;

  const d = detail ?? log;
  const meta =
    d.metadata && typeof d.metadata === 'object'
      ? (d.metadata as Record<string, unknown>)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Detail Audit #{d.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {loading && (
            <p className="text-center text-sm text-gray-500">
              Memuat detail...
            </p>
          )}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && (
            <dl className="space-y-3 text-sm">
              <Row label="ID" value={String(d.id)} />
              <Row label="Aksi" value={actionLabel(d.action)} />
              <Row
                label="Target"
                value={`${targetLabel(d.targetTable)} #${d.targetId ?? '-'}`}
              />
              <Row label="User" value={d.userName ?? '-'} />
              <Row label="Email" value={d.userEmail ?? '-'} />
              <Row label="User ID" value={String(d.userId ?? '-')} />
              <Row label="Waktu" value={formatDate(d.createdAt)} />

              {meta?.ip_address ? (
                <Row
                  label="IP Address"
                  value={String(meta.ip_address)}
                />
              ) : null}
              {meta?.user_agent ? (
                <Row
                  label="User Agent"
                  value={String(meta.user_agent)}
                />
              ) : null}
              {meta?.result ? (
                <Row label="Result" value={String(meta.result)} />
              ) : null}

              <div>
                <dt className="font-semibold text-gray-500">Metadata</dt>
                <dd className="mt-1 overflow-x-auto rounded-lg bg-gray-50 p-3">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700">
                    {formatMetadata(d.metadata)}
                  </pre>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 font-semibold text-gray-500">{label}</dt>
      <dd className="text-gray-800 break-all">{value}</dd>
    </div>
  );
}

/* ======================================================= Main Page */

export function AuditLogPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<AuditLogPagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  /* -- filter state -- */
  const [filterAction, setFilterAction] = useState('');
  const [filterTarget, setFilterTarget] = useState('');
  const [filterTargetId, setFilterTargetId] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters: AuditLogFilters = { page, pageSize: 20 };
      if (filterAction) filters.action = filterAction;
      if (filterTarget) filters.targetTable = filterTarget;
      if (filterTargetId && Number(filterTargetId) > 0)
        filters.targetId = Number(filterTargetId);
      if (filterUserId && Number(filterUserId) > 0)
        filters.userId = Number(filterUserId);
      if (filterFrom) filters.from = filterFrom;
      if (filterTo) filters.to = filterTo;

      const result = await auditApi.list(filters);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page, filterAction, filterTarget, filterTargetId, filterUserId, filterFrom, filterTo]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  function handleReset() {
    setFilterAction('');
    setFilterTarget('');
    setFilterTargetId('');
    setFilterUserId('');
    setFilterFrom('');
    setFilterTo('');
    setPage(1);
  }

  const actionOptions = [
    { value: '', label: 'Semua Aksi' },
    ...Object.entries(actionLabels).map(([v, l]) => ({ value: v, label: l })),
  ];
  const targetOptions = [
    { value: '', label: 'Semua Target' },
    ...Object.entries(targetLabels).map(([v, l]) => ({ value: v, label: l })),
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Admin
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">Riwayat Audit</h1>
        <p className="mt-1 text-sm text-text-muted">
          Jejak aktivitas login, logout, dan perubahan data. Catatan audit tidak
          dapat diubah atau dihapus dari aplikasi.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="mb-4 rounded-xl border border-border bg-white p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Filter className="size-4" />
          Filter
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            {actionOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            {targetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            placeholder="Target ID"
            value={filterTargetId}
            onChange={(e) => setFilterTargetId(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />

          <input
            type="number"
            min={1}
            placeholder="User ID"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Dari"
          />

          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Sampai"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Terapkan Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-muted hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="ml-3 text-sm text-text-muted">
              Memuat data audit...
            </span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <ScrollText className="mb-2 size-8" />
            <p className="text-sm">Tidak ada catatan audit ditemukan.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Ringkasan</th>
                <th className="px-4 py-3 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClass[actionTone(item.action)]}`}
                    >
                      {actionLabel(item.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {targetLabel(item.targetTable)}{' '}
                    <span className="text-gray-400">#{item.targetId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium">
                      {item.userName ?? '-'}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {item.userEmail ?? ''}
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-gray-500">
                    {describeMetadata(item.metadata)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(item)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                    >
                      <Eye className="size-3.5" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-gray-500">
              Halaman {pagination.page} dari {pagination.totalPages} &middot;{' '}
              {pagination.total} catatan
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex size-8 items-center justify-center rounded-lg border text-sm disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex size-8 items-center justify-center rounded-lg border text-sm disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
