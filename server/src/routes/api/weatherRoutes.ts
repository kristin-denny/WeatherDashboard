import express, { type Request, type Response } from 'express';
const router = express();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  //pass request to the wether service 
  
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400);
    } else {
      const weatherForcast = await WeatherService.getWeatherForCity(cityName);
      await HistoryService.addCity(cityName);
      return res.json(weatherForcast);
  }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
  // TODO: save city to search history

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  //req.params
  try {
    await HistoryService.removeCity(req.params.id);
    console.log('delete', req.params.id)
    return res.json("City Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

export default router;
