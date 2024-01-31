import { useState } from 'react';
import { getCountry } from 'iso-3166-1-alpha-2';
import './App.css';

const weatherAPI = {
  key: "bd41e96005862e68a4d19e822a6fc55ac",
  baseUrl: "https://api.openweathermap.org/data/2.5/"
}
const geoAPI = {
  key: "9bd41e96005862e68a4d19e822a6fc55",
  baseUrl: "https://api.openweathermap.org/geo/1.0/"
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const searchWeather = (citySearchResult) => {
    if (citySearchResult.length === 0) {
      alert('Not found')
      return
    }
    fetch(`${weatherAPI.baseUrl}weather?lat=${citySearchResult[0].lat}&lon=${citySearchResult[0].lon}&units=metric&appid=${geoAPI.key}`)
      .then(res => res.json())
      .then(result => {
          const cityInformations = {
            country: getCountry(citySearchResult[0].country),
            city: citySearchResult[0].name
          }
          result.citySearchResult = cityInformations 
          setWeather(result)
          setQuery('')
    })
  }

  const search = evt => {
    if (evt.key === "Enter") { 
      fetch(`${geoAPI.baseUrl}direct?q=${query}&limit=1&appid=${geoAPI.key}`)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        searchWeather(result)
      })
    }
  }

  const dateBuilder = (d) => `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  return (
    <div className={
      (typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input
            type='text'
            className='search-bar'
            placeholder='Search...'
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDownCapture={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
          <div>
            <div className='location-box'>
              <div className='location'>{weather.citySearchResult.city}, {weather.citySearchResult.country || weather.sys.country}</div>
              <div className='date'>{dateBuilder(new Date())}</div>
            </div>
            <div className='weather-box'>
              <div className='temp'>{Math.round(weather.main.temp)}°C</div>
              <div className='weather'>Sunny</div>
            </div>
          </div> 
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
