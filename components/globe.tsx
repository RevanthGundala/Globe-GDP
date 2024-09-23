"use client";

import React, { useEffect, useState } from "react";
import { getData } from "../app/actions/get-data"; // Ensure the path to getData is correct
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Define the interface for the data structure
interface CountryData {
  Country: string;
  GDP: number;
  Latitude: number;
  Longitude: number;
}

export const GlobeComponent = () => {
  // Set the types of states using the defined interface
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Fetch the GDP data
    getData()
      .then((data) => {
        setCountriesData(data as CountryData[]);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });

    // Check if window is defined to ensure client-side execution
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      // Update dimensions on window resize
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // If dimensions are not set, render a loading indicator
  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div>Loading...</div>;
  }

  // Ensure that the Globe component only renders on the client side
  if (typeof window === "undefined") return null;

  return (
    <Globe
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg" // Night-time texture for continents only
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png" // Starry background to enhance the night effect
      labelsData={countriesData}
      labelLat={(d) => +(d as CountryData).Latitude} // Use type assertion to CountryData
      labelLng={(d) => +(d as CountryData).Longitude} // Use type assertion to CountryData
      labelText={(d) => (d as CountryData).Country} // Use type assertion to CountryData
      labelSize={(d) => Math.sqrt((d as CountryData).GDP) / 1200000} // Adjust size for smaller, consistent labels
      labelDotRadius={(d) => Math.sqrt((d as CountryData).GDP) / 1200000} // Adjust dot size to match labels
      labelColor={() => "rgba(255, 165, 0, 0.9)"} // Bright orange/yellow for prominent visibility
      labelResolution={2}
      enablePointerInteraction={false} // Disable pointer interactions for a clean look
    />
  );
};
