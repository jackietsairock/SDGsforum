<script setup>
import { computed } from 'vue'
import { VSlickCarousel } from 'v-slick-carousel'
import 'v-slick-carousel/style.css'
import Title from './Title.vue'

const props = defineProps({
    infoData: {
        type: Object,
        default: () => ({})
    }
});

const brandGroups = computed(() => (Array.isArray(props.infoData?.brandGroups) ? props.infoData.brandGroups : []));

const isExternalUrl = (url = '') => /^(https?:)?\/\//.test(url) || url.startsWith('data:');

const getLogoImgUrl = (imgPath = '') => {
    if (!imgPath) {
        return ''
    }

    if (isExternalUrl(imgPath)) {
        return imgPath
    }

    const fileName = imgPath.split('/').filter(Boolean).pop()
    if (!fileName) {
        return ''
    }

    return new URL(`../assets/image/${fileName}`, import.meta.url).href
}

const getGroupItems = (group) => (Array.isArray(group?.items) ? group.items : []);

const eventSliderSettings = {
    arrows: true,
    infinite: true,
    infiniteLoopOnEdge: true,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    groupsToShow: 1,
    groupsToScroll: 1,
    slidesPerGroup: 1,
    speed: 500,
    responsiveBehavior: 'mobile-first',
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                groupsToShow: 2
            }
        }
    ]
}
</script>

