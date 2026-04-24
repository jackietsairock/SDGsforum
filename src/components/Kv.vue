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
    <div :class="['kv_area', { 'pc': windowWidth >= 1024 }, { 'mb': windowWidth < 1024}]">
        <p class="sr-only">
            2026人資長論壇主題為 AI新世代人才永續新篇章，活動將於 2026 年 4 月 29 日在陽明交通大學國際會議廳舉行。
        </p>
        <div class="kv_box" :style="{ width: setDivResize.width + 'px', height: setDivResize.height + 'px' }" data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000">
            <img class="kv-img01" src="../assets/image/kv-img01.png" alt="2026人資長論壇主視覺標題">
            <img class="kv-img02" src="../assets/image/kv-img02.png" alt="AI新世代人才永續新篇章活動視覺">
        </div>
    </div>
</template>

<style scoped>
    .kv_area{
        position: relative;
        display: block;
        width: 100%;
        height: 100vh;
        background: url('../assets/image/bg-kv.jpg') bottom center no-repeat;
        background-size: cover;
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
    }

    .kv-img01{
        position: absolute;
        display: block;
        z-index: 2;
        width: 55%;
        left: 0;
        top: -18%;
        margin: 0 auto;
    }

    .kv-img02{
        position: absolute;
        display: block;
        width: 45%;
        right: 0;
        top: 0%;
        margin: 0 auto;
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
            background: url('../assets/image/bg-kv2.jpg') center center no-repeat;
            background-size: cover;
        }

        .kv_area.mb{
            min-height: 1355px;
        }

        .kv_box {
            top: -9%;
        }

        .kv-img01{
            width: 100%;
            top: -5%;
            right: 0;
        }
        .kv-img02{
            width: 80%;
            top: 70%;
            left: 0;
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
