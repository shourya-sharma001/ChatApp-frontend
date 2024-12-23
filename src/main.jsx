import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router } from 'react-router-dom'
import Wrapper from './components/Wrapper.jsx'

createRoot(document.getElementById('root')).render(

   <Router>
    <Wrapper />
   </Router>
)