<template>
    <div class="content_wrap z-20">
        <Title :infoData="infoData" />
        <div class="event_box max-w-[1366px] p-10 mx-auto mb-10 sm:mb-50">
            <div class="event_warp">
                <VSlickCarousel class="event_slider" v-bind="eventSliderSettings">
                    <template #prevArrow="arrowSlotProps">
                        <button
                            type="button"
                            :class="['event_arrow', 'event_arrow_prev', { 'is-disabled': !arrowSlotProps.disabled }]"
                            :disabled="!arrowSlotProps.disabled"
                            @click="arrowSlotProps.onClick()"
                            aria-label="上一張"
                        >
                            <span class="event_arrow_icon"></span>
                        </button>
                    </template>
                    <template #nextArrow="arrowSlotProps">
                        <button
                            type="button"
                            :class="['event_arrow', 'event_arrow_next', { 'is-disabled': !arrowSlotProps.disabled }]"
                            :disabled="!arrowSlotProps.disabled"
                            @click="arrowSlotProps.onClick()"
                            aria-label="下一張"
                        >
                            <span class="event_arrow_icon"></span>
                        </button>
                    </template>
                    <div class="event_slide">
                        <div class="event_img_box flex items-center justify-center overflow-hidden">
                            <a href="https://events.businesstoday.com.tw/2023/HRforum/" @dragstart.prevent>
                                <img src="../assets/image/event_img_2023.png" alt="2023 人資長論壇活動回顧" class="max-w-full h-auto object-contain" draggable="false" @dragstart.prevent>
                            </a>
                        </div>
                    </div>
                    <div class="event_slide">
                        <div class="event_img_box flex items-center justify-center overflow-hidden">
                            <a href="https://events.businesstoday.com.tw/2024/HRforum/" @dragstart.prevent>
                                <img src="../assets/image/event_img_2024.png" alt="2024 人資長論壇活動回顧" class="max-w-full h-auto object-contain" draggable="false" @dragstart.prevent>
                            </a>
                        </div>
                    </div>
                    <div class="event_slide">
                        <div class="event_img_box flex items-center justify-center overflow-hidden">
                            <a href="https://events.businesstoday.com.tw/2025/HRforum/" @dragstart.prevent>
                                <img src="../assets/image/event_img_2025.png" alt="2025 人資長論壇活動回顧" class="max-w-full h-auto object-contain" draggable="false" @dragstart.prevent>
                            </a>
                        </div>
                    </div>
                </VSlickCarousel>
            </div>
        </div>
        <div class="logo_wrap flex flex-col gap-18 w-full mx-auto px-8 sm:gap-20 xl:px-0">
            <div
                v-for="(group, groupIndex) in brandGroups"
                :key="`brand-group-${groupIndex}`"
                class="brand_group flex flex-col gap-5 lg:flex-row"
            >
                <p class="block py-2 mt-[0px] pl-3 pr-3 border-r-0 border-black h-fit whitespace-nowrap text-xl tracking-[0rem] text-black text-center lg:border-r-2 lg:tracking-[0.25rem] lg:pl-12 lg:text-md lg:mt-[10px] lg:pr-8" v-html="group.title">
                </p>
                <div class="brand_wrap flex flex-row flex-wrap items-center justify-center gap-5 lg:justify-start">
                    <a
                        v-for="(item, itemIndex) in getGroupItems(group)"
                        :key="`brand-item-${groupIndex}-${itemIndex}`"
                        class="logo_item h-fit"
                        :href="item.href || 'javascript:;'"
                        :target="item.target || undefined"
                        :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined"
                    >
                        <img :src="getLogoImgUrl(item.img)" :class="item.imgClass" :alt="item.alt || ''">
                    </a>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
    .logo_item:hover{
        cursor: pointer;
    }
    .event_warp{
        --event-arrow-bg: #9cdc2e;
        --event-arrow-border: #8acb1f;
        --event-arrow-icon: #0f7f83;
        position: relative;
        padding: 0 24px;
    }
    .event_slider :deep(.v-slick-list){
        margin: 0 -12px;
        cursor: grab;
    }
    .event_slider :deep(.v-slick-list:active){
        cursor: grabbing;
    }
    .event_slide{
        padding: 0 12px;
    }
    .event_slider :deep(.v-slick-arrow){
        width: 48px;
        height: 128px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 4;
    }
    .event_slider :deep(.v-slick-prev){
        left: 0;
    }
    .event_slider :deep(.v-slick-next){
        right: 0;
    }
    .event_slider :deep(.v-slick-arrow:before){
        content: none;
    }
    .event_arrow{
        position: absolute;
        z-index: 2;
        top: 50%;
        transform: translateY(-50%);
        width: 25px;
        height: 60px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--event-arrow-bg);
        box-shadow: none;
        border-radius: 0;
        cursor: pointer;
    }
    .event_arrow.is-disabled{
        opacity: 0.4;
        cursor: not-allowed;
    }
    .event_arrow_icon{
        display: inline-block;
        width: 14px;
        height: 14px;
        border-right: 4px solid var(--event-arrow-icon);
        border-bottom: 4px solid var(--event-arrow-icon);
    }
    .event_arrow_prev .event_arrow_icon{
        transform: rotate(135deg);
        margin-left: 4px;
    }
    .event_arrow_prev {
        left: -15px;
    }
    .event_arrow_next .event_arrow_icon{
        transform: rotate(-45deg);
        margin-right: 4px;
    }
    .event_arrow_next{
        right: -15px;
    }
    .event_img_box:hover{
        transform: scale(1.01);
        transition: all 0.3s ease-in-out;
    }

    .event_img_box a{
        display: block;
        border-bottom: 6px solid #03cea3;
        overflow: hidden;
        user-select: none;
        -webkit-user-drag: none;
    }
    .event_img_box img{
        width: 100%;
        user-select: none;
        -webkit-user-drag: none;
    }

    .b0{ 
        height: 75px;
        margin: 10px;
    }
    .b1-half{ 
        height: 67.5px;
        margin: 10px;
    }
    .b1{ 
        height: 65px;
        margin: 10px;
    }
    .b2-half{ 
        height: 57.5px;
        margin: 10px;
    }
    .b2{ 
        height: 55px;
        margin: 10px;
    }
    .b3-half{ 
        height: 50px;
        margin: 10px;
    }
    .b3{ 
        height: 45px;
        margin: 10px;
    }
    .b4-half{ 
        height: 40px;
        margin: 10px;
    }
    .b4{ 
        height: 35px;
        margin: 10px;
    }
    .b5-half{ 
        height: 30px;
        margin: 10px;
    }
    .b5{ 
        height: 25px;
        margin: 10px;
    }
    .b6-half{ 
        height: 22.5px;
        margin: 10px;
    }
    .b6{ 
        height: 20px;
        margin: 10px;
    }

    @media screen and (max-width: 840px) {
            .event_warp{
                padding: 0 16px;
            }
            .event_slider :deep(.v-slick-list){
                margin: 0 -8px;
            }
            .event_slide{
                padding: 0 8px;
            }
            .event_slider :deep(.v-slick-arrow){
                width: 40px;
                height: 108px;
            }
            .event_slider :deep(.v-slick-prev){
                left: 0;
            }
            .event_slider :deep(.v-slick-next){
                right: 0;
            }
            .event_arrow_icon{
                width: 12px;
                height: 12px;
                border-right-width: 3px;
                border-bottom-width: 3px;
            }
            .b0{ 
                height: 60px;
                margin: 5px;
            }
            .b1-half{ 
                height: 52.5px;
                margin: 5px;
            }
            .b1{ 
                height: 50px;
                margin: 5px;
            }
            .b2-half{ 
                height: 42.5px;
                margin: 5px;
            }
            .b2{ 
                height: 40px;
                margin: 5px;
            }
            .b3-half{ 
                height: 37.5px;
                margin: 5px;
            }
            .b3{ 
                height: 35px;
                margin: 5px;
            }
            .b4-half{ 
                height: 32.5px;
                margin: 5px;
            }
            .b4{ 
                height: 30px;
                margin: 5px;
            }
            .b5-half{ 
                height: 27.5px;
                margin: 5px;
            }
            .b5{ 
                height: 25px;
                margin: 5px;
            }
            .b6-half{ 
                height: 22.5px;
                margin: 5px;
            }
            .b6{ 
                height: 20px;
                margin: 5px;
            }
    }
</style>
