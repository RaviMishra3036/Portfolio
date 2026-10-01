import { useEffect, useState } from 'react';
import { Save, UserRound, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Field, TextArea } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState } from '@/components/admin/UI';

const defaultStats = [
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Projects Completed' },
  { value: '15+', label: 'Technologies' },
];

export default function AdminAbout() {
  const { toast } = useToast();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState('');
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('id, about_text, about_stats').order('updated_at', { ascending: false }).limit(1).maybeSingle().then(({ data, error }) => {
      if (error) toast('Failed to load About Me settings.', 'error');
      setSettingsId(data?.id || null);
      setAboutText(data?.about_text || '');
      setStats(data?.about_stats?.length === 3 ? data.about_stats : defaultStats);
      setLoading(false);
    });
  }, [toast]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = { about_text: aboutText, about_stats: stats, updated_at: new Date().toISOString() };
    const result = settingsId
      ? await supabase.from('site_settings').update(payload).eq('id', settingsId)
      : await supabase.from('site_settings').insert({
        ...payload,
        theme: 'dark',
        site_title: 'Ravi Kumar Mishra Portfolio',
        meta_description: null,
      }).select('id').single();

    if (result.error) {
      toast(`Failed to save About Me: ${result.error.message}`, 'error');
    } else {
      if (!settingsId && result.data?.id) setSettingsId(result.data.id);
      toast('About Me updated successfully.', 'success');
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="admin-profile-page max-w-3xl mx-auto">
      <PageHeader title="About Me" description="Update the story shown in your portfolio About section" />
      <form onSubmit={save} className="glass rounded-2xl p-7 sm:p-8 space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center text-brand-400">
            <UserRound className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-400">This text appears in the About Me section on your portfolio homepage.</p>
        </div>
        <TextArea
          label="About Me *"
          rows={10}
          value={aboutText}
          onChange={(event) => setAboutText(event.target.value)}
          placeholder="Tell visitors about yourself, your experience, and what you build..."
          required
        />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">About Statistics</h3>
          {stats.map((stat, index) => (
            <div key={index} className="grid sm:grid-cols-2 gap-4 rounded-xl border border-white/10 bg-slate-900/30 p-4">
              <Field
                label={`Stat ${index + 1} Value`}
                value={stat.value}
                onChange={(event) => setStats((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))}
                placeholder="30+"
              />
              <Field
                label="Label"
                value={stat.label}
                onChange={(event) => setStats((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))}
                placeholder="Projects Completed"
              />
            </div>
          ))}
        </div>
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
