<script setup>
  import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
  import Title from './Title.vue'

  const props = defineProps({
    speakers: {
      type: Array,
      default: () => []
    },
    infoData: Object
  })

  const isModalOpen = ref(false)
  const activeSpeaker = ref(null)

  function getImgUrl(img) {
    return new URL(`../assets/image/${img}`, import.meta.url).href
  }

  const openModal = (speaker) => {
    activeSpeaker.value = speaker
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    activeSpeaker.value = null
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const lockBodyScroll = (lock) => {
    if (typeof document === 'undefined') {
      return
    }
    document.body.classList.toggle('modal-open', lock)
  }

  watch(isModalOpen, (open) => {
    lockBodyScroll(open)
  })

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    lockBodyScroll(false)
  })

  const normalizeList = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
        .filter((item) => item.length > 0)
    }
    if (typeof value === 'string') {
      const text = value.trim()
      return text.length > 0 ? [text] : []
    }
    return []
  }

  const getSpeakerField = (speaker, fields) => {
    if (!speaker) {
      return null
    }
    const keys = Array.isArray(fields) ? fields : [fields]
    for (const key of keys) {
      const value = speaker[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }
      if (Array.isArray(value) && normalizeList(value).length > 0) {
        return value
      }
    }
    return null
  }

  const normalizeSection = (section) => {
    if (!section || typeof section !== 'object') {
      return null
    }

    const title = typeof section.title === 'string' ? section.title.trim() : ''

    if (typeof section.detail === 'string') {
      const text = section.detail.trim()
      if (!title && !text) {
        return null
      }
      return {
        title,
        mode: 'text',
        text,
        list: []
      }
    }

    const list = normalizeList(section.detail)
    if (!title && list.length === 0) {
      return null
    }

    return {
      title,
      mode: 'list',
      text: '',
      list
    }
  }

  const modalSections = computed(() => {
    const speaker = activeSpeaker.value
    if (!speaker) {
      return []
    }

    const infoSections = Array.isArray(speaker.info)
      ? speaker.info.map((section) => normalizeSection(section)).filter(Boolean)
      : []

    if (infoSections.length > 0) {
      return infoSections
    }

    return [
      { title: '現職', detail: getSpeakerField(speaker, 'job') },
      { title: '學歷', detail: getSpeakerField(speaker, 'education') },
      { title: '經歷', detail: getSpeakerField(speaker, 'experience') },
      { title: '證照', detail: getSpeakerField(speaker, ['Certificate', 'certificate']) },
      { title: '個人簡介', detail: getSpeakerField(speaker, 'description') }
    ]
      .map((section) => normalizeSection(section))
      .filter(Boolean)
  })

  const speakerGroups = computed(() => {
    const groups = []
    for (const speaker of props.speakers || []) {
      const type = speaker.type || '未分類'
      const group = groups.find((entry) => entry.type === type)
      if (group) {
        group.items.push(speaker)
      } else {
        groups.push({ type, items: [speaker] })
      }
    }
    return groups
  });

</script>

