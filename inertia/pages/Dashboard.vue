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
    <header class="header">
      <!--      <h1>Dhaka, Bangladesh</h1>-->
      <!--      <input type="text" placeholder="Search City" class="search" />-->
    </header>

    <div class="content">
      <div class="left">
        <!--        <MapSelector />-->

        <div class="flex justify-between gap-10">
          <WeatherCard class="w-full" />

          <div class="flex gap-4 w-full">
            <ProbabilityChart />
          </div>
        </div>

        <div class="overview">
          <Card title="Wind Status">
            <TrendGraph />
          </Card>
          <Card title="UV Index">
            <UvIndex />
          </Card>
          <Card title="Humidity">
            <Humidity />
          </Card>
          <Card title="Visibility">
            <Visibility />
          </Card>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="right">
        <!--        <SummaryPanel />-->

        <Card title="Agent" :no-background="true">
          <!--          <CityList />-->
        </Card>
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search {
  background: #1f2937;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
}
.content {
  display: flex;
  margin-top: 1rem;
  gap: 1rem;
}
.left {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.days {
  display: flex;
  gap: 0.5rem;
}
.overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: stretch; /* asegura que las celdas se estiren */
}
</style>
