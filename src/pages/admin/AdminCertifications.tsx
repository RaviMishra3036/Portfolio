import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Certification } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminCertifications() {
  const { toast } = useToast();
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const blank = { name: '', issuer: '', issue_date: '', credential_url: '', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetch = async () => {
    const { data } = await supabase.from('certifications').select('*').order('display_order');
    setItems((data as Certification[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModalOpen(true); };
  const openEdit = (c: Certification) => {
    setEditing(c);
    setForm({ name: c.name, issuer: c.issuer, issue_date: c.issue_date || '', credential_url: c.credential_url || '', display_order: c.display_order });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, issue_date: form.issue_date || null, credential_url: form.credential_url || null };
    if (editing) {
      const { error } = await supabase.from('certifications').update(payload).eq('id', editing.id);
      if (error) toast('Failed to update.', 'error'); else toast('Certification updated.', 'success');
    } else {
      const { error } = await supabase.from('certifications').insert(payload);
      if (error) toast('Failed to add.', 'error'); else toast('Certification added.', 'success');
    }
    setSaving(false); setModalOpen(false); fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('certifications').delete().eq('id', deleteId);
    if (error) toast('Failed to delete.', 'error'); else toast('Certification deleted.', 'success');
    setDeleteId(null); fetch();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Certifications" description="Manage your professional certifications" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Certification</PrimaryButton>
      } />

      {items.length === 0 ? <EmptyState message="No certifications yet." /> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <div key={c.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                  <p className="text-xs text-brand-300">{c.issuer}</p>
                  {c.issue_date && <p className="text-xs text-slate-500 mt-1">{c.issue_date}</p>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Pencil className="w-4 h-4 text-slate-400" /></button>
                <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Field label="Issuer *" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
          <Field label="Issue Date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} placeholder="2024" />
          <Field label="Credential URL" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Certification" message="Are you sure you want to delete this certification?" />
    </div>
  );
}
