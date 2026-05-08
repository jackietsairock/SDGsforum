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

const seo = createSeoPayload({ infoData, speakers })
applySeo(seo)

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
    <section id="agenda" class="relative w-full z-20 overflow-hidden" aria-label="活動議程">
      <Agenda :infoData="infoData.content[1]" />
      <div class="speaker_bg"></div>
    </section>
    <section id="speaker" class="relative w-full z-10" aria-label="講者陣容">
      <Speaker :speakers="speakers.data" :infoData="infoData.content[2]"/>
      <div class="speaker_bg speaker_set_bg"></div>
    </section>
    <section id="signUp" class="relative w-full z-20 overflow-hidden" aria-label="立即報名">
      <SignUp :infoData="infoData.content[3]" />
      <div class="speaker_bg signUp_bg"></div>
    </section>
    <Faq v-if="siteConfig.showVisibleFaqSection" :faqs="seo.faqs" />
    <section id="traffic" class="relative w-full z-40 overflow-hidden" aria-label="交通資訊">
      <Traffic :infoData="infoData.content[4]" />
    </section>
    <section id="event" class="relative w-full z-40 overflow-hidden" aria-label="歷屆回顧與合作單位">
      <Event :infoData="infoData.content[5]" />
      <div class="speaker_bg event_bg"></div>
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
    background: url('./assets/image/bg-1.jpg') fixed center center no-repeat;
    background-size: cover;
}


#speaker{
   background-color: #fff;
}

.speaker_bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 450px;
  background: url('./assets/image/bg-3.jpg') center center no-repeat;
  background-size: cover;
  z-index: -1;
}

.speaker_bg.signUp_bg{
  height: 650px;
}

#agenda{
  background: url('./assets/image/bg-1.jpg') fixed center center no-repeat;
  background-size: cover;
}

#signUp{
  background: url('./assets/image/bg-1.jpg') fixed center center no-repeat;
  background-size: cover;
}

#gift{
  background-color: #f1f1ef;
}

#traffic{
  background-color: #f1f1ef;
}


@media screen and (max-width: 1024px) {
    .speaker_bg.speaker_set_bg{
      height: 350px;
    }

    .speaker_bg.event_bg{
      height: 350px;
    }
}
</style>
