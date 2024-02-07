import React, { useState } from 'react'
import WeatherChart from './WeatherChart'
import LocationComponent from './Location';

export default function Home() {
    const [users,setUsers] = useState([]);
    return(
        <div>
          <WeatherChart/>
       </div>
    )
}
