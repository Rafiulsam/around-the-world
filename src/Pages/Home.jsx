import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const countriesPerPage = 12;

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data)
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err)
        setLoading(false);
      });
  }, []);

  const filteredAndSorted = countries
    .filter((country) =>
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.common.localeCompare(b.name.common);
      } else if (sortBy === "population") {
        return b.population - a.population;
      } else if (sortBy === "area") {
        return b.area - a.area;
      }
      return 0;
    });

  // Calculate the countries to show based on the current page
  const offset = currentPage * countriesPerPage;
  const currentCountries = filteredAndSorted.slice(offset, offset + countriesPerPage);

  // Handle page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected); 
  };

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-center items-center">
        <h1 className=" text-2xl md:text-4xl font-bold text-center my-10">Around the World</h1>
        <img className="h-8 md:h-12 ml-3" src="./earth.gif" alt="earth" />
      </div>
      <div className="flex flex-col justify-center md:flex-row mb-10 md:mb-20 gap-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by country name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 p-2 border rounded w-80 dark:bg-zinc-800"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((prev) => !prev)}
            className="md:p-2 text-sm md:text-base md:border md:bg-gray-100 md:dark:bg-zinc-800 rounded text-left flex items-center gap-3"
          >
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            <FaAngleDown className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showSortMenu && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-1 bg-black/30 backdrop-blur-sm border-black rounded shadow-lg z-10 md:w-full"
              >
                {["name", "population", "area"].map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortMenu(false);
                    }}
                    className={`p-2 text-white hover:bg-gray-800 cursor-pointer ${sortBy === option ? "font-semibold" : ""}`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (<div className="col-span-full text-center text-lg md:text-2xl font-semibold dark:text-white">
    Loading Countries please wait...
  </div>):(currentCountries.length=== 0 ? (<div className="col-span-full text-center text-2xl font-semibold dark:text-white">
      No countries found.
    </div>) : (currentCountries.map((country, index) => (
          <Link to={`/country/${country.cca3}`} key={index}>
            <motion.div
              className="border rounded p-4 shadow-sm hover:shadow-lg bg-gray-100 dark:bg-zinc-800 dark:hover:shadow-lg dark:hover:shadow-gray-500 h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
            >
              <img
                src={country.flags.svg}
                alt={country.name.common}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{country.name.common}</h2>
              <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Region:</strong> {country.region}</p>
              <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
            </motion.div>
          </Link>
        ))))}
      </div>

      {/* Pagination controls using React Paginate */}
      <div className="mt-20 w-full px-4">
  <ReactPaginate
    previousLabel={"←"}
    nextLabel={"→"}
    breakLabel={"..."}
    pageCount={Math.ceil(filteredAndSorted.length / countriesPerPage)}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName="flex flex-wrap justify-center items-center gap-1 text-sm sm:gap-2"
    pageClassName="px-2 py-1 border rounded text-xs sm:px-3 sm:py-1.5"
    previousClassName="px-2 py-1 border rounded text-xs sm:px-3 sm:py-1.5"
    nextClassName="px-2 py-1 border rounded text-xs sm:px-3 sm:py-1.5"
    activeClassName="bg-gray-500 text-white"
  />
</div>
    </div>
  );
};

export default Home;