import { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState } from '@/components/admin/UI';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ theme: 'dark', site_title: '', meta_description: '' });

  useEffect(() => {
    supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle().then(({ data }) => {
      const s = data as SiteSettings | null;
      setSettings(s);
      if (s) setForm({ theme: s.theme, site_title: s.site_title, meta_description: s.meta_description || '' });
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, meta_description: form.meta_description || null, updated_at: new Date().toISOString() };
    if (settings) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', settings.id);
      if (error) toast('Failed to update settings.', 'error');
      else toast('Settings updated.', 'success');
    } else {
      const { error } = await supabase.from('site_settings').insert(payload);
      if (error) toast('Failed to save settings.', 'error');
      else toast('Settings saved.', 'success');
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Site Settings" description="Configure your portfolio site" />
      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-400">These settings control your site's appearance and metadata.</p>
        </div>
        <Field label="Site Title" value={form.site_title} onChange={(e) => setForm({ ...form, site_title: e.target.value })} />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
          <select
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
          >
            <option value="dark" className="bg-slate-900">Dark</option>
            <option value="light" className="bg-slate-900">Light</option>
          </select>
        </div>
        <TextArea label="Meta Description" rows={3} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
