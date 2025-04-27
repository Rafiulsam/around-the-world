import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import CountryDetails from "./Pages/CountryDetails "

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}/>
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </>
  )
}

export default App
