import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home.js"
import EditorPage from './pages/EditorPage.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
