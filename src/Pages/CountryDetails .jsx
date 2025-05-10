import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingPage from "./LoadingPage";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});



const CountryDetails = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [borderCountries, setBorderCountries] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!country || !country.latlng) return;

        // Initialize the map when the component mounts
        const map = L.map(mapRef.current).setView(country.latlng, 5); // Zoom level 5 is a good starting zoom

        // Add the OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add a marker for the country's location
        L.marker(country.latlng).addTo(map)
            .bindPopup(`<b>${country.name.common}</b>`)
            .openPopup();

        // Cleanup the map on component unmount
        return () => {
            map.remove();
        };
    }, [country]);

    useEffect(() => {
        fetch(`https://restcountries.com/v3.1/alpha/${code}`)
            .then((res) => res.json())
            .then((data) => {
                setCountry(data[0]);
                setLoading(false);
            })
            .catch((err) => console.error("Error fetching country details:", err));
    }, [code]);
    console.log(country);

    useEffect(() => {
        if (country?.borders?.length) {
            fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}`)
                .then((res) => res.json())
                .then((data) => {
                    setBorderCountries(data);
                })
                .catch((err) => console.error("Error fetching borders:", err));
        }
    }, [country]);

    if (loading) {
        return <div className="p-6 text-center"><LoadingPage /></div>;
    }

    if (!country) {
        return <div className="p-6 text-center">Country not found.</div>;
    }

    const {
        name,
        flags,
        population,
        area,
        region,
        subregion,
        capital,
        languages,
        currencies,
        timezones,
        tld
    } = country;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="relative  flex items-center">
                <h1 className=" text-lg font-bold">Around the World</h1>
                <img className="h-4 ml-3" src="/earth.gif" alt="earth" />
            </div>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center my-6 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
                >
                   <IoIosArrowRoundBack /> Back
                </button>
            

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row justify-between items-center gap-10 border rounded-lg p-4 md:p-6 shadow-md bg-gray-100 dark:bg-zinc-800"
            >
                <img
                    src={flags.svg}
                    alt={name.common}
                    className="h-72 object-cover rounded mb-4"
                />
                <div className="space-y-2 md:w-1/2">
                    <h1 className="text-xl md:text-3xl font-bold">{name.common} ({name.official})<span className="ml-2 text-sm text-gray-500">
                        {/* Display the native name if available */}
                        {name.nativeName && name.nativeName[Object.keys(name.nativeName)[0]]?.common}
                    </span> </h1>


                    <div className="text-sm md:text-base grid grid-cols-2 md:gap-4">
                        <p><strong>Population:</strong> {population.toLocaleString()}</p>
                        <p><strong>Area:</strong> {area.toLocaleString()} km²</p>
                        <p><strong>Region:</strong> {region}</p>
                        <p><strong>Subregion:</strong> {subregion}</p>
                        <p><strong>Capital:</strong> {capital?.join(", ")}</p>
                        <p><strong>Timezones:</strong> {timezones?.join(", ")}</p>
                        <p><strong>Languages:</strong> {languages && Object.values(languages).join(", ")}</p>
                        <p><strong>Currencies:</strong> {currencies && Object.values(currencies).map(cur => `${cur.name} (${cur.symbol})`).join(", ")}</p>
                        <p><strong>Top Level Domain:</strong> {tld ?  tld[0] :"N/A"}</p>
                    </div>
                    {borderCountries.length > 0 && (
                        <div className="text-sm md:text-base flex flex-wrap gap-2 mt-4">
                            <strong className="w-full">Border Countries:</strong>
                            {borderCountries.map((border) => (
                                <Link
                                    key={border.cca3}
                                    to={`/country/${border.cca3}`}
                                    className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                                >
                                    {border.name.common}
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="bg-gray-200 dark:bg-zinc-700 p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Location Map</h2>
                        <div
                            ref={mapRef}
                            style={{ width: "100%", height: "200px" }}
                        ></div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default CountryDetails;