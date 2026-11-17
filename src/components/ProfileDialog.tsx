import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Mentor } from '../types'

interface Props { mentor: Mentor; open: boolean; onClose: () => void; onBook: () => void }

export default function ProfileDialog({ mentor, open, onClose, onBook }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby={`profile-${mentor.id}`} onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-[420px] overflow-y-auto rounded-[24px] bg-white text-ink"
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.25 }}>
            <div className="h-24 rounded-t-[24px]" style={{ background: 'linear-gradient(120deg, #fde3c8 0%, #ebe3fa 55%, #d9ccf5 100%)' }} />
            <img src={mentor.photo} alt={`Portrait of ${mentor.name}`} className="-mt-12 ml-6 size-[112px] rounded-[24px] object-cover object-[55%_25%] shadow-md ring-4 ring-white" />
            <button type="button" aria-label="Close" onClick={onClose} className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"><X aria-hidden className="size-5" /></button>
            <div className="px-6 pb-6 pt-4">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-accent">{mentor.category}</p>
              <h2 id={`profile-${mentor.id}`} className="mt-1 text-2xl font-bold leading-8 tracking-[-0.02em]">{mentor.name}</h2>
              <p className="mt-1 text-sm text-ink/70">{mentor.role}{mentor.company ? ` @ ${mentor.company}` : ''} · {mentor.languages.join(', ')}</p>
              <p className="mt-3 text-[15px] leading-6 text-ink/80">{mentor.bio}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#f1ecfa] p-3 text-sm">
                {[['Experience', `${mentor.experienceYears}+ yrs`], ['Sessions', `${mentor.sessions}+`], ['Rating', mentor.rating.toFixed(1)]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-ink/60">{k}</dt><dd className="m-0 font-bold">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-ink/70"><b className="text-ink">{mentor.price}</b> / {mentor.sessionLength} · Next: {mentor.nextSlot}</p>
              <button type="button" onClick={onBook} className="mt-5 h-12 w-full rounded-xl bg-coal font-bold text-white shadow-[0_8px_16px_-8px_rgba(46,31,92,0.55)] transition-transform active:scale-[0.97]">Book a Session</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
