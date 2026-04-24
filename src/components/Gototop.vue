<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

function handleScroll() {
  show.value = window.scrollY > 200
}

function goToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
});
</script>

<template>
  <button
    v-if="show"
    @click="goToTop"
    class="fixed border-4 border-white bottom-8 w-[45px] h-[45px] right-[12px] z-50 rounded-full text-xl font-bold transition sm:right-[26px] sm:w-[55px] sm:h-[55px]"
    aria-label="回到頂部"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="#207560" d="M297.4 169.4C309.9 156.9 330.2 156.9 342.7 169.4L534.7 361.4C547.2 373.9 547.2 394.2 534.7 406.7C522.2 419.2 501.9 419.2 489.4 406.7L320 237.3L150.6 406.6C138.1 419.1 117.8 419.1 105.3 406.6C92.8 394.1 92.8 373.8 105.3 361.3L297.3 169.3z"/></svg>
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  background-color: #a7d827;
}

.arrow_up{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 60%;
}
</style>
