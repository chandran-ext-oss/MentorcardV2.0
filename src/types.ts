export interface Mentor {
  id: string
  name: string
  role: string
  company?: string
  category: string
  bio: string
  sessions: number
  rating: number
  experienceYears: number
  languages: string[]
  attendance: number
  photo: string
  price: string
  sessionLength: string
  nextSlot: string
  skills: string[]
  tags: { topRated: boolean; availableNow: boolean }
}

export interface Session {
  id: string
  mentor: Mentor
  when: string
}
