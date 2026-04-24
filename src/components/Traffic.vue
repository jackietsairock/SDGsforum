<script setup>
import { computed } from 'vue'

const props = defineProps({
    infoData: {
        type: Object,
        default: () => ({})
    }
})

const trafficInfo = computed(() => props.infoData?.trafficInfo ?? {})
const trafficVenue = computed(() => trafficInfo.value?.info?.[0] ?? {})
const trafficDetails = computed(() => trafficVenue.value?.description ?? [])
const mapUrl = computed(() => trafficInfo.value?.map ?? '')

const isHttpLink = (url = '') => /^https?:\/\//.test(url)

const getDetails = (item) => {
    const detail = item?.info?.detail
    return Array.isArray(detail) ? detail : detail ? [detail] : []
}
</script>

<template>
    <div class="content_wrap z-10">
        <div class="traffic_box max-w-[1366px] pl-10 pr-10 pb-10 mx-auto">
            <div class="traffic_layout">
                <div class="traffic_info_wrap">
                    <div class="traffic_heading">
                        <h3 class="traffic_title">{{ trafficVenue.title }}</h3>
                        <p v-if="trafficVenue.subTitle" class="traffic_subtitle">{{ trafficVenue.subTitle }}</p>
                    </div>

                    <p class="traffic_location text-2xl sm:text-4xl" v-html="trafficVenue.location"></p>

                    <a
                        v-if="trafficVenue.locationUrl?.title"
                        :href="trafficVenue.locationUrl?.url || '#'"
                        class="traffic_link text-xl sm:text-2xl"
                        :target="isHttpLink(trafficVenue.locationUrl?.url) ? '_blank' : undefined"
                        :rel="isHttpLink(trafficVenue.locationUrl?.url) ? 'noopener noreferrer' : undefined"
                    >
                        {{ trafficVenue.locationUrl?.title }}
                    </a>

                    <div class="traffic_detail_group">
                        <div
                            v-for="(item, itemIndex) in trafficDetails"
                            :key="itemIndex"
                            class="traffic_detail_item"
                        >
                            <p class="traffic_badge">{{ item.label }}</p>

                            <ul v-if="item.info?.type === 'list-dot'" class="traffic_list">
                                <li
                                    v-for="(line, lineIndex) in getDetails(item)"
                                    :key="lineIndex"
                                    class="traffic_list_item text-base sm:text-xl"
                                >
                                    {{ line }}
                                </li>
                            </ul>

                            <div v-else class="traffic_text_group">
                                <p
                                    v-for="(line, lineIndex) in getDetails(item)"
                                    :key="lineIndex"
                                    class="traffic_text text-base sm:text-xl"
                                >
                                    {{ line }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="traffic_map_wrap">
                    <iframe
                        v-if="mapUrl"
                        :src="mapUrl"
                        width="100%"
                        height="650px"
                        style="border:0"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="活動地點地圖"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.traffic_layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 72px;
    align-items: center;
}

.traffic_info_wrap {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.traffic_heading {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
}

.traffic_title {
    margin: 0;
    color: #167f74;
    font-size: 58px;
    line-height: 1.14;
    letter-spacing: 0.08em;
    font-weight: 700;
}

.traffic_subtitle {
    margin: 0;
    padding: 12px 12px;
    border-radius: 6px;
    color: #fff;
    background-color: #167f74;
    font-size: 24px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.08em;
}

.traffic_location {
    margin: 0;
    color: #4d4d4d;
    line-height: 1.5;
    letter-spacing: 0.04em;
}

.traffic_location :deep(p) {
    display: inline;
    margin: 0;
    color: inherit;
}

.traffic_link {
    display: inline-block;
    width: fit-content;
    color: #9dd12c;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: 0.04em;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
}

.traffic_detail_group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
}

.traffic_detail_item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.traffic_badge {
    display: inline-block;
    width: fit-content;
    border-radius: 9999px;
    background-color: #a8d82f;
    color: #167f74;
    font-size: 22px;
    line-height: 1;
    font-weight: 700;
    padding: 6px 16px;
}

.traffic_list,
.traffic_text_group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.traffic_list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.traffic_list_item,
.traffic_text {
    margin: 0;
    color: #666;
    line-height: 1.7;
    letter-spacing: 0.04em;
}

.traffic_list_item {
    position: relative;
    padding-left: 1.15em;
}

.traffic_list_item::before {
    content: '・';
    position: absolute;
    top: 0;
    left: 0;
}

.traffic_map_wrap {
    position: relative;
    width: 100%;
    min-height: 650px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
}

@media screen and (max-width: 1200px) {
    .traffic_layout {
        gap: 50px;
    }

    .traffic_title {
        font-size: 56px;
    }

    .traffic_subtitle {
        font-size: 21px;
    }

    .traffic_location :deep(p) {
        font-size: 31px;
    }

    .traffic_badge {
        font-size: 20px;
    }

    .traffic_map_wrap {
        min-height: 560px;
    }
}

@media screen and (max-width: 1024px) {

    .traffic_layout {
        grid-template-columns: 1fr;
        gap: 40px;
        align-items: start;
    }

    .traffic_info_wrap {
        order: 2;
    }

    .traffic_map_wrap {
        order: 1;
        min-height: 430px;
        max-height: 320px;
    }

    .traffic_title {
        font-size: clamp(48px, 6.5vw, 58px);
    }

    .traffic_subtitle {
        font-size: clamp(18px, 2.8vw, 22px);
    }

    .traffic_location :deep(p) {
        font-size: clamp(24px, 3.5vw, 30px);
    }
}

@media screen and (max-width: 768px) {

    .traffic_layout {
        gap: 30px;
    }

    .traffic_map_wrap {
        min-height: 300px;
        max-height: 250px;
    }

    .traffic_info_wrap {
        gap: 14px;
    }

    .traffic_title {
        font-size: 28px;
        letter-spacing: 0.06em;
    }

    .traffic_subtitle {
        font-size: 16px;
        padding: 4px 10px;
    }

    .traffic_location :deep(p) {
        font-size: 16px;
    }

    .traffic_link {
        text-underline-offset: 4px;
    }

    .traffic_detail_group {
        gap: 14px;
        margin-top: 8px;
    }

    .traffic_badge {
        font-size: 16px;
        padding: 5px 13px;
    }

    .traffic_list_item,
    .traffic_text {
        line-height: 1.7;
    }
}
</style>
