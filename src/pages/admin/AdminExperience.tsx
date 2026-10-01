import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Experience } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminExperience() {
  const { toast } = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const blank = { position: '', company: '', start_date: '', end_date: '', description: '', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetch = async () => {
    const { data } = await supabase.from('experience').select('*').order('display_order');
    setItems((data as Experience[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModalOpen(true); };
  const openEdit = (e: Experience) => {
    setEditing(e);
    setForm({ position: e.position, company: e.company, start_date: e.start_date || '', end_date: e.end_date || '', description: e.description || '', display_order: e.display_order });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, start_date: form.start_date || null, end_date: form.end_date || null, description: form.description || null };
    if (editing) {
      const { error } = await supabase.from('experience').update(payload).eq('id', editing.id);
      if (error) toast('Failed to update.', 'error'); else toast('Experience updated.', 'success');
    } else {
      const { error } = await supabase.from('experience').insert(payload);
      if (error) toast('Failed to add.', 'error'); else toast('Experience added.', 'success');
    }
    setSaving(false); setModalOpen(false); fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('experience').delete().eq('id', deleteId);
    if (error) toast('Failed to delete.', 'error'); else toast('Experience deleted.', 'success');
    setDeleteId(null); fetch();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Experience" description="Manage your work experience" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Experience</PrimaryButton>
      } />

      {items.length === 0 ? <EmptyState message="No experience entries yet." /> : (
        <div className="space-y-3">
          {items.map((e) => (
            <div key={e.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{e.position}</h3>
                  <p className="text-sm text-brand-300">{e.company}</p>
                  <p className="text-xs text-slate-500 mt-1">{e.start_date} — {e.end_date || 'Present'}</p>
                  {e.description && <p className="text-sm text-slate-400 mt-2 line-clamp-2">{e.description}</p>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(e)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Pencil className="w-4 h-4 text-slate-400" /></button>
                <button onClick={() => setDeleteId(e.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Position *" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
          <Field label="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Start Date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="2023" />
            <Field label="End Date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="Present" />
          </div>
          <TextArea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Experience" message="Are you sure you want to delete this entry?" />
    </div>
  );
}
