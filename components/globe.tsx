"use client";

import React, { useEffect, useState } from "react";
import { getData } from "../app/actions/get-data"; // Ensure the path to getData is correct
import Globe from "react-globe.gl"; // Direct import without dynamic imports

export const GlobeComponent = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Fetch the GDP data
    getData()
      .then((data) => {
        setCountriesData(data);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });

    // Set dimensions based on window size
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

  // Render a loading indicator until dimensions are set
  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Globe
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg" // Night-time texture for continents only
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png" // Starry background to enhance the night effect
      labelsData={countriesData}
      labelLat={(d) => +d.Latitude}
      labelLng={(d) => +d.Longitude}
      labelText={(d) => d.Country}
      labelSize={(d) => Math.sqrt(+d.GDP) / 1200000} // Adjust size for smaller, consistent labels
      labelDotRadius={(d) => Math.sqrt(+d.GDP) / 1200000} // Adjust dot size to match labels
      labelColor={() => "rgba(255, 165, 0, 0.9)"} // Bright orange/yellow for prominent visibility
      labelResolution={2}
      enablePointerInteraction={false} // Disable pointer interactions for a clean look
    />
  );
};
