import React from 'react';
import './App.css';
import Weather from './Components/weather.components';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import Form from './Components/form.component';

//api call: api.openweathermap.org/data/2.5/weather?q=London,uk
const API_key = "59d1d255e790d841915ebe196b39a3e8"

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      temp: undefined,
      tempMax: undefined,
      tempMin: undefined,
      description: "",
      error:false
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Fog:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog"
    };
  }

  calCelsius(temp){
    let cel = Math.floor(temp-273.15);
    return cel;
  }

  getWeatherIcon(icons,rangeID){
    switch(true){
      case rangeID >= 200 && rangeID <= 232:
        this.setState({icon: this.weatherIcon.Thunderstorm});
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({icon: this.weatherIcon.Drizzle});
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({icon: this.weatherIcon.Rain});
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({icon: this.weatherIcon.Snow});
        break;
      case rangeID >= 700 && rangeID <= 781:
        this.setState({icon: this.weatherIcon.Fog});
        break;
      case rangeID == 800:
        this.setState({icon: this.weatherIcon.Clear});
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({icon: this.weatherIcon.Clouds});
        break;
      default: this.setState({icon: this.weatherIcon.Clear});
    }
  }

  getWeather = async (e) => {
    
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if(city && country) {
      const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`);

    const response = await api_call.json();

    console.log(response);

    this.setState({
      city: `${response.name},${response.sys.country}`,
      temp: this.calCelsius(response.main.temp),
      tempMax: this.calCelsius(response.main.temp_max),
      tempMin: this.calCelsius(response.main.temp_min),
      description: response.weather[0].description,
      error:false
    });

    this.getWeatherIcon(this.weatherIcon, response.weather[0].id)
    }
    else{
      this.setState({error:true});
    }
  }
  
  state = {}
  render () {
    return (
      <div className="App">
      <Form loadweather={this.getWeather} error={this.state.error}/>
      <Weather 
        city={this.state.city} 
        country={this.state.country} 
        temp={this.state.temp}
        tempMax={this.state.tempMax}
        tempMin={this.state.tempMin}
        description={this.state.description}
        weatherIcon={this.state.icon}
      />
      </div>
    );
  }
}

export default App;
