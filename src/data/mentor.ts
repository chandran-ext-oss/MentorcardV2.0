import type { Mentor } from '../types'
import dilip from '../assets/dilip.jpg'
import raghav from '../assets/raghav.jpg'
import meera from '../assets/meera.jpg'
import ananya from '../assets/ananya.jpg'
import neil from '../assets/neil.jpg'
import suresh from '../assets/suresh.jpg'

const base = { sessionLength: '30 min' }

export const mentors: Mentor[] = [
  { ...base, id: 'dilip', name: 'Dilipkumar Natarajan', role: 'Industrial Designer', company: 'Versuni', category: 'Design',
    bio: 'Shapes everyday appliances from first sketch to factory floor.', sessions: 32, rating: 4.5, experienceYears: 6, attendance: 100,
    languages: ['English', 'Tamil'], photo: dilip, price: '₹1,200', nextSlot: 'Today, 4:30 PM', skills: ['Product design', 'Prototyping', 'CAD'], tags: { topRated: true, availableNow: true } },
  { ...base, id: 'raghav', name: 'Raghav Menon', role: 'Leadership Mentor', category: 'Leadership',
    bio: 'Build leadership with inner clarity and calm decision-making.', sessions: 300, rating: 4.9, experienceYears: 12, attendance: 98,
    languages: ['English', 'Malayalam'], photo: raghav, price: '₹2,400', nextSlot: 'Today, 6:00 PM', skills: ['Leadership', 'Strategy', 'Coaching'], tags: { topRated: true, availableNow: true } },
  { ...base, id: 'meera', name: 'Meera Krishnan', role: 'Career Coach', category: 'Career',
    bio: 'Grow with confidence and make your next career move count.', sessions: 200, rating: 4.8, experienceYears: 8, attendance: 99,
    languages: ['English', 'Tamil'], photo: meera, price: '₹1,800', nextSlot: 'Today, 5:15 PM', skills: ['Career growth', 'Interviews', 'Confidence'], tags: { topRated: true, availableNow: true } },
  { ...base, id: 'ananya', name: 'Ananya Rao', role: 'Wellbeing Mentor', category: 'Wellbeing',
    bio: 'Find balance in life with practical habits that last.', sessions: 150, rating: 4.9, experienceYears: 10, attendance: 97,
    languages: ['English', 'Hindi'], photo: ananya, price: '₹1,600', nextSlot: 'Tomorrow, 9:30 AM', skills: ['Balance', 'Mindfulness', 'Habits'], tags: { topRated: false, availableNow: true } },
  { ...base, id: 'neil', name: 'Neil Fernandes', role: 'Communication Coach', category: 'Communication',
    bio: 'Speak clearly and lead every conversation with confidence.', sessions: 120, rating: 4.7, experienceYears: 7, attendance: 97,
    languages: ['English', 'Hindi'], photo: neil, price: '₹1,500', nextSlot: 'Today, 7:00 PM', skills: ['Public speaking', 'Storytelling', 'Presence'], tags: { topRated: false, availableNow: true } },
  { ...base, id: 'suresh', name: 'Suresh Iyer', role: 'Mindset Coach', category: 'Personal Growth',
    bio: 'Create lasting change by reshaping how you think and act.', sessions: 400, rating: 4.9, experienceYears: 15, attendance: 96,
    languages: ['English', 'Hindi'], photo: suresh, price: '₹2,200', nextSlot: 'Tomorrow, 2:30 PM', skills: ['Mindset', 'Focus', 'Resilience'], tags: { topRated: true, availableNow: false } },
]

export const mentor = mentors[0]
