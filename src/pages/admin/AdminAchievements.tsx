import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Achievement } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminAchievements() {
  const { toast } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const blank = { title: '', description: '', date: '', display_order: 0 };
  const [form, setForm] = useState(blank);

  const fetchAchievements = useCallback(async () => {
    const { data, error } = await supabase.from('achievements').select('*').order('display_order');
    if (error) toast('Failed to load achievements.', 'error');
    setItems((data as Achievement[]) || []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { void fetchAchievements(); }, [fetchAchievements]);

  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModalOpen(true);
  };

  const openEdit = (achievement: Achievement) => {
    setEditing(achievement);
    setForm({
      title: achievement.title,
      description: achievement.description || '',
      date: achievement.date || '',
      display_order: achievement.display_order,
    });
    setModalOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      description: form.description || null,
      date: form.date || null,
    };
    const result = editing
      ? await supabase.from('achievements').update(payload).eq('id', editing.id)
      : await supabase.from('achievements').insert(payload);

    if (result.error) {
      toast(editing ? 'Failed to update achievement.' : 'Failed to add achievement.', 'error');
    } else {
      toast(editing ? 'Achievement updated.' : 'Achievement added.', 'success');
      setModalOpen(false);
      await fetchAchievements();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('achievements').delete().eq('id', deleteId);
    if (error) toast('Failed to delete achievement.', 'error');
    else {
      toast('Achievement deleted.', 'success');
      await fetchAchievements();
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Manage your milestones and awards"
        action={<PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Achievement</PrimaryButton>}
      />

      {items.length === 0 ? <EmptyState message="No achievements yet." /> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((achievement) => (
            <div key={achievement.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{achievement.title}</h3>
                  {achievement.date && <p className="text-xs text-amber-400/80 mt-1">{achievement.date}</p>}
                  {achievement.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{achievement.description}</p>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(achievement)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Edit achievement">
                  <Pencil className="w-4 h-4 text-slate-400" />
                </button>
                <button type="button" onClick={() => setDeleteId(achievement.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" aria-label="Delete achievement">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Title *" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <Field label="Date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="2024" />
          <TextArea label="Description" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: Number(event.target.value) })} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Achievement" message="Are you sure you want to delete this achievement?" />
    </div>
  );
}
