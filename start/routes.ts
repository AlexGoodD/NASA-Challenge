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

// Ruta que recibe lat, lon, fecha y devuelve probabilidades de condiciones adversas
router.get('/', [WeatherController, 'index'])

// Ruta que devuelve datos históricos resumisdos (ej. últimos 20 años) para una latitud y longitud dadas

// Ruta que devuelve tendencias (ej "cada vez mas calor en julio en los últimos 20 años")

// Ruta que descarga en CSV/JSON los datos de la consulta

// Ruta de prueba para saber si el backend esta funcionando
