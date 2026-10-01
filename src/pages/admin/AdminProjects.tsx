import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, FolderGit2, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const blank = {
    title: '', short_description: '', detailed_description: '',
    technologies: '', image_url: '', github_url: '', live_demo_url: '',
    category: '', featured: false,
  };
  const [form, setForm] = useState(blank);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, short_description: p.short_description,
      detailed_description: p.detailed_description || '',
      technologies: p.technologies.join(', '),
      image_url: p.image_url || '', github_url: p.github_url || '',
      live_demo_url: p.live_demo_url || '', category: p.category || '',
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      short_description: form.short_description,
      detailed_description: form.detailed_description || null,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      image_url: form.image_url || null,
      github_url: form.github_url || null,
      live_demo_url: form.live_demo_url || null,
      category: form.category || null,
      featured: form.featured,
    };

    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
      if (error) toast('Failed to update project.', 'error');
      else toast('Project updated successfully.', 'success');
    } else {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) toast('Failed to add project.', 'error');
      else toast('Project added successfully.', 'success');
    }
    setSaving(false);
    setModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('projects').delete().eq('id', deleteId);
    if (error) toast('Failed to delete project.', 'error');
    else toast('Project deleted.', 'success');
    setDeleteId(null);
    fetchProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file.', 'error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast('Image size must be under 50MB.', 'error');
      return;
    }

    setSaving(true);
    const fileName = `project-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file, { upsert: true });
    if (error) {
      toast('Image upload failed. Please check the projects storage bucket.', 'error');
      setSaving(false);
      return;
    }

    const { data } = supabase.storage.from('projects').getPublicUrl(fileName);
    setForm((current) => ({ ...current, image_url: data.publicUrl }));
    toast('Project image selected. Save the project to apply it.', 'success');
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Projects" description="Manage your portfolio projects" action={
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Project</PrimaryButton>
      } />

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Click 'Add Project' to create one." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover rounded-xl mb-4 border border-white/10" />}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  {p.featured && <Star className="w-4 h-4 text-amber-400 fill-current" />}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{p.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{p.short_description}</p>
              <div className="flex flex-wrap gap-1">
                {p.technologies.slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-xs bg-brand-500/10 text-brand-300">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Field label="Short Description *" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} required />
          <TextArea label="Detailed Description" rows={4} value={form.detailed_description} onChange={(e) => setForm({ ...form, detailed_description: e.target.value })} />
          <Field label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Java, Spring Boot, React" />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Project Image</label>
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-slate-900/30 p-4">
              {form.image_url ? (
                <img src={form.image_url} alt="Project preview" className="w-24 h-16 rounded-lg object-cover border border-white/10" />
              ) : (
                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center text-brand-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm font-medium cursor-pointer hover:bg-brand-500/25 transition-colors">
                <Upload className="w-4 h-4" />
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              </label>
              <span className="text-xs text-slate-500">JPG, PNG or WEBP, max 50MB</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            <Field label="Live Demo URL" value={form.live_demo_url} onChange={(e) => setForm({ ...form, live_demo_url: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Full Stack, Backend" />
            <label className="flex items-center gap-3 mt-7 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded accent-brand-500" />
              <span className="text-sm text-slate-300">Featured Project</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Project" message="Are you sure you want to delete this project? This cannot be undone." />
    </div>
  );
}
