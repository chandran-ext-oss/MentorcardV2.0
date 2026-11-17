import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Mentor, Session } from '../types'
import type { Panel } from './Navbar'
import avatar from '../assets/avatar.jpg'

interface Props { panel: Panel | null; onClose: () => void; sessions: Session[]; saved: Mentor[]; onRemove: (id: string) => void }

export default function Drawer({ panel, onClose, sessions, saved, onRemove }: Props) {
  useEffect(() => {
    if (!panel) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel, onClose])

  const row = 'flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3'
  return (
    <AnimatePresence>
      {panel && (
        <motion.div className="fixed inset-0 z-50 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside role="dialog" aria-modal="true" aria-label={panel === 'sessions' ? 'My sessions' : 'Your profile'} onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col overflow-y-auto bg-[#fdf8f3] p-6"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="m-0 text-2xl font-bold tracking-[-0.02em]">{panel === 'sessions' ? 'My Sessions' : 'Profile'}</h2>
              <button type="button" aria-label="Close" onClick={onClose} className="flex size-11 items-center justify-center rounded-full hover:bg-ink/5"><X aria-hidden className="size-5" /></button>
            </div>
            {panel === 'sessions' ? (
              sessions.length ? (
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {sessions.map((s) => (
                    <li key={s.id} className={row}>
                      <img src={s.mentor.photo} alt="" className="size-12 rounded-full object-cover object-[50%_25%]" />
                      <span className="min-w-0 flex-1"><b className="block truncate">{s.mentor.name}</b><span className="block text-sm text-ink/70">{s.when}</span></span>
                      <span className="rounded-full bg-[#d9ffe0] px-2.5 py-1 text-xs font-bold text-[#1a7a31]">Booked</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-ink/70">No sessions yet. Book a time with a mentor to see it here.</p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <img src={avatar} alt="" className="size-16 rounded-full object-cover" />
                  <div><b className="block text-lg">Your profile</b><span className="text-sm text-ink/70">Demo account · sample data</span></div>
                </div>
                <h3 className="mb-3 mt-8 text-sm font-bold uppercase tracking-[0.14em] text-ink/60">Saved mentors ({saved.length})</h3>
                {saved.length ? (
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {saved.map((m) => (
                      <li key={m.id} className={row}>
                        <img src={m.photo} alt="" className="size-12 rounded-full object-cover object-[50%_25%]" />
                        <span className="min-w-0 flex-1"><b className="block truncate">{m.name}</b><span className="block truncate text-sm text-ink/70">{m.role}</span></span>
                        <button type="button" aria-label={`Remove ${m.name} from saved`} onClick={() => onRemove(m.id)} className="flex size-11 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5"><X aria-hidden className="size-5" /></button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-ink/70">Tap the heart on a mentor’s photo to save them here.</p>}
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
