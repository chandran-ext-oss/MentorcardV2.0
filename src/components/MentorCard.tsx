import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Clock, Heart, Star, Zap } from 'lucide-react'
import type { Mentor } from '../types'
import BookingModal from './BookingModal'
import ProfileDialog from './ProfileDialog'

const ease = [0.22, 1, 0.36, 1] as const

const cardVariants: Variants = {
  rest: { y: 0, boxShadow: '0 1px 2px rgba(46,31,92,0.05)', transition: { duration: 0.3, ease } },
  hover: { y: -6, boxShadow: '0 22px 40px -16px rgba(46,31,92,0.32)', transition: { duration: 0.3, ease } },
}
const imageVariants: Variants = {
  rest: { scale: 1, transition: { duration: 0.5, ease } },
  hover: { scale: 1.1, transition: { duration: 0.5, ease } },
}
const starPop: Variants = {
  idle: { scale: 1, rotate: 0 },
  pop: { scale: [1, 1.4, 1], rotate: [0, 20, 0], transition: { duration: 0.7, ease } },
}

function CountUp({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) return setV(to)
    const c = animate(0, to, { duration: 1, delay: 0.2, ease, onUpdate: setV })
    return () => c.stop()
  }, [to, reduce])
  return <span className="tabular-nums">{v.toFixed(decimals)}{suffix}</span>
}

function Stat({ label, hint, children, accent }: { label: string; hint: string; children: ReactNode; accent?: boolean }) {
  return (
    <div title={hint} className="flex flex-col text-ink/70">
      <span className="whitespace-nowrap text-xs leading-4 group-data-[size=lg]:text-[13px]">{label}</span>
      <span className={`text-sm font-bold leading-5 group-data-[size=lg]:text-base group-data-[size=lg]:leading-6 ${accent ? 'text-forest' : 'text-ink'}`}>{children}</span>
    </div>
  )
}

// Two overlapping speech bubbles (from the Figma design), drawn on a 24px grid with the same stroke as the other icons.
const SessionsIcon = () => (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-ink">
    <path d="M6 10A8 8 0 0 1 14 2A8 8 0 0 1 22 10V18H14A8 8 0 0 1 6 10Z" />
    <path d="M2 16A6 6 0 0 1 8 10A6 6 0 0 1 14 16A6 6 0 0 1 8 22H2Z" />
  </svg>
)
const Divider = () => <span aria-hidden className="h-10 border-l border-dotted border-ink/30" />

interface Props { mentor: Mentor; saved: boolean; onToggleSave: () => void; onBooked?: (when: string) => void }

