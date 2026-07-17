import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageSquare, Mail, Phone, CheckCircle2, Send, Clock, Sparkles, Loader2, X } from "lucide-react";
import { fetchAdminMessages, markMessageAsRead, replyToMessage } from "@/lib/api";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [sending, setSending] = useState(false);

  const fallbackMessages = [
    {
      _id: "1",
      name: "Meenakshi Sundaram",
      email: "meenakshi@example.com",
      phone: "+91 94440 11223",
      message: "Hi Shethara team! Do you offer custom blouse stitching along with the Kaveri Green Silk Saree for a wedding next month?",
      read: false,
      replied: false,
      createdAt: "2026-07-15T09:12:00Z",
    },
    {
      _id: "2",
      name: "Priyanka S",
      email: "priyanka.s@example.com",
      phone: "+91 90030 44556",
      message: "Can we schedule a private consultation visit at your Choolaimedu boutique this Saturday afternoon around 4 PM?",
      read: true,
      replied: true,
      createdAt: "2026-07-14T18:00:00Z",
    },
  ];

  const { data: messages = fallbackMessages, isLoading } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: () => fetchAdminMessages(),
  });

  const handleOpenReply = async (msg: any) => {
    setSelectedMsg(msg);
    setReplySubject(`Re: Inquiry from ${msg.name} — Shethara Fashion`);
    setReplyBody(`Dear ${msg.name},\n\nThank you for reaching out to Shethara Fashion Chennai.\n\nRegarding your inquiry: "${msg.message}"\n\n[Write your personalized boutique response here]\n\nWarm regards,\nShethara Fashion Client Relations\nNo.16/1, Pari Street 2nd Cross, Choolaimedu, Chennai 600094`);
    if (!msg.read) {
      try {
        await markMessageAsRead(msg._id);
        queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
        queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg) return;
    setSending(true);
    try {
      await replyToMessage(selectedMsg._id, { subject: replySubject, replyBody });
      alert(`Email reply successfully sent to ${selectedMsg.email} via Nodemailer Gmail Suite!`);
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      setSelectedMsg(null);
    } catch (err: any) {
      alert("Failed to send reply: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Live Customer Relations Inbox
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Customer Inquiries ({messages.length})</h1>
          <p className="text-xs text-white/60 mt-1">Read questions from boutique visitors and reply directly via automated Gmail Nodemailer</p>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map((msg: any) => (
          <div
            key={msg._id}
            className={`p-6 sm:p-7 rounded-3xl bg-[#142022] border transition-all flex flex-col justify-between shadow-xl relative overflow-hidden ${
              !msg.read ? "border-[var(--mint)] shadow-[var(--mint)]/10" : "border-white/10 hover:border-white/20"
            }`}
          >
            {!msg.read && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--mint)] text-[#0F1718]">
                New Unread
              </span>
            )}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--forest)]/30 border border-[var(--forest)]/50 grid place-items-center text-[var(--mint)] font-bold text-lg shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-white text-base truncate">{msg.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                    <span className="flex items-center gap-1 text-[var(--mint)]">
                      <Mail className="h-3 w-3" /> {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#182628] border border-white/10 text-sm text-white/90 leading-relaxed italic mb-6">
                "{msg.message}"
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Today"}
              </span>
              <div className="flex items-center gap-2">
                {msg.replied ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--forest)]/30 text-green-300 border border-[var(--forest)]/50">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Replied
                  </span>
                ) : null}
                <button
                  onClick={() => handleOpenReply(msg)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--forest)] to-[var(--mint)] text-[#0F1718] font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#142022] border border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
                  <Mail className="h-4 w-4" /> Nodemailer Email Dispatcher
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">Reply to {selectedMsg.name}</h2>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Recipient Email</label>
                <input
                  type="text"
                  disabled
                  value={selectedMsg.email}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white/60 opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Message Body</label>
                <textarea
                  rows={8}
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white focus:border-[var(--mint)] outline-none resize-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-white/50">Sent directly from shetharafashion@gmail.com via Gmail App Password</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMsg(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--forest)] to-[var(--mint)] text-[#0F1718] font-bold transition-all flex items-center gap-2 hover:brightness-110"
                  >
                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Send className="h-4 w-4" />
                    <span>{sending ? "Sending Email..." : "Send Email Reply"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
