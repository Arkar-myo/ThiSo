import React from 'react'
import FeaturedSongs from '../components/FeaturedSongs'
import HowItWorks from '../components/HowItWorks'
import ContributeSection from '../components/ContributeSection'
import HomeHero from '../components/HomeHero'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HomeHero />
      <FeaturedSongs />
      <HowItWorks />
      <ContributeSection />
    </main>
  )
}