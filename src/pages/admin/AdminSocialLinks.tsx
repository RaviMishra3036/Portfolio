import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Link2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SocialLink } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

const platforms = [
  { value: 'GitHub', label: 'GitHub', icon: 'Github' },
  { value: 'LinkedIn', label: 'LinkedIn', icon: 'Linkedin' },
  { value: 'Instagram', label: 'Instagram', icon: 'Instagram' },
  { value: 'YouTube', label: 'YouTube', icon: 'Youtube' },
  { value: 'Twitter', label: 'Twitter / X', icon: 'Twitter' },
  { value: 'Email', label: 'Email', icon: 'Mail' },
  { value: 'Facebook', label: 'Facebook', icon: 'Facebook' },
  { value: 'Website', label: 'Website', icon: 'Globe' },
];

export default function AdminSocialLinks() {
  const { toast } = useToast();
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const blank = { platform: 'GitHub', url: '', icon: 'Github', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetch = async () => {
    const { data } = await supabase.from('social_links').select('*').order('display_order');
    setItems((data as SocialLink[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModalOpen(true); };
  const openEdit = (s: SocialLink) => {
    setEditing(s);
    setForm({ platform: s.platform, url: s.url, icon: s.icon, display_order: s.display_order });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('social_links').update(form).eq('id', editing.id);
      if (error) toast('Failed to update.', 'error'); else toast('Social link updated.', 'success');
    } else {
      const { error } = await supabase.from('social_links').insert(form);
      if (error) toast('Failed to add.', 'error'); else toast('Social link added.', 'success');
    }
    setSaving(false); setModalOpen(false); fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('social_links').delete().eq('id', deleteId);
    if (error) toast('Failed to delete.', 'error'); else toast('Social link deleted.', 'success');
    setDeleteId(null); fetch();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Social Links" description="Manage your social media links" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Link</PrimaryButton>
      } />

      {items.length === 0 ? <EmptyState message="No social links yet." /> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{s.platform}</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[200px]">{s.url}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Pencil className="w-4 h-4 text-slate-400" /></button>
                <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Social Link' : 'Add Social Link'}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform *</label>
            <select
              value={form.platform}
              onChange={(e) => {
                const platform = platforms.find((p) => p.value === e.target.value);
                setForm({ ...form, platform: e.target.value, icon: platform?.icon || 'Globe' });
              }}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
            >
              {platforms.map((p) => <option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>)}
            </select>
          </div>
          <Field label="URL *" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://..." />
          <Field label="Icon (lucide-react name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}</PrimaryButton>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Social Link" message="Are you sure you want to delete this link?" />
    </div>
  );
}
