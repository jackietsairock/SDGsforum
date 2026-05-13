<script setup>
    import { computed } from 'vue'

    const { infoData } = defineProps(
        {
            infoData: Object
        }
    );

    const headingTag = computed(() => infoData?.tag === 'intro' ? 'h1' : 'h2')
</script>

<template>
    <div :class="['title_area w-full text-center',infoData.tag==='intro' ? 'pb-3 sm:pb-[15px]' : 'pb-0 sm:pb-[0px]']">
        <div :class="['title_box w-fit mx-auto py-5 px-5']">
            <component :is="headingTag" :style="{ color: infoData.titleColor}" :class="['title text-5xl leading-[1.4]']" v-html="infoData.title"></component>
        </div>
    </div>
</template>

<style scoped>
   .title_box{
    background: url('../assets/image/title-text.png') center center no-repeat;
    background-size: contain;
   }
</style>
