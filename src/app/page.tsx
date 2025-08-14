
import type { Metadata } from 'next'
import HomePage from './home-page'
 
export const metadata: Metadata = {
  title: 'DaorsVibes',
  description: 'Sve što je muzičaru potrebno: od štimera i metronoma do kalendara s nastupima i biblioteke akorda.',
}
 
export default function Page() {
  return <HomePage />
}
