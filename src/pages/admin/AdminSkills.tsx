import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminSkills() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const blank = { name: '', category: '', proficiency: 80, icon: 'Code', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('display_order');
    setSkills((data as Skill[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModalOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, icon: s.icon, display_order: s.display_order });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from('skills').update(payload).eq('id', editing.id);
      if (error) toast('Failed to update skill.', 'error');
      else toast('Skill updated.', 'success');
    } else {
      const { error } = await supabase.from('skills').insert(payload);
      if (error) toast('Failed to add skill.', 'error');
      else toast('Skill added.', 'success');
    }
    setSaving(false);
    setModalOpen(false);
    fetchSkills();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('skills').delete().eq('id', deleteId);
    if (error) toast('Failed to delete skill.', 'error');
    else toast('Skill deleted.', 'success');
    setDeleteId(null);
    fetchSkills();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Skills" description="Manage your technical skills" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Skill</PrimaryButton>
      } />

      {skills.length === 0 ? (
        <EmptyState message="No skills yet. Click 'Add Skill' to create one." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.category}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full" style={{ width: `${s.proficiency}%` }} />
                </div>
                <span className="text-xs text-slate-400 font-mono">{s.proficiency}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Skill Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Field label="Category *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="Backend, Frontend, Database" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Proficiency: {form.proficiency}%</label>
              <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full accent-brand-500" />
            </div>
            <Field label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          </div>
          <Field label="Icon (lucide-react name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Code, Server, Database" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Skill" message="Are you sure you want to delete this skill?" />
    </div>
  );
}
