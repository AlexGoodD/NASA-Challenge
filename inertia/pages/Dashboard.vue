<script setup lang="ts">
import Card from '~/components/UI/Card.vue'
import ProbabilityChart from '~/components/Dashboard/ProbabilityChart.vue'
import TrendGraph from '~/components/Dashboard/TrendGraph.vue'
import WeatherCard from '~/components/Dashboard/WeatherCard.vue'
import MapSelector from '~/components/Map/MapSelector.vue'
import UvIndex from '~/components/Dashboard/UVIndex.vue'
import Humidity from '~/components/Dashboard/Humidity.vue'
import Visibility from '~/components/Dashboard/Visibility.vue'
import AutocompletableSearch from '~/components/AutocompletableSearch.vue'
import { ref, watch } from 'vue'
import { PlacesApiResponse } from '../../services/GoogleMapsService'
import AiPredictor from '~/components/AiPredictor.vue'

const place = ref<PlacesApiResponse['places'][number]>()

watch(place, (_newPlace) => {
  // Handle place change logic here
})
</script>

<template>
  <div class="dashboard">
    <header class="mb-10 mt-5 flex justify-center">
      <AutocompletableSearch v-model="place" />
    </header>

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
        <Card>
          <AiPredictor />
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
</style>
