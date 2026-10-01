import { useEffect, useState } from 'react';
import { Save, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { Field } from '@/components/admin/FormFields';
import { PageHeader, PrimaryButton, LoadingState } from '@/components/admin/UI';

export default function AdminContact() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '', location: '' });

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      const p = data as Profile | null;
      setProfile(p);
      if (p) {
        setForm({
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast('Please create your profile first from the Profile section.', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      email: form.email || null,
      phone: form.phone || null,
      location: form.location || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profile').update(payload).eq('id', profile.id);
    if (error) {
      toast('Failed to update contact details.', 'error');
    } else {
      toast('Contact details updated successfully.', 'success');
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Contact Me</h1>
        <p className="mt-2 text-lg text-slate-400">Update your contact details shown on the portfolio</p>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6 sm:p-7 space-y-5 mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
            <Mail className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-400">This data appears in the Contact section of your portfolio.</p>
        </div>

        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />

        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
            <div className="flex items-center gap-2 text-brand-300 mb-1"><Mail className="w-4 h-4" /> Email</div>
            <p className="text-xs text-slate-400 break-all">{form.email || 'Not set'}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
            <div className="flex items-center gap-2 text-accent-300 mb-1"><Phone className="w-4 h-4" /> Phone</div>
            <p className="text-xs text-slate-400 break-all">{form.phone || 'Not set'}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
            <div className="flex items-center gap-2 text-brand-300 mb-1"><MapPin className="w-4 h-4" /> Location</div>
            <p className="text-xs text-slate-400 break-all">{form.location || 'Not set'}</p>
          </div>
        </div>

        <Field label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 12345 67890" />
        <Field label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Noida, India" />

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Contact Info</>}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
