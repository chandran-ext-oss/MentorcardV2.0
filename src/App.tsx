import { MotionConfig } from 'framer-motion'
import Discovery from './pages/Discovery'

export default function App() {
  return (
    // reducedMotion="user" disables transform animations when the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <Discovery />
    </MotionConfig>
  )
}
