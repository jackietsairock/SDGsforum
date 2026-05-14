<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false);

function handleScroll() {
  show.value = window.scrollY > 200
}

function goToSignUp() {
    const el = document.getElementById('signUp')
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
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
    @click="goToSignUp"
    class="fixed bottom-30 right-2 z-52 hover:opacity-80 sm:right-5"
    aria-label="到報名頁面"
  >
    <img class="w-[55px] sm:w-[70px]" src="../assets/image/signup.png" alt="sign_up_fiexd_btn">
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>