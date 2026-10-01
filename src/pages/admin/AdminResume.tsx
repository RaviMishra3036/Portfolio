import { useEffect, useState } from 'react';
import { FileText, Upload, Trash2, Download, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Resume } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { PageHeader, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminResume() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from('resume').select('*').order('uploaded_at', { ascending: false });
    setResumes((data as Resume[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast('Please upload a PDF file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('File size must be under 5MB.', 'error');
      return;
    }

    setUploading(true);
    const fileName = `resume-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(fileName, file);

    if (uploadError) {
      // If bucket doesn't exist, store URL reference directly
      toast('Upload failed. You can add a resume URL from the Profile page.', 'error');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('resume').getPublicUrl(fileName);
    const fileUrl = urlData.publicUrl;

    // Deactivate previous resumes
    await supabase.from('resume').update({ is_active: false }).neq('is_active', false);

    // Insert new resume record
    const { error: insertError } = await supabase.from('resume').insert({
      file_url: fileUrl,
      file_name: file.name,
      is_active: true,
    });

    if (insertError) {
      toast('Failed to save resume record.', 'error');
    } else {
      // Update profile resume_url
      await supabase.from('profile').update({ resume_url: fileUrl }).neq('id', '00000000-0000-0000-0000-000000000000');
      toast('Resume uploaded successfully.', 'success');
      fetch();
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const resume = resumes.find((r) => r.id === deleteId);
    if (resume) {
      // Extract path from URL for storage deletion
      const path = resume.file_url.split('/resume/')[1];
      if (path) await supabase.storage.from('resume').remove([path]);
    }
    const { error } = await supabase.from('resume').delete().eq('id', deleteId);
    if (error) toast('Failed to delete resume.', 'error');
    else toast('Resume deleted.', 'success');
    setDeleteId(null);
    fetch();
  };

  const setActive = async (r: Resume) => {
    await supabase.from('resume').update({ is_active: false }).neq('is_active', false);
    await supabase.from('resume').update({ is_active: true }).eq('id', r.id);
    await supabase.from('profile').update({ resume_url: r.file_url }).neq('id', '00000000-0000-0000-0000-000000000000');
    toast('Resume set as active.', 'success');
    fetch();
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Resume" description="Upload and manage your resume" />

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-400">
            <FileText className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Upload New Resume</h3>
            <p className="text-sm text-slate-400">PDF files only, max 5MB</p>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-brand-500/20">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload'}
            <input type="file" accept=".pdf,application/pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {resumes.length === 0 ? (
        <EmptyState message="No resumes uploaded yet." />
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">{r.file_name || 'Resume'}</h3>
                    {r.is_active && (
                      <span className="flex items-center gap-1 text-xs text-accent-400">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Uploaded {formatDate(r.uploaded_at)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={r.file_url} download className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Download">
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
                {!r.is_active && (
                  <button onClick={() => setActive(r)} className="px-3 py-2 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 transition-colors">
                    Set Active
                  </button>
                )}
                <button onClick={() => setDeleteId(r.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Resume" message="Are you sure you want to delete this resume?" />
    </div>
  );
}
