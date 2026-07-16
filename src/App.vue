<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Kv from './components/Kv.vue'
import Intro from './components/Intro.vue'
import Agenda from './components/Agenda.vue'
import SignUp from './components/SignUp.vue'
import Traffic from './components/Traffic.vue'
import Event from './components/Event.vue'
import Gototop from './components/Gototop.vue'
import SignUpFiexd from './components/SignUpFiexd.vue'

import infoData from './assets/json/info.json'
import { createSeoPayload } from './seo/siteSeo'
import { applySeo } from './seo/applySeo'

const seo = createSeoPayload({ infoData });
applySeo(seo);

const getContentByType = (cmsType, fallbackIndex) => {
  const sections = Array.isArray(infoData.content) ? infoData.content : []
  return sections.find((item) => item.cmsType === cmsType) ?? sections[fallbackIndex] ?? {}
}

const introInfo = getContentByType('intro', 0)
const agendaInfo = getContentByType('agenda', 1)
const signUpInfo = getContentByType('signUp', 3)
const trafficInfo = getContentByType('traffic', 4)
const eventInfo = getContentByType('event', 5)

</script>

<template>
  <Header :menu="infoData.menu" />
  <main id="main-content">
    <section id="kv" class="relative w-full z-20 overflow-hidden" aria-label="2026 SDGs永續城市交流論壇主視覺">
      <Kv />
    </section>
    <section id="intro" class="relative w-full z-10" aria-label="活動前言">
      <Intro :infoData="introInfo" />
    </section>
    <section>
      <img src="./assets/image/waves-green.png" alt="綠色波浪裝飾" class="w-full">
    </section>
    <section id="agenda" class="relative w-full z-20 overflow-hidden" aria-label="活動資訊">
      <Agenda :infoData="agendaInfo" />
      <img src="./assets/image/circles_small.png" alt="散狀物件-左" class="object-left">
      <img src="./assets/image/circles_big.png" alt="散狀物件-右" class="object-right object-right1">
      <div class="dot_bg"></div>
    </section>
    <section id="signUp" class="relative w-full z-21 overflow-x-hidden" aria-label="立即報名">
      <SignUp :infoData="signUpInfo" />
      <img src="./assets/image/circles_small.png" alt="散狀物件-左" class="object-left">
      <img src="./assets/image/circles_big.png" alt="散狀物件-右" class="object-right object-right2">
      <div class="dot_bg"></div>
    </section>
    <section id="traffic" class="relative w-full z-20 overflow-hidden" aria-label="交通資訊">
      <Traffic :infoData="trafficInfo" />
      <div class="dot_bg traffic"></div>
    </section>
    <section>
      <img src="./assets/image/waves-b.png" alt="藍色波浪裝飾" class="w-full">
    </section>
    <section id="event" class="relative w-full z-40 overflow-hidden" aria-label="歷屆回顧與合作單位">
      <Event :infoData="eventInfo" />
    </section>
    <section>
      <img src="./assets/image/waves-gray.png" alt="灰色波浪裝飾" class="w-full">
    </section>
  </main>
  <Footer :footerInfo="infoData.footer" />
  <SignUpFiexd />
  <Gototop />


</template>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#main-content {
  overflow-x: clip;
}

#intro{
    padding: 90px 10px;
}


#speaker{
   background-color: #f1f1f1;
}

.dot_bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('./assets/image/dots-w.png') center center no-repeat;
  background-size: cover;
  z-index: -3;
}
.dot_bg.traffic{
  top: none;
  bottom: 0;
  height: 150%;
  transform: rotate(180deg);
}

.object-left{
  position: absolute;
  top: 5rem;
  left: -10rem;
  width: 20%;
  height: auto;
  z-index: -1;
}

.object-right{
  position: absolute;
  right: -21%;
  width: 38%;
  height: auto;
  z-index: -1;
}
.object-right1{
  bottom: 1rem;
}
.object-right2{
  bottom: -14rem;
}


#agenda{
  background: linear-gradient(to top, #00b79c 0%, #65e0bf 100%);
}

#signUp{
  overflow: visible;
  background: linear-gradient(to top, #2894e5 0%, #3bbcf4 100%);
}

#gift{
  background-color: #f1f1ef;
}

#traffic{
  background: linear-gradient(to top, #2894e5 0%, #2894e5 100%);
}

@media screen and (max-width: 1366px) {
  .object-right2{
    display: none;
  }
}

@media screen and (max-width: 1024px) {
  .dot_bg{
    background: url('./assets/image/dots-b.png') center center no-repeat;
    background-size: cover;
  }

  .dot_bg.traffic{
    background: url('./assets/image/dots-b.png') center center no-repeat;
    background-size: cover;
    top: none;
    bottom: 0;
    transform: rotate(0);
    height: 200%;
  }

  .object-left{
    display: none;
  }

  .object-right{
    display: none;
  }
}
</style>
