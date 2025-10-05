/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const WeatherController = () => import('#controllers/WeatherController')
const PlacesController = () => import('#controllers/PlacesController')

// Ruta que recibe lat, lon, fecha y devuelve probabilidades de condiciones adversas
router.get('/', [WeatherController, 'index'])

router.get('/api/places', [PlacesController, 'autocomplete'])
router.get('/api/weather/predict-viability', [WeatherController, 'predictViability'])

// Ruta que devuelve datos históricos resumidos (ej. últimos 20 años) para una latitud y longitud dadas

// Ruta que devuelve tendencias (ej. "cada vez más calor en julio en los últimos 20 años")

// Ruta que descarga en CSV/JSON los datos de la consulta

// Ruta que trae datos al home
router.post('/retrieve-data', [WeatherController, 'search']).as('retrieve.data')