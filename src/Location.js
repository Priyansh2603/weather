import React, { useContext } from 'react';
import { Appstate } from './App';
import { Button, Icon } from '@chakra-ui/react';
import { FaLocationDot } from "react-icons/fa6";
const LocationComponent = () => {
    const {setLocation} = useContext(Appstate)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          setLocation({latitude:latitude,longitude:longitude})
          // Now you can use latitude and longitude to do further processing
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <h1>Get Weather By Current Location</h1>
      <Button onClick={handleGetLocation}> <Icon as={FaLocationDot} boxSize={4}/> Current Location</Button>
    </div>
  );
};

export default LocationComponent;
