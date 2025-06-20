 
import { useEffect, useRef, useState } from 'react'
import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'

const VantaBackground = () => {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          color: 0x172b4d,
          backgroundColor: 0xf5f6f8,
          points: 10,
          maxDistance: 20,
          spacing: 15
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full -z-10" />
}

export default VantaBackground
