import dynamic from 'next/dynamic'

const UZnth = dynamic(() => import('components/synth'))

export default function HomePage() {
  return (
    <div>
      <UZnth />
    </div>
  )
}
