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
        <div :class="['title_box w-fit mx-auto','py-5']">
            <div class="title_label w-fit mx-auto rounded-4xl px-5 py-2 bg-[#abda2c] mt-3 mb-5">
                <p :style="{ color: infoData.titleEnColor}" class="title_en text-sm sm:text-base">{{ infoData.titleEn }}</p>
            </div>
            <component :is="headingTag" :style="{ color: infoData.titleColor}" :class="['title text-4xl leading-[1.4]',infoData.tag==='intro' ? 'sm:text-4xl' : 'sm:text-5xl']" v-html="infoData.title"></component>
        </div>
    </div>
</template>

<style scoped>
   
</style>
