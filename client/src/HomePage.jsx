import { useState } from 'react'
import Hero from "./components/ui/Hero";



function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <>
     <main>
        <div className="relative min-h-[60vh]">
          <Hero />
        </div>
        
      </main>
    </>
  )
}

export default HomePage
