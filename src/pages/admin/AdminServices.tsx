import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminServices() {
  const { toast } = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const blank = { title: '', description: '', icon: 'Wrench', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetch = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order');
    setItems((data as Service[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModalOpen(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon: s.icon, display_order: s.display_order });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('services').update(form).eq('id', editing.id);
      if (error) toast('Failed to update.', 'error'); else toast('Service updated.', 'success');
    } else {
      const { error } = await supabase.from('services').insert(form);
      if (error) toast('Failed to add.', 'error'); else toast('Service added.', 'success');
    }
    setSaving(false); setModalOpen(false); fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('services').delete().eq('id', deleteId);
    if (error) toast('Failed to delete.', 'error'); else toast('Service deleted.', 'success');
    setDeleteId(null); fetch();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Services" description="Manage your service offerings" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Service</PrimaryButton>
      } />

      {items.length === 0 ? <EmptyState message="No services yet." /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Pencil className="w-4 h-4 text-slate-400" /></button>
                  <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3">{s.description}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <TextArea label="Description *" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Field label="Icon (lucide-react name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Server, Globe, Cloud" />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Service" message="Are you sure you want to delete this service?" />
    </div>
  );
}
