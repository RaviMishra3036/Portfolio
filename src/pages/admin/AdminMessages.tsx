import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Search, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { PageHeader, LoadingState, EmptyState } from '@/components/admin/UI';

export default function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const markRead = async (msg: Message) => {
    const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
    if (error) toast('Failed to mark as read.', 'error');
    else { toast('Marked as read.', 'success'); fetch(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('messages').delete().eq('id', deleteId);
    if (error) toast('Failed to delete message.', 'error');
    else toast('Message deleted.', 'success');
    setDeleteId(null); fetch();
  };

  const filtered = messages.filter((m) => {
    const matchesSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && !m.is_read) || (filter === 'read' && m.is_read);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Messages" description="Your contact form inbox" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-brand-500 text-white' : 'glass text-slate-300 hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No messages found." />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`glass rounded-2xl p-5 transition-colors cursor-pointer ${!m.is_read ? 'border-l-2 border-l-brand-500' : ''}`}
              onClick={() => setSelected(m)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl ${!m.is_read ? 'bg-brand-500/10 text-brand-400' : 'bg-slate-700/30 text-slate-500'}`}>
                    {!m.is_read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                      {!m.is_read && <span className="px-2 py-0.5 rounded text-xs bg-brand-500/20 text-brand-300">New</span>}
                    </div>
                    <p className="text-sm text-slate-400 truncate">{m.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.email} — {formatDate(m.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {!m.is_read && (
                    <button onClick={() => markRead(m)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Mark as Read">
                      <MailOpen className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                  <button onClick={() => setDeleteId(m.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message detail */}
      {selected && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="glass-strong rounded-3xl max-w-xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">{selected.subject}</h2>
                <p className="text-sm text-slate-400">{formatDate(selected.created_at)}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">From</p>
                  <p className="text-sm text-white font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-brand-300">{selected.email}</p>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-sm text-white">{selected.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <span className={`text-sm ${selected.is_read ? 'text-slate-400' : 'text-brand-300'}`}>
                    {selected.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Message</p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!selected.is_read && (
                <button onClick={() => { markRead(selected); setSelected(null); }} className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors">
                  <MailOpen className="w-4 h-4" /> Mark as Read
                </button>
              )}
              <button onClick={() => { setDeleteId(selected.id); setSelected(null); }} className="flex items-center gap-2 px-5 py-2.5 glass hover:bg-red-500/10 text-red-400 text-sm font-medium rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 px-5 py-2.5 glass hover:bg-white/10 text-sm font-medium rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Message" message="Are you sure you want to delete this message?" />
    </div>
  );
}
