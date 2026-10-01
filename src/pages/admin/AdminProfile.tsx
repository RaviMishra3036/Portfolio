import { useEffect, useState } from 'react';
import { Save, User, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState } from '@/components/admin/UI';

export default function AdminProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', bio: '', photo_url: '', resume_url: '' });

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      const p = data as Profile | null;
      setProfile(p);
      if (p) setForm({ name: p.name, title: p.title, bio: p.bio, photo_url: p.photo_url || '', resume_url: p.resume_url || '' });
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, photo_url: form.photo_url || null, resume_url: form.resume_url || null, updated_at: new Date().toISOString() };
    if (profile) {
      const { error } = await supabase.from('profile').update(payload).eq('id', profile.id);
      if (error) toast('Failed to update profile.', 'error');
      else toast('Profile updated successfully.', 'success');
    } else {
      const { error } = await supabase.from('profile').insert(payload);
      if (error) toast('Failed to create profile.', 'error');
      else toast('Profile created successfully.', 'success');
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const fileName = `profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('profile').upload(fileName, file, { upsert: true });
    if (uploadError) {
      toast('Image upload failed. Please check the profile storage bucket.', 'error');
      setSaving(false);
      return;
    }

    const { data } = supabase.storage.from('profile').getPublicUrl(fileName);
    setForm((current) => ({ ...current, photo_url: data.publicUrl }));
    toast('Profile image selected. Save changes to apply it.', 'success');
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="admin-profile-page max-w-3xl mx-auto">
      <PageHeader title="Profile" description="Update your personal information" />
      <form onSubmit={save} className="glass rounded-2xl p-7 sm:p-8 space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center text-brand-400">
            <User className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">This information appears on your portfolio homepage.</p>
          </div>
        </div>
        <Field label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Field label="Professional Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <TextArea label="Bio" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-slate-900/30 p-4">
            {form.photo_url ? (
              <img src={form.photo_url} alt="Profile preview" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center text-brand-400">
                <ImageIcon className="w-7 h-7" />
              </div>
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm font-medium cursor-pointer hover:bg-brand-500/25 transition-colors">
              <Upload className="w-4 h-4" />
              Choose Image
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
            </label>
            <span className="text-xs text-slate-500">JPG, PNG or WEBP, max 50MB</span>
          </div>
        </div>
        <Field label="Resume URL" value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} placeholder="https://..." />
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
