// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext.jsx'
import Home from './pages/Home'
import Profile from './pages/Profile/Profile.jsx'
import ViewProfile from './pages/Profile/ViewProfile.jsx'
 
import SendCV from './pages/SendCV.jsx'
import About from './components/About.jsx'
import ViewCV from './components/ViewCV.jsx' // Đảm bảo đã import đúng component này
import './App.css'

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/viewprofile" element={<ViewProfile />}/>
          <Route path="/sendcv" element={<SendCV />} />
<<<<<<< HEAD
          
=======
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/aboutpage" element={<About/>}/>
          
          {/* SỬA TẠI ĐÂY: Thay <About /> bằng <ViewCV /> */}
          <Route path="/viewcv" element={<ViewCV />}/> 
>>>>>>> b5458cbe94caeaa173f327825d5e42c20ae62e4c
        </Routes>
      </Router>
    </WalletProvider>
  )
}

export default App