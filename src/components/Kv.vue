<script setup>
    import AOS from 'aos'
    import 'aos/dist/aos.css'

    import { getWindowWidth, getDivResize } from '../utils/utils'
    import { ref, onMounted, onUnmounted } from 'vue'

    const windowWidth = ref(0);
    const setDivResize = ref({});

    function handleResize() {
        windowWidth.value = getWindowWidth();
        setDivResize.value = getDivResize('.kv_area');

        // console.log('setDivResize:', setDivResize.value.width);
        // console.log('setDivResize:', setDivResize.value.height);
    }

    onMounted(() => {
        AOS.init()
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });

</script>

<template>
    <div :class="['kv_area bg-[#f9f9f9]', { 'pc': windowWidth >= 1024 }, { 'mb': windowWidth < 1024}]">
        <p class="sr-only">
            2026人資長論壇主題為 AI新世代人才永續新篇章，活動將於 2026 年 4 月 29 日在陽明交通大學國際會議廳舉行。
        </p>
        <div class="kv_box" :style="{ width: setDivResize.width + 'px', height: setDivResize.height + 'px' }" data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000">
            <img class="bigtext" :style="{ display: windowWidth >= 1024 ? 'block' : 'none'}" src="../assets/image/bigtext.png" alt="2026永續城市交流論壇主視覺標題">
            <img class="phonetext" :style="{ display: windowWidth < 1024 ? 'block' : 'none'}" src="../assets/image/phonetext.png" alt="2026永續城市交流論壇主視覺標題">
        </div>
        <img src="../assets/image/scroll.png" alt="scroll_down" class="scroll_down">
    </div>
</template>

<style scoped>
    .kv_area{
        position: relative;
        display: block;
        width: 100%;
        height: 100vh;
        background: url('../assets/image/big-main.jpg') center center no-repeat;
        background-size: cover;
    }

    .kv_area::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 96px;
        z-index: 1;
        pointer-events: none;
        background: linear-gradient(to bottom, rgba(249, 249, 249, 0), rgba(249, 249, 249, 0.74));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 38%, #000 100%);
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 38%, #000 100%);
    }

    .kv_area.pc{
        min-height: 580px;
    }

    .kv_box{
        position: absolute;
        display: block;
        /* border: 1px solid #000; */
        left: 0;
        right: 0;
        top: 5%;
        bottom: 0;
        margin: auto;
        z-index: 2;
    }

    .bigtext{
        position: absolute;
        display: block;
        z-index: 2;
        width: 75%;
        left: 0%;
        top: 10%;
        margin: 0 auto;
    }

    .phonetext{
        position: absolute;
        display: block;
        z-index: 2;
        width: 100%;
        left: 0;
        top: 5%;
        margin: 0 auto;
    }

    .scroll_down{
        position: absolute;
        display: block;
        z-index: 2;
        width: 40px;
        left: 0;
        right: 0;
        bottom: 20px;
        margin: auto;
        animation: scrollDownAnim 1.5s ease-in-out infinite;
    }
    @keyframes scrollDownAnim {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        50% {
            transform: translateY(10px);
            opacity: 0.5;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @media screen and (max-width:1366px) {
        /* .kv_box {
            top: -10%;
        } */
    }

    @media screen and (max-width:1280px) {
        /* .kv_box {
            top: -5%;
        } */
    }

    @media screen and (max-width:1024px) {
        .kv_area{
            background: url('../assets/image/phone-main.jpg') center center no-repeat;
            background-size: cover;
        }

        .kv_area::after{
            height: 72px;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }

        .kv_area.mb{
            min-height: 1355px;
        }

        .kv_box {
            top: -9%;
        }

        .bigtext{
            width: 100%;
            top: -5%;
            right: 0;
        }
       
    }

    @media screen and (max-width:820px) {
        .kv_area.mb{
            min-height: 1125px;
        }
    }

    @media screen and (max-width: 768px) {
        .kv_area.mb{
            min-height: 667px;
        }
    }
</style>
