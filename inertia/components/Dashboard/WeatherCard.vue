<script setup lang="ts">
import Card from '~/components/UI/Card.vue'
</script>

<template>
  <Card>
    <div class="weather">
      <div>
        <h2>16°</h2>
        <p>Real Feel 18°</p>
        <p>Wind NE 6.7 km/h</p>
        <p>Pressure 1008 mb</p>
        <p>Humidity 51%</p>
      </div>
      <div class="icon">
        <img src="" alt="sunny" />
      </div>
    </div>
    <div class="footer">
      <span>Sunrise 5:30</span>
      <span>Sunset 6:45</span>
    </div>
  </Card>
</template>

<style scoped>
.weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon img {
  width: 50px;
}
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
