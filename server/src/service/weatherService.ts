
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';




// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}



// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed; 
    this.humidity = humidity;
  }

}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;

  private apiKey: string;

  

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';

    
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const locationData = await response.json();
      return locationData;

    } catch (err) {
      console.log(err);
    }
  }

  // private destructureLocationData(locationData: Coordinates): Coordinates {
  //   const coordinates: Coordinates = {
  //     lat: locationData.lat,
  //     lon: locationData.lon
  //   }


  //   return coordinates;


  // } // TODO: Create destructureLocationData method
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    const geocodeQuery = path.join(this.baseURL, `geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`)
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    //use corrdinaters to build query for weather using lat and lon
    const weatherQuery = path.join(this.baseURL, `data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`)
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    let coordinates: Coordinates = {
      lat: 0,
      lon: 0
    };
    try {
      const geocodeQuery = this.buildGeocodeQuery(city);
      const coordinateData = await this.fetchLocationData(geocodeQuery);
      // console.log(coordinateData);
      const [{ lat: lattitude }] = coordinateData;
      const [{ lon: longitude }] = coordinateData;
      coordinates = {
        lat: lattitude,
        lon: longitude
      }

      // const coordinates = this.destructureLocationData(coordinatesObject);


    } catch (err) {
      console.log(err);
    }
    return coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates, city: string): Promise<any> {
    //use lat and lon to get weather data using build weather query
    try {
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const response = await fetch(weatherQuery);
      const weatherData = await response.json();
      // console.log(weatherData);
      const weatherForcast = await this.parseCurrentWeather(weatherData, city);

      return weatherForcast;
    } catch (err) {
      console.log(err);
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any, city:string) {
    //take open weather response and create weather object with it
   

    const responseArray = response.list.map((entry: any) => {
      const weatherObject: Weather = {
        city: city,
        date: entry.dt_txt.slice(0,10),
        icon: entry.weather[0].icon,
        iconDescription: entry.weather[0].description,
        tempF: Math.trunc(((entry.main.temp - 273.15)*1.8+32)),
        windSpeed: entry.wind.speed,
        humidity: entry.main.humidity
      }
      
      return weatherObject;
    });
    // console.log(responseArray);
    //may not be right
   

    // return weatherData;
    return responseArray;


  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(weatherData: Promise<any[]>) {
  //   //create array of weather objects for the multiday forcast
  //   //may not be right
  //   console.log(weatherData);
  //   // return [...weatherData];

  // }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    
    let weatherForcast: Weather[] = [];

    // console.log(city);
    const coordinates = await this.fetchAndDestructureLocationData(city);
    // console.log('coordinates:', coordinates);
    const responseArray = await this.fetchWeatherData(coordinates, city);
    
     for (let i = 0; i < 40; i += 8) {
      weatherForcast =  [...weatherForcast, responseArray[i]];
      
    }
    
    // console.log(weatherForcast);

    return weatherForcast;

  }
}

export default new WeatherService();
