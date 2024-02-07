import logo from './logo.svg';
import './App.css';
import AuthComponent from './AuthComp';
import Google from './Google';
import { createContext, useState,useEffect } from 'react';
import { BrowserRouter, Link,Route, Routes, useNavigate } from 'react-router-dom';
import WeatherChart from './WeatherChart';
import LocationComponent from './Location';
import Home from './Home';
import { app } from './firebase';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import User from './User';
import NavBar from './Navbar';
import Btn from './Btn';
import { Button, ChakraProvider, Heading, Icon } from '@chakra-ui/react';
import Login from './Login';
import Signup from './Signup';
import toast, { Toaster } from 'react-hot-toast';
import { FaLocationDot } from 'react-icons/fa6';
const Appstate = createContext();
function App() {
  const auth = getAuth(app);
  const [userId,setUserId] = useState('');
  const [userdetails,setUserDetails] = useState({});
  const [login,setLogin] = useState(false);
  const [location,setLocation] = useState({latitude:'27',longitude:'78'})
  function loggedIn(isIn,name){
    setLogin(isIn);
    // if(isIn)
    // toast.success(`Registered Successfully as ${name}`,{icon:'✅',style:{backgroundColor:'black',color:'white'}});
  }
  function Logout(){
    auth.signOut();
    setLogin(false);
  toast(`You've been Logged Out!`,{icon:'📤',style:{backgroundColor:'black',color:'white'}});
}
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user) loggedIn(true); // Update the user state based on authentication state changes
        else loggedIn(false);
    });
    return () => {
        unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
    };
}, []);
  useEffect(() => {
    // Fetch the weather data here
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m`);
        const data = await response.json();
        setWeatherData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
    
  }, [location]);
  // const history = useNavigate();
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
    <Appstate.Provider value={{userdetails,setUserDetails,userId,login,loggedIn,setUserId,weatherData,setLocation,Logout}}>
      <BrowserRouter>
      <Toaster/>
      {/* <Btn/> */}
      <div className="App" style={{overflowX:'hidden',height:'100vh',backgroundColor:'white',color:'black'}}>
      <NavBar/>
      {login && (<><Heading>Get Weather of your current location</Heading>
      <Button bg='skyblue' onClick={handleGetLocation}><Icon as={FaLocationDot}/> Current Location </Button></>)}

      {/* <Google/>
      <AuthComponent/> */}
      <Routes>
      {!login && <Route path="/register" element={<Signup/>}/>}
        {login&&<Route path="/home" element={<Home/>}/>}
        {login&&<Route path="/weather" element={<WeatherChart/>}/>}
        {login&&<Route path="/table" element={<User/>}/>}
        {login?<Route path="/login" element={<Login/>}/>:<Route path="/login" element={<h1>Already LoggedIn</h1>}/>}
        {login?<Route path="/register" element={<Signup/>}/>:<Route path="/login" element={<h1>Already LoggedIn</h1>}/>}
        {login===false&&<Route path="*" element={<Login/>}/>}
      </Routes>
    </div>
    
    {/* <p>{weatherData ? weatherData.generationtime_ms:"Nhi aaya"}</p>
    <Link to={'weather'}>See Weather</Link>
    <Link to={'home'}>Home</Link>
    <LocationComponent/>
    {login?<h1>LoggedIn!  </h1>:<h1>No Log found!</h1>} */}
    
    </BrowserRouter>
    </Appstate.Provider>
  );
}
export {Appstate}
export default App;