export default function MentorCard({ mentor, saved, onToggleSave, onBooked }: Props) {
  const [booking, setBooking] = useState(false)
  const [profile, setProfile] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [size, setSize] = useState<'sm' | 'lg'>('sm')
  const ref = useRef<HTMLElement>(null)
  const timer = useRef<number>()
  const titleId = `mentor-${mentor.id}`

  // The card switches between its compact and roomy layouts by its own width, not the screen's.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize(e.contentRect.width >= 400 ? 'lg' : 'sm'))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const toggleSave = () => {
    setToast(saved ? 'Removed from saved mentors' : 'Saved to your mentors')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 2200)
    onToggleSave()
  }

  return (
    <>
      <motion.article
        ref={ref}
        data-size={size}
        aria-labelledby={titleId}
        variants={cardVariants}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="hover"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfaff 100%)' }}
        className="group flex h-full w-full flex-col gap-3.5 rounded-[26px] border border-ink/10 p-3 data-[size=lg]:rounded-[30px] data-[size=lg]:p-4"
      >
        {/* Photo */}
        <div className="relative h-[236px] shrink-0 overflow-hidden rounded-[18px] bg-[#e9e2f9] group-data-[size=lg]:h-[320px] group-data-[size=lg]:rounded-[22px]">
          <motion.img src={mentor.photo} alt={`Portrait of ${mentor.name}`} variants={imageVariants} className="absolute inset-0 h-full w-full object-cover object-[50%_22%]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
          <div className="absolute inset-3 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              {mentor.tags.topRated ? <span className="flex h-7 items-center rounded-full bg-white/90 px-3 text-xs font-bold text-[#3b2a6b] shadow-sm">Top Rated</span> : <span />}
              <motion.button type="button" aria-label={saved ? `Remove ${mentor.name} from saved mentors` : `Save ${mentor.name}`} aria-pressed={saved} onClick={toggleSave} whileTap={{ scale: 0.9 }}
                className="flex size-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white">
                <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} className="flex">
                  <Heart aria-hidden className={`size-5 ${saved ? 'fill-[#e5365f] text-[#e5365f]' : ''}`} strokeWidth={1.75} />
                </motion.span>
              </motion.button>
            </div>
            {mentor.tags.availableNow ? (
              <span className="flex h-[26px] w-fit animate-ring items-center gap-1.5 rounded-full bg-[#d9ffe0] px-2.5 text-xs font-bold text-[#1a7a31] motion-reduce:animate-none">
                <Zap aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />Available ASAP
              </span>
            ) : <span />}
          </div>
        </div>

        {/* Identity */}
        <div className="flex flex-col gap-1.5 px-2 group-data-[size=lg]:px-3">
          <h3 id={titleId} className="m-0 text-[22px] font-bold leading-7 tracking-[-0.02em] text-ink group-data-[size=lg]:text-[26px] group-data-[size=lg]:leading-8">{mentor.name}</h3>
          <p className="m-0 text-sm font-medium text-accent group-data-[size=lg]:text-base">{mentor.role}{mentor.company ? ` @ ${mentor.company}` : ''}</p>
          <p className="m-0 line-clamp-2 text-sm leading-5 text-ink/65 group-data-[size=lg]:text-[15px] group-data-[size=lg]:leading-6">{mentor.bio}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 text-sm text-ink/70">
            <span className="flex items-center gap-2"><SessionsIcon /><span><b className="text-ink"><CountUp to={mentor.sessions} /></b> Sessions</span></span>
            <motion.button type="button" aria-label={`Rating ${mentor.rating} out of 5`} initial="idle" animate="idle" whileHover="pop" whileTap="pop" className="-my-3 flex min-h-11 items-center gap-2 rounded-md">
              <motion.span variants={starPop} className="inline-flex"><Star aria-hidden className="size-4 fill-[#f5b82e] text-[#f5b82e]" strokeWidth={1.75} /></motion.span>
              <span><b className="text-ink"><CountUp to={mentor.rating} decimals={1} /></b> Rating</span>
            </motion.button>
          </div>
        </div>

        {/* Expertise: one line */}
        <ul aria-label="Expertise" className="m-0 flex list-none flex-nowrap gap-2 overflow-hidden p-0 px-2 group-data-[size=lg]:px-3">
          {mentor.skills.map((s) => (
            <li key={s} className="shrink-0 whitespace-nowrap rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-[#3b2a6b] group-data-[size=lg]:text-[13px]">{s}</li>
          ))}
        </ul>

        {/* Trust stats */}
        <div className="mx-2 flex items-center justify-between border-y border-ink/10 py-3 group-data-[size=lg]:mx-3">
          <Stat label="Experience" hint="Years of professional experience"><CountUp to={mentor.experienceYears} suffix="+ yrs" /></Stat>
          <Divider />
          <Stat label="Fluent in" hint={mentor.languages.join(', ')}>{mentor.languages[0]}</Stat>
          <Divider />
          <Stat label="Attendance" hint="Share of booked sessions attended" accent><CountUp to={mentor.attendance} suffix="%" /></Stat>
        </div>

        {/* Price + actions */}
        <div className="mt-auto flex flex-col gap-3 px-2 group-data-[size=lg]:px-3">
          <div className="flex items-center justify-between gap-2 text-xs group-data-[size=lg]:text-sm">
            <p className="m-0 text-ink/70"><b className="text-xl font-bold text-ink">{mentor.price}</b> / {mentor.sessionLength}</p>
            <p className="m-0 flex items-center gap-1.5 font-bold text-forest"><Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />{mentor.nextSlot}</p>
          </div>
          {/* Primary + secondary actions; they wrap to full-width stacked buttons on very narrow cards */}
          <div className="flex flex-wrap gap-2">
            <motion.button type="button" onClick={() => setBooking(true)} whileTap={{ scale: 0.97 }}
              className="group/cta flex h-12 min-w-0 flex-[2_1_150px] items-center justify-center gap-2 rounded-xl bg-coal px-4 text-[15px] font-bold text-white shadow-[0_8px_16px_-8px_rgba(46,31,92,0.55)] transition-colors hover:bg-[#3a2873]">
              Book a Session
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" strokeWidth={1.75} />
            </motion.button>
            <motion.button type="button" onClick={() => setProfile(true)} whileTap={{ scale: 0.97 }}
              className="h-12 min-w-0 flex-[1_1_112px] rounded-xl border border-coal/30 bg-transparent px-4 text-[15px] font-bold text-ink transition-colors hover:border-coal/50 hover:bg-coal/5">
              View Profile
            </motion.button>
          </div>
        </div>
      </motion.article>

      {createPortal(
        <>
          <ProfileDialog mentor={mentor} open={profile} onClose={() => setProfile(false)} onBook={() => { setProfile(false); setBooking(true) }} />
          <BookingModal open={booking} mentorName={mentor.name} onClose={() => setBooking(false)} onBooked={onBooked} />
          <AnimatePresence>
            {toast && (
              <motion.div role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}
                className="fixed inset-x-0 z-[60] mx-auto w-fit max-w-[90vw] rounded-full bg-coal px-4 py-2 text-sm text-white shadow-lg" style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </>
  )
}