<template>
  <div class="content_wrap">
    <Title :infoData="infoData" />
    <!--<p class="text-black text-base text-center mb-6">*順序依議程表排列</p>-->
    <div v-for="(group, idx)  in speakerGroups" :key="group.type" :class="['speaker_group',{'mb-15': idx === 0}]">
      <!--<p class="text-4xl text-center ms:text-6xl" :style="['font-weight: 500;',{color: idx === 0 ? 'rgb(93, 246, 254)' : 'rgb(63, 154, 209)'}]">- {{ group.type }} -</p>-->
      <div class="speaker_box max-w-[1366px] p-0 mx-auto flex flex-row flex-wrap items-start justify-center gap-[25px] sm:p-10 sm:gap-[35px] sm:flex-row sm:items-start">
        <div v-for="(item, idx) in group.items" :key="`${group.type}-${idx}`" class="speaker_item text-left flex flex-col items-center py-5 px-1 w-[33%] sm:px-5 lg:w-[18%]"
          role="button"
          tabindex="0"
          @click="openModal(item)"
          @keyup.enter="openModal(item)"
        >
          <div class="speaker_img relative mb-3 overflow-hidden">
            <img :src="getImgUrl(item.img)" :alt="item.name" />
            <div class="absolute z-10 bottom-2 left-2 right-0 bg-white w-fit px-4 py-2">
              <h3 class="speaker_name text-xl font-bold mb-1 sm:text-2xl tracking-[0.2em]" :style="{ color: item.color }">{{ item.name }}</h3>
              <h3 class="speaker_name_en text-xs font-bold sm:text-sm" :style="{ color: item.color }">{{ item.name_en }}</h3>
            </div>
          </div>
          <div class="speaker_text w-full">
            <p class="text-xs sm:text-sm md:text-base lg:text-lg " v-html="item.title"></p>
          </div>
          <div
            class="speaker_button w-full text-left mt-4 hover:cursor-pointer hover:opacity-90"
          >
            <p class="text-xs blcok bg-black text-white w-fit px-1 py-1 rounded-sm sm:text-sm sm:px-5">個人簡介</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <teleport to="body">
    <transition name="fade">
      <div
        v-if="isModalOpen && activeSpeaker"
        class="modal_backdrop"
        :style="{ backgroundColor: activeSpeaker.color ? `${activeSpeaker.color}50` : 'rgba(0, 0, 0, 0.2)' }"
        @click.self="closeModal"
      >
        <div class="modal_panel">
          <button class="modal_close z-20" type="button" @click="closeModal" aria-label="關閉視窗">
            ×
          </button>

          <div class="modal_content">
            <div class="modal_image">
              <img :src="getImgUrl(activeSpeaker.img)" :alt="activeSpeaker.name" />
            </div>
            <div class="modal_info">
              <h3 class="modal_name">{{ activeSpeaker.name }}</h3>
              <p class="modal_title" :style="{borderBottom: `5px solid ${activeSpeaker.color}`}" v-html="activeSpeaker.title"></p>

              <div
                v-for="(section, sectionIdx) in modalSections"
                :key="`section-${sectionIdx}`"
                class="modal_section"
              >
                <h4 v-if="section.title">{{ section.title }}</h4>
                <ul v-if="section.mode === 'list' && section.list.length">
                  <li v-for="(detail, detailIdx) in section.list" :key="`detail-${sectionIdx}-${detailIdx}`">
                    {{ detail }}
                  </li>
                </ul>
                <p v-else-if="section.mode === 'text' && section.text" class="modal_description">
                  {{ section.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
    .speaker_item:hover{
      transform: translateY(-4px);
      transition: transform 0.3s ease;
      cursor: pointer;
    }

    .speaker_text h3{
      color: #484848;
    }

    .speaker_text p{
      color: #000;
    }

    .modal_backdrop{
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 2000;
      overflow-y: auto;
      overscroll-behavior: contain;
      min-height: 100vh;
    }

    .modal_panel{
      position: relative;
      background: #fff;
      max-width: 960px;
      width: 100%;
      padding: 48px 56px;
      box-shadow: 0 24px 48px rgba(9, 19, 79, 0.25);
      max-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    @supports (height: 100dvh){
      .modal_backdrop{
        min-height: 100dvh;
      }

      .modal_panel{
        max-height: calc(100dvh - 48px);
      }
    }

    .modal_close{
      position: absolute;
      top: 16px;
      right: 16px;
      border: none;
      background: transparent;
      font-size: 32px;
      cursor: pointer;
      line-height: 1;
      color: #484848;
    }

    .modal_content{
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-right: 12px;
    }

    .modal_image{
      flex-shrink: 0;
      overflow: hidden;
    }

    .modal_image img{
      width: 240px;
      height: auto;
      box-shadow: 0 12px 24px rgba(9, 19, 79, 0.15);
    }

    .modal_info{
      flex: 1;
      color: #484848;
    }

    .modal_name{
      font-size: 32px;
      line-height: 1.2;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .modal_title{
      font-size: 18px;
      color: #7b7b7b;
      margin-bottom: 24px;
      padding-bottom: 24px;
    }

    .modal_section{
      margin-bottom: 24px;
      text-align: left;
    }

    .modal_section h4{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #484848;
    }

    .modal_section ul{
      margin: 0;
      padding-left: 20px;
      list-style: disc;
      color: #2b2c56;
      line-height: 1.8;
    }

    .modal_description{
      font-size: 16px;
      line-height: 1.7;
      color: #2b2c56;
      white-space: pre-line;
      text-align: left;
    }

    .fade-enter-active,
    .fade-leave-active{
      transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to{
      opacity: 0;
    }

    :global(body.modal-open){
      overflow: hidden;
    }

    @media screen and (max-width: 1024px) {
      .modal_panel{
        padding: 32px 24px;
      }

      .modal_content{
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-right: 0;
      }

      .modal_info{
        width: 100%;
      }

      .modal_section ul{
        padding-left: 0;
        list-style: none;
      }
    }

    @media screen and (max-width: 640px) {
      .modal_backdrop{
        align-items: flex-start;
        padding: 16px 12px;
        padding-top: calc(env(safe-area-inset-top) + 16px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
      }

      .modal_image img{
        width: 180px;
      }

      .modal_name{
        font-size: 26px;
      }

      .modal_title{
        font-size: 16px;
      }

      .modal_panel{
        padding: 24px 16px;
        padding-top: calc(env(safe-area-inset-top) + 16px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
        max-height: none;
        height: calc(100vh - 32px);
      }

      @supports (height: 100dvh){
        .modal_panel{
          height: calc(100dvh - 32px);
        }
      }
    }

</style>
