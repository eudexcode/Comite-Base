import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginAndRegister } from "./components/loginAndRegister"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAndRegister />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
