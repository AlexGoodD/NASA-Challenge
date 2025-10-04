<script setup lang="ts">
import CityList from '~/components/Dashboard/CityList.vue'
import Card from '~/components/UI/Card.vue'
import SummaryPanel from '~/components/Dashboard/SummaryPanel.vue'
import ProbabilityChart from '~/components/Dashboard/ProbabilityChart.vue'
import TrendGraph from '~/components/Dashboard/TrendGraph.vue'
import WeatherCard from '~/components/Dashboard/WeatherCard.vue'
import MapSelector from '~/components/Map/MapSelector.vue'
import UvIndex from '~/components/Dashboard/UVIndex.vue'
import Humidity from '~/components/Dashboard/Humidity.vue'
import Visibility from '~/components/Dashboard/Visibility.vue'

const week = [
  { day: 'Sat', temp: 10, icon: '/icons/cloudy.png' },
  { day: 'Sun', temp: 15, icon: '/icons/rain.png' },
  { day: 'Mon', temp: 11, icon: '/icons/snow.png' },
  { day: 'Tue', temp: 10, icon: '/icons/rain.png' },
  { day: 'Wed', temp: 12, icon: '/icons/thunder.png' },
  { day: 'Thu', temp: 10, icon: '/icons/sun.png' },
]
</script>

<template>
  <div class="dashboard">
    <header class="header"></header>

    <div class="grid grid-cols-4 gap-4">
      <div class="grid col-span-3 grid-cols-3 gap-4 *:max-h-70">
        <WeatherCard class="col-span-2" />
        <ProbabilityChart />
        <Card title="Wind Status">
          <TrendGraph />
        </Card>
        <Card title="UV Index">
          <UvIndex />
        </Card>
        <MapSelector place-name="New York, USA" class="row-span-2 max-h-max" />
        <Card title="Humidity">
          <Humidity />
        </Card>
        <Card title="Visibility">
          <Visibility />
        </Card>
      </div>

      <div class="right">
        <Card />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  background: #101012;
  color: white;
  min-height: 100vh;
  padding: 1rem;
}
</style>
