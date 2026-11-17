import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export interface Option { value: string; label: string }
interface Props { label: string; value: string; options: Option[]; onChange: (v: string) => void }

// Custom listbox so the menu matches the rest of the UI (native <select> menus use OS styling).
export default function Dropdown({ label, value, options, onChange }: Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [right, setRight] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const selected = Math.max(0, options.findIndex((o) => o.value === value))

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!host.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (!open || !list.current || !btn.current) return
    list.current.focus({ preventScroll: true })
    const r = btn.current.getBoundingClientRect()
    setRight(r.left + Math.max(list.current.offsetWidth, r.width) > window.innerWidth - 12)
  }, [open])

  useEffect(() => {
    if (open) (list.current?.children[active] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const choose = (i: number) => { onChange(options[i].value); setOpen(false); btn.current?.focus() }
  const n = options.length

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % n) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + n) % n) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(n - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); btn.current?.focus() }
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={host} className="relative">
      <button ref={btn} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={id} aria-label={label}
        onClick={() => { setActive(selected); setOpen(!open) }}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setActive(selected); setOpen(true) } }}
        className="flex h-11 w-full items-center justify-between gap-2 whitespace-nowrap rounded-full border border-ink/20 bg-white pl-4 pr-3.5 text-sm font-bold text-ink transition-colors hover:border-ink/50 aria-expanded:border-ink/50">
        {options[selected]?.label}
        <ChevronDown aria-hidden className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.75} />
      </button>
      <ul ref={list} id={id} role="listbox" tabIndex={-1} aria-label={label} aria-activedescendant={`${id}-${active}`} onKeyDown={onListKey}
        className={`absolute top-[calc(100%+8px)] z-[35] m-0 w-max min-w-full max-w-[min(280px,calc(100vw-32px))] list-none rounded-[18px] border border-ink/10 bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(46,31,92,0.35)] outline-none transition duration-150 origin-top motion-reduce:transition-none ${right ? 'right-0' : 'left-0'} ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-1 scale-[0.98] opacity-0'}`}>
        {options.map((o, i) => (
          <li key={o.value} id={`${id}-${i}`} role="option" aria-selected={i === selected} onMouseMove={() => setActive(i)} onClick={() => choose(i)}
            className={`flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-sm font-bold ${i === active ? 'bg-[#f1ecfa]' : ''} ${i === selected ? 'text-coal' : 'text-ink'}`}>
            {o.label}
            {i === selected && <Check aria-hidden className="size-4 shrink-0 text-coal" strokeWidth={2} />}
          </li>
        ))}
      </ul>
    </div>
  )
}
