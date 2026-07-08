// frontend/src/pages/Home.jsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Features />
    </div>
  )
}

export default Home