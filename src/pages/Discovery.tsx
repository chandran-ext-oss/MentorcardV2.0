import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import MentorCard from '../components/MentorCard'
import Navbar, { type Panel } from '../components/Navbar'
import Drawer from '../components/Drawer'
import Dropdown from '../components/Dropdown'
import { mentors } from '../data/mentor'
import type { Session } from '../types'
import hero from '../assets/hero.jpg'

const CATEGORIES = Array.from(new Set(mentors.map((m) => m.category)))
const LANGUAGES = Array.from(new Set(mentors.flatMap((m) => m.languages)))
const SORTS = { popular: 'Popular', rating: 'Top rated', experience: 'Most experienced' } as const
type Sort = keyof typeof SORTS

const EXPERTISE = [{ value: 'All', label: 'Expertise: All' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]
const EXPERIENCE = [{ value: 'any', label: 'Experience: Any' }, { value: '5', label: '5+ years' }, { value: '10', label: '10+ years' }, { value: '15', label: '15+ years' }]
const AVAILABILITY = [{ value: 'any', label: 'Availability: Any' }, { value: 'now', label: 'Available now' }]
const LANGUAGE = [{ value: 'any', label: 'Language: Any' }, ...LANGUAGES.map((l) => ({ value: l, label: l }))]
const SORT_OPTIONS = Object.entries(SORTS).map(([value, label]) => ({ value, label }))

const wrap = 'mx-auto w-full max-w-[1320px] px-4 min-[640px]:px-6'

export default function Discovery() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [exp, setExp] = useState('any')
  const [avail, setAvail] = useState('any')
  const [lang, setLang] = useState('any')
  const [sort, setSort] = useState<Sort>('popular')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [panel, setPanel] = useState<Panel | null>(null)
  const listRef = useRef<HTMLElement>(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mentors
      .filter((m) => (cat === 'All' || m.category === cat) && m.experienceYears >= Number(exp === 'any' ? 0 : exp) &&
        (avail === 'any' || m.tags.availableNow) && (lang === 'any' || m.languages.includes(lang)) &&
        (!q || [m.name, m.role, m.company ?? '', m.category, ...m.skills].some((s) => s.toLowerCase().includes(q))))
      .sort((a, b) => (sort === 'popular' ? b.sessions - a.sessions : sort === 'rating' ? b.rating - a.rating : b.experienceYears - a.experienceYears))
  }, [query, cat, exp, avail, lang, sort])

  const visible = list.slice(0, 3)
  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const clear = () => { setQuery(''); setCat('All'); setExp('any'); setAvail('any'); setLang('any') }
  const toListing = () => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="min-h-dvh bg-[#fdf8f3]">
      <Navbar sessions={sessions.length} onPanel={setPanel} />

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ background: 'radial-gradient(50% 70% at 100% 0%, #fde3c8 0%, transparent 65%), radial-gradient(40% 60% at 0% 100%, #ebe3fa 0%, transparent 65%)' }}>
          <div aria-hidden className="absolute bottom-0 right-0 hidden w-[min(44%,480px)] min-[768px]:block">
            <div className="absolute -left-6 top-6 size-64 rounded-full bg-[#cdbdf2]/45 blur-3xl" />
            <img src={hero} alt="" className="relative block h-auto w-full [mask-image:radial-gradient(ellipse_at_62%_55%,#000_48%,transparent_76%)]" />
          </div>
          <div className={`${wrap} relative z-10 py-12 min-[768px]:py-20`}>
            <div className="max-w-[560px]">
              <p className="m-0 inline-block rounded-full bg-[#e9e2f9] px-4 py-1.5 text-sm font-bold text-[#3b2a6b]">Guidance for your journey</p>
              <h1 className="mb-0 mt-5 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-ink min-[640px]:text-[56px]">Find the right mentor for your next chapter.</h1>
              <p className="mt-5 max-w-[44ch] text-base leading-7 text-ink/70 min-[640px]:text-lg">Connect with experienced people who can help you grow, learn and thrive.</p>
              <form role="search" onSubmit={(e) => { e.preventDefault(); toListing() }} className="relative mt-7 max-w-[520px]">
                <label htmlFor="q" className="sr-only">Search mentors by name or expertise</label>
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/50" />
                <input id="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by mentor, expertise or skill…"
                  className="h-14 w-full rounded-full border border-ink/15 bg-white pl-12 pr-16 text-base shadow-[0_10px_30px_-12px_rgba(46,31,92,0.25)] placeholder:text-ink/45" />
                <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-coal text-white transition-transform active:scale-95"><ArrowRight aria-hidden className="size-5" /></button>
              </form>
              <div role="group" aria-label="Expertise categories" className="-mx-4 mt-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] min-[640px]:mx-0 min-[640px]:px-0">
                {CATEGORIES.map((c) => (
                  <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(cat === c ? 'All' : c); toListing() }}
                    className={`h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors ${cat === c ? 'border-coal bg-coal text-white' : 'border-ink/20 bg-white/80 text-ink hover:border-ink/50'}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section aria-label="Filters" className={`${wrap} pt-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex w-full flex-wrap items-center gap-3 min-[900px]:w-auto">
              <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)} className="flex h-11 items-center gap-2 rounded-full border border-ink/20 bg-white px-4 text-sm font-bold min-[900px]:pointer-events-none min-[900px]:border-0 min-[900px]:bg-transparent min-[900px]:px-0">
                <SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.75} />Filters<span className="hidden min-[900px]:inline">:</span>
              </button>
              <div className={`${filtersOpen ? 'grid' : 'hidden'} w-full grid-cols-2 gap-3 min-[900px]:flex min-[900px]:w-auto`}>
                <Dropdown label="Expertise" value={cat} options={EXPERTISE} onChange={setCat} />
                <Dropdown label="Experience" value={exp} options={EXPERIENCE} onChange={setExp} />
                <Dropdown label="Availability" value={avail} options={AVAILABILITY} onChange={setAvail} />
                <Dropdown label="Language" value={lang} options={LANGUAGE} onChange={setLang} />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="hidden text-ink/70 min-[480px]:inline">Sort by:</span>
              <Dropdown label="Sort by" value={sort} options={SORT_OPTIONS} onChange={(v) => setSort(v as Sort)} />
            </div>
          </div>
        </section>

        {/* Listing */}
        <section ref={listRef} aria-labelledby="meet-h" className={`${wrap} scroll-mt-20 pb-14 pt-8`}>
          <span aria-hidden className="mb-3 block h-0.5 w-10 bg-coal" />
          <h2 id="meet-h" className="m-0 text-[28px] font-bold tracking-[-0.02em] min-[640px]:text-4xl">Meet your mentors</h2>
          <p aria-live="polite" className="mt-1 text-ink/70">Explore people who bring experience, perspective and guidance. <span className="whitespace-nowrap">({visible.length < list.length ? `showing ${visible.length} of ${list.length}` : `${list.length} ${list.length === 1 ? 'mentor' : 'mentors'}`})</span></p>

          {visible.length ? (
            <div className="mt-6 grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((m) => (
                  <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}
                    className="mx-auto h-full w-full max-w-[440px] min-[640px]:max-w-none">
                    <MentorCard mentor={m} saved={saved.includes(m.id)} onToggleSave={() => toggleSave(m.id)}
                      onBooked={(when) => setSessions((s) => [...s, { id: `${m.id}-${s.length}`, mentor: m, when }])} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-ink/25 py-16 text-center">
              <p className="m-0 text-2xl font-bold">No mentors match yet</p>
              <p className="mt-2 text-ink/70">Try a different search or clear your filters.</p>
              <button type="button" onClick={clear} className="mt-5 h-11 rounded-xl bg-coal px-5 font-bold text-white">Clear filters</button>
            </div>
          )}
        </section>
      </main>

      <footer className={`${wrap} border-t border-ink/10 py-6 text-sm text-ink/60`}>Mentor. · Demo interface. Mentors and bookings are sample data.</footer>

      <Drawer panel={panel} onClose={() => setPanel(null)} sessions={sessions} saved={mentors.filter((m) => saved.includes(m.id))} onRemove={toggleSave} />
    </div>
  )
}
