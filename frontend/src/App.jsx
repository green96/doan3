// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import Home from './pages/Home'
import Profile from './pages/Profile/Profile.jsx'
import EditProfile from './pages/Profile/EditProfile.jsx'
import './App.css'

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/editprofile" element={<EditProfile />} />
        </Routes>
      </Router>
    </WalletProvider>
  )
}

export default App