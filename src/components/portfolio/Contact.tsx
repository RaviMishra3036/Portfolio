import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message,
    });

    setSubmitting(false);

    if (error) {
      toast('Failed to send message. Please try again.', 'error');
      return;
    }

    toast('Message sent successfully! I will get back to you soon.', 'success');
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClass = "liquid-field w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/15 transition-all";

  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-5">
            <Mail className="w-3.5 h-3.5" />
            Contact Me
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl">
            Have a project in mind or want to collaborate? Send me a message and I'll get back to you.
          </p>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Info cards */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'ravikr151204@example.com', color: 'text-brand-400' },
                { icon: Phone, label: 'Phone', value: '+91 99319 83158', color: 'text-accent-400' },
                { icon: MapPin, label: 'Location', value: 'Noida, India', color: 'text-brand-300' },
              ].map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="liquid-glass rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl glass ${info.color}`}>
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{info.label}</p>
                    <p className="text-sm font-medium text-white">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 liquid-glass rounded-3xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required className={inputClass} placeholder="Project inquiry" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Tell me about your project..." />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
