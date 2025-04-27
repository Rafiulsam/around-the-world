import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import CountryDetails from "./Pages/CountryDetails "
import useTheme from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-10 p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border transition duration-300 ease-in-out shadow-md hover:shadow-lg"
      >
        {theme === "dark" ? "🌞 Light Mood" : "🌚 Dark Mood"}
      </button>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </>
  )
}

export default App
