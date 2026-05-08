<script setup>

    import { ref, onMounted, onUnmounted } from 'vue'
    
    import Title from './Title.vue'

    import { getWindowWidth } from '../utils/utils'
    

    defineProps(
        {
            infoData: Object
        }
    );

    const width = ref(0);

    function handleResize() {
        width.value = getWindowWidth()
    }

    onMounted(() => {
        window.addEventListener('resize', handleResize)
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    });


</script>

<template>
    <div class="content_wrap z-10">
        <div class="intro_box bg-[#f9f9f9] max-w-[1200px] z-20 p-10 mx-auto rounded-2xl shadow-lg">
            <Title :infoData="infoData" />
            <div :class="['intro_text','intro_text3' , { 'pc': width >= 1200 }, { 'mb': width < 1200}]">
                <p class="text-[#4a4a4a] mb-10 text-xl sm:text-2xl" v-html="infoData.text[0]"></p>
                <p class="text-[#4a4a4a] mb-10 text-xl sm:text-2xl" v-html="infoData.text[1]"></p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .intro_text{
        position: relative;
        display: block;
        font-weight: 400;
        margin-bottom: 1.5rem;
        letter-spacing: 3px;
        text-align: center;
        // border: 1px solid #000;
        width: 80%;
        margin: 0 auto;
    }
    .intro_text p{
        line-height: 1.8;
    }
    .intro_text3.pc :deep(br){
        display: block;
    }


    @media screen and (max-width: 1200px) {
        .intro_text3.mb :deep(br){
            display: none;
        }
        
    }
    @media screen and (max-width: 1024px) {
        .intro_text{
            width: 100%;
            margin-bottom: 1.2rem;
            letter-spacing: 2px;
            text-align: justify;
        }
       
    }

    @media screen and (max-width: 768px) {
       
    }
</style>
