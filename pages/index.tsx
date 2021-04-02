import dynamic from 'next/dynamic'

const UZnth = dynamic(() => import('components/synth'))

export default function HomePage() {
  return (
    <div>
      {typeof window !== 'undefined' &&
      'SharedArrayBuffer' in window &&
      'AudioWorklet' in window ? (
        <UZnth />
      ) : (
        <div className="fallback-message--div">
          <p>
            This browser does not support the awesome features that power
            u-znth.
          </p>
          <p>
            Please use <span>Google Chrome</span> on a non-iOS device.
          </p>
        </div>
      )}
    </div>
  )
}
