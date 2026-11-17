import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import avatar from '../assets/avatar.jpg'

export type Panel = 'sessions' | 'profile'
interface Props { sessions: number; onPanel: (p: Panel) => void }

export default function Navbar({ sessions, onPanel }: Props) {
  const [open, setOpen] = useState(false)
  const link = 'relative flex h-16 items-center gap-2 px-1 text-sm font-medium text-ink/70 transition-colors hover:text-ink'
  const mobile = 'flex h-12 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-ink hover:bg-ink/5'
  const badge = sessions > 0 && <span className="min-w-5 rounded-full bg-coal px-1.5 text-center text-xs text-white">{sessions}</span>

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#fdf8f3]/85 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between px-4 min-[640px]:px-6">
        <a href="#top" className="text-[28px] font-bold tracking-[-0.03em] text-coal">Mentor<span className="text-peach">.</span></a>
        <div className="hidden items-center gap-8 min-[768px]:flex">
          <a href="#top" aria-current="page" className={`${link} font-bold text-coal after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-coal`}>Explore</a>
          <button type="button" className={link} onClick={() => onPanel('sessions')}>My Sessions {badge}</button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Open your profile and saved mentors" onClick={() => onPanel('profile')} className="flex size-11 items-center justify-center rounded-full">
            <img src={avatar} alt="" className="size-9 rounded-full object-cover" />
          </button>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center rounded-full hover:bg-ink/5 min-[768px]:hidden">
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-ink/10 min-[768px]:hidden">
            <div className="flex flex-col px-4 py-2">
              <a href="#top" className={`${mobile} font-bold`} onClick={() => setOpen(false)}>Explore</a>
              <button type="button" className={mobile} onClick={() => { setOpen(false); onPanel('sessions') }}>My Sessions {badge}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
