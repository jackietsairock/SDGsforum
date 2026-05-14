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
    class="fixed bottom-8 w-[65px] h-[65px] right-[4px] z-50 rounded-full text-xl font-bold transition sm:right-[16px] sm:w-[75px] sm:h-[75px]"
    aria-label="回到頂部"
  >
    <img class="arrow_up" src="../assets/image/gototop_btn.png" alt="回到頂部">
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
}

.arrow_up{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
}
</style>
