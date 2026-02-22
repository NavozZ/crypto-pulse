import { useState } from 'react'
import Hero from "./components/ui/Hero";
import LivePrices from './components/ui/liveprices';



function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <>
     <main>
        <div className="relative min-h-[60vh]">
          <Hero />
          <LivePrices />
        </div>
        
      </main>
    </>
  )
}

export default HomePage
