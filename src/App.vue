<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Kv from './components/Kv.vue'
import Intro from './components/Intro.vue'
import Speaker from './components/Speaker.vue'
import Agenda from './components/Agenda.vue'
import SignUp from './components/SignUp.vue'
import Traffic from './components/Traffic.vue'
import Event from './components/Event.vue'
import Gototop from './components/Gototop.vue'
import SignUpFiexd from './components/SignUpFiexd.vue'
import Faq from './components/Faq.vue'

import infoData from './assets/json/info.json'
import speakers from './assets/json/speaker.json'
import { createSeoPayload, siteConfig } from './seo/siteSeo'
import { applySeo } from './seo/applySeo'

const seo = createSeoPayload({ infoData, speakers });
applySeo(seo);

</script>

<template>
  <Header :menu="infoData.menu" />
  <main id="main-content">
    <section id="kv" class="relative w-full z-20 overflow-hidden" aria-label="2026人資長論壇主視覺">
      <Kv />
    </section>
    <section id="intro" class="relative w-full z-10" aria-label="活動前言">
      <Intro :infoData="infoData.content[0]" />
    </section>
    <section>
      <img src="./assets/image/waves-green.png" alt="綠色波浪裝飾" class="w-full">
    </section>
    <section id="agenda" class="relative w-full z-20 overflow-hidden" aria-label="活動資訊">
      <Agenda :infoData="infoData.content[1]" />
      <div class="dot_bg"></div>
    </section>
    <section id="speaker" class="relative w-full z-10" aria-label="講者陣容">
      <Speaker :speakers="speakers.data" :infoData="infoData.content[2]"/>
      <div class="dot_bg"></div>
    </section>
    <section id="signUp" class="relative w-full z-20 overflow-hidden" aria-label="立即報名">
      <SignUp :infoData="infoData.content[3]" />
      <div class="dot_bg"></div>
    </section>
    <Faq v-if="siteConfig.showVisibleFaqSection" :faqs="seo.faqs" />
    <section id="traffic" class="relative w-full z-40 overflow-hidden" aria-label="交通資訊">
      <Traffic :infoData="infoData.content[4]" />
      <div class="dot_bg traffic"></div>
    </section>
    <section>
      <img src="./assets/image/waves-b.png" alt="藍色波浪裝飾" class="w-full">
    </section>
    <section id="event" class="relative w-full z-40 overflow-hidden" aria-label="歷屆回顧與合作單位">
      <Event :infoData="infoData.content[5]" />
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

#intro{
    padding: 90px 55px;
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
  z-index: -1;
}
.dot_bg.traffic{
  top: none;
  bottom: 0;
  height: 150%;
  transform: rotate(180deg);
}

#agenda{
  background: linear-gradient(to top, #00b79c 0%, #65e0bf 100%);
}

#signUp{
  background: linear-gradient(to top, #2894e5 0%, #3bbcf4 100%);
}

#gift{
  background-color: #f1f1ef;
}

#traffic{
  background: linear-gradient(to top, #2894e5 0%, #2894e5 100%);
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
}
</style>
