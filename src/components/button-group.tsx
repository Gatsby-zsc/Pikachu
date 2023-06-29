import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ButtonGroup = () => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showSearch, setshowSearch] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(false);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    setShowInput(false);
    setshowSearch(false);
    setMessage("");

    if (buttonName === "Venue") {
      setMessage("Venue location");
      setshowSearch(true);
      setShowMap(false); // Show the map when Venue button is clicked
      setShowPlaceholder(true); // Display prompt text
    } else if (buttonName === "Online event") {
      setMessage(
        "Online events have unique event pages where you can add links to livestreams and more."
      );
      setShowMap(false); // Hide the map for other buttons
      setShowPlaceholder(false); // Hide the text
    } else if (buttonName === "To be announced") {
      setMessage("");
      setShowMap(false); // Hide the map for other buttons
      setShowPlaceholder(false); // Hide the text
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddress(event.target.value);
    if (event.target.value === "") {
      setShowPlaceholder(true); // Display prompt text
    } else {
      setShowPlaceholder(false); // Hide the text
    }
  };

  const handleSearchLocation = () => {
    // Perform the necessary logic to search the location on Google Maps with the provided address
    // You can use the 'address' state variable here to access the entered address

    // For demonstration purposes, let's log the address to the console
    console.log("Searching address:", address);
  };

  return (
    <div className="All">
      <div className="flex justify-between gap-24">
        <button
          className={`text-24 flex-1 border-2 border-black ${
            selectedButton === "Venue" ? "bg-blue-500 text-white" : "bg-white"
          }`}
          onClick={() => handleButtonClick("Venue")}
        >
          Venue
        </button>
        <button
          className={`text-24 flex-1 border-2 border-black ${
            selectedButton === "Online event"
              ? "bg-blue-500 text-white"
              : "bg-white"
          }`}
          onClick={() => handleButtonClick("Online event")}
        >
          Online event
        </button>
        <button
          className={`text-24 flex-1 border-2 border-black ${
            selectedButton === "To be announced"
              ? "bg-blue-500 text-white"
              : "bg-white"
          }`}
          onClick={() => handleButtonClick("To be announced")}
        >
          To be announced
        </button>
      </div>
      <br />
      <div className="flex flex-col">
        {showInput && (
          <input
            type="text"
            placeholder="Please input"
            value={address}
            onChange={handleSearchInputChange}
          />
        )}

        {message && <p>{message}</p>}
      </div>

      {showMap && (
        <div className="mapContainer">
          <LoadScript
            googleMapsApiKey="AIzaSyB1ULRtR350_PN5clqwuxRrVFdlMX_Za28" // 替换为你自己的 API 密钥
          >
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              center={{ lat: -34.397, lng: 150.644 }}
              zoom={8}
            >
              <Marker position={{ lat: -34.397, lng: 150.644 }} />
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {showSearch && (
        <div className="mx-auto w-2/3">
          <input
            type="text"
            placeholder={showPlaceholder ? "Search venue or address" : ""}
            className="mt-4 w-full border-2 border-gray-300 p-2"
            value={address}
            onChange={handleSearchInputChange}
          />
          <p className="mt-2 text-sm text-gray-500">
            Can&apos;t find what you&apos;re looking for? Add a new venue or
            address.
          </p>
          <button
            className="mt-2 w-full bg-blue-500 px-4 py-2 text-white"
            onClick={handleSearchLocation}
          >
            Search Location
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
