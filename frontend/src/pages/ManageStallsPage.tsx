import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Plus, Store, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { stallsApi } from '../lib/api.ts';
import { getApiErrorMessage } from '../lib/http.ts';
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  LoadingPanel,
  PageHeader,
  Spinner,
  inputClass,
  textareaClass,
} from '../components/ui.tsx';
import type { Stall, StallInput } from '../types/api.ts';

const PAGE_SIZE = 10;
const emptyForm = { name: '', category: '', location: '', description: '' };

// Untuk 403 tampilkan pesan dari backend (mis. "Anda bukan pemilik warung ini").
function actionError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 403) {
    const message = error.response.data?.message;
    if (typeof message === 'string' && message.trim() !== '') return `Akses ditolak: ${message}`;
  }
  return getApiErrorMessage(error);
}

export function ManageStallsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<Stall | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await stallsApi.listPaged({ page, limit: PAGE_SIZE });
      setStalls(result.data);
      setTotalPages(Math.max(1, Math.ceil(result.meta.total / result.meta.limit)));
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  function startEdit(stall: Stall) {
    setNotice(null);
    setFormError(null);
    setEditingId(stall.id);
    setForm({
      name: stall.name,
      category: stall.category ?? '',
      location: stall.location ?? '',
      description: stall.description ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setNotice(null);

    const name = form.name.trim();
    const category = form.category.trim();
    const location = form.location.trim();
    const description = form.description.trim();

    try {
      if (editingId !== null) {
        // Saat ubah, kirim semua field agar isian bisa dikosongkan.
        await stallsApi.update(editingId, { name, category, location, description });
        setNotice('Warung berhasil diubah.');
      } else {
        // Saat tambah, kirim hanya field yang terisi.
        const payload: StallInput = { name };
        if (category) payload.category = category;
        if (location) payload.location = location;
        if (description) payload.description = description;
        await stallsApi.create(payload);
        setNotice('Warung berhasil ditambahkan.');
      }
      resetForm();
      await load();
    } catch (error) {
      setFormError(actionError(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await stallsApi.remove(toDelete.id);
      setToDelete(null);
      setNotice('Warung berhasil dihapus.');
      if (stalls.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (error) {
      setDeleteError(actionError(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={isAdmin ? 'Admin' : 'Pemilik Warung'}
        title="Kelola Warung"
        description={
          isAdmin
            ? 'Admin dapat menambah, mengubah, dan menghapus semua warung.'
            : 'Kamu dapat menambah warung dan mengubah warung milik sendiri. Penghapusan hanya untuk admin.'
        }
      />

      {notice ? (
        <div className="mb-4">
          <Alert tone="success">{notice}</Alert>
        </div>
      ) : null}

      <Card className="mb-8 p-5">
        <h2 className="mb-4 text-lg font-bold">
          {editingId !== null ? 'Ubah Warung' : 'Tambah Warung'}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama warung" htmlFor="stall-name" hint="Minimal 3 karakter.">
            <input
              id="stall-name"
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Kategori" htmlFor="stall-category">
            <input
              id="stall-category"
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Field>
          <Field label="Lokasi" htmlFor="stall-location">
            <input
              id="stall-location"
              className={inputClass}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Deskripsi" htmlFor="stall-description">
            <textarea
              id="stall-description"
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          {formError ? (
            <div className="sm:col-span-2">
              <Alert tone="error">{formError}</Alert>
            </div>
          ) : null}

          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Spinner /> : <Plus className="size-4" aria-hidden="true" />}
              {editingId !== null ? 'Simpan perubahan' : 'Tambah warung'}
            </Button>
            {editingId !== null ? (
              <Button variant="secondary" onClick={resetForm} disabled={isSaving}>
                Batal
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {isLoading ? (
        <LoadingPanel message="Memuat daftar warung..." />
      ) : loadError ? (
        <Card className="p-5">
          <Alert tone="error">{loadError}</Alert>
          <Button variant="secondary" className="mt-4" onClick={() => void load()}>
            Coba lagi
          </Button>
        </Card>
      ) : stalls.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Belum ada warung"
          message="Tambahkan warung pertama lewat formulir di atas."
        />
      ) : (
        <Card className="divide-y divide-border">
          {stalls.map((stall) => {
            const isMine = stall.ownerId === user?.id;
            return (
              <div
                key={stall.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/stalls/${stall.id}`} className="font-bold hover:text-primary">
                      {stall.name}
                    </Link>
                    {isMine ? <Badge tone="primary">Milik saya</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-text-muted">
                    {stall.category ?? '-'} &middot; {stall.location ?? '-'} &middot; pemilik #
                    {stall.ownerId}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {/* Tombol ubah tampil untuk semua; backend menolak (403) bila bukan pemilik. */}
                  <Button variant="secondary" onClick={() => startEdit(stall)}>
                    <Pencil className="size-4" aria-hidden="true" />
                    Ubah
                  </Button>
                  {isAdmin ? (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setDeleteError(null);
                        setToDelete(stall);
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Hapus
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Sebelumnya
        </Button>
        <span className="text-text-muted">
          Halaman {page} dari {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Berikutnya
        </Button>
      </div>

      {toDelete ? (
        <ConfirmDialog
          title="Hapus warung"
          message={`Warung "${toDelete.name}" akan dihapus permanen. Lanjutkan?`}
          error={deleteError}
          isBusy={isDeleting}
          onClose={() => setToDelete(null)}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
    </div>
  );
}
