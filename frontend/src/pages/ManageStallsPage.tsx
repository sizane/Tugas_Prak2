import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { stallsApi } from '../lib/api.ts';
import { getApiErrorMessage } from '../lib/http.ts';
import { LoadingPanel } from '../components/ui.tsx';
import type { Stall } from '../types/api.ts';

const emptyForm = { name: '', category: '', location: '', description: '' };

export function ManageStallsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const canEdit = (stall: Stall) => isAdmin || stall.ownerId === user?.id;

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await stallsApi.listPaged({ page, limit: 10 });
      setStalls(res.data);
      setTotalPages(Math.max(1, Math.ceil(res.meta.total / res.meta.limit)));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (editingId) {
        await stallsApi.update(editingId, form);
        setNotice('Warung berhasil diubah.');
      } else {
        await stallsApi.create(form);
        setNotice('Warung berhasil ditambahkan.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e)); // termasuk 400 validasi, 403 bukan pemilik
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(stall: Stall) {
    if (!window.confirm(`Hapus warung "${stall.name}"?`)) return;
    setError(null);
    setNotice(null);
    try {
      await stallsApi.remove(stall.id);
      setNotice('Warung berhasil dihapus.');
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  function startEdit(stall: Stall) {
    setEditingId(stall.id);
    setForm({
      name: stall.name,
      category: stall.category ?? '',
      location: stall.location ?? '',
      description: stall.description ?? '',
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kelola Warung ({isAdmin ? 'Admin' : 'Owner'})</h1>

      {notice && <p className="rounded bg-green-50 p-3 text-green-800">{notice}</p>}
      {error && <p className="rounded bg-red-50 p-3 text-red-800">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <input required placeholder="Nama warung" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded border p-2" />
        <input placeholder="Kategori" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border p-2" />
        <input placeholder="Lokasi" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded border p-2" />
        <input placeholder="Deskripsi" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded border p-2" />
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" disabled={isSaving} className="rounded bg-primary px-4 py-2 text-white">
            {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Warung'}
          </button>
          {editingId && (
            <button type="button" className="rounded border px-4 py-2"
              onClick={() => { setEditingId(null); setForm(emptyForm); }}>Batal</button>
          )}
        </div>
      </form>

      {isLoading ? (
        <LoadingPanel message="Memuat warung..." />
      ) : stalls.length === 0 ? (
        <p className="py-10 text-center text-text-muted">Belum ada warung.</p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {stalls.map((stall) => (
            <li key={stall.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold">{stall.name}</p>
                <p className="text-sm text-text-muted">
                  {stall.category ?? '-'} · {stall.location ?? '-'} · owner #{stall.ownerId}
                </p>
              </div>
              <div className="flex gap-2">
                {canEdit(stall) && <button onClick={() => startEdit(stall)} className="rounded border px-3 py-1">Ubah</button>}
                {isAdmin && <button onClick={() => handleDelete(stall)} className="rounded border border-red-300 px-3 py-1 text-red-700">Hapus</button>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-center gap-4">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</button>
        <span>Halaman {page} dari {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya</button>
      </div>
    </div>
  );
}