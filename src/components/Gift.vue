<script setup>
import { computed } from 'vue'

const props = defineProps({
    infoData: {
        type: Object,
        default: () => ({})
    }
})

const giftInfo = computed(() => props.infoData?.giftInfo ?? {})
const giftSections = computed(() => giftInfo.value?.info ?? [])

const giftImageUrl = computed(() => {
    const imagePath = giftInfo.value?.img
    if (!imagePath) return ''

    if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith('data:')) {
        return imagePath
    }

    const fileName = imagePath.split('/').filter(Boolean).pop()
    if (!fileName) return ''

    return new URL(`../assets/image/${fileName}`, import.meta.url).href
})

const getDetails = (item) => {
    const detail = item?.info?.detail
    return Array.isArray(detail) ? detail : detail ? [detail] : []
}
</script>

<template>
    <div class="content_wrap z-10">
        <div class="gift_box max-w-[1366px] pl-10 pr-10 pb-10 mx-auto">
            <div class="gift_grid">
                <div class="gift_image_wrap">
                    <img
                        v-if="giftImageUrl"
                        :src="giftImageUrl"
                        alt="抽獎禮品"
                        class="gift_image"
                    />
                </div>

                <div class="gift_text_wrap">
                    <section
                        v-for="(section, sectionIndex) in giftSections"
                        :key="sectionIndex"
                        class="gift_section"
                    >
                        <div
                            :class="[
                                'gift_section_title',
                                { 'gift_section_title--highlight': sectionIndex > 0 },
                            ]"
                            v-html="section.title"
                        ></div>

                        <div
                            v-for="(description, descriptionIndex) in section.description"
                            :key="descriptionIndex"
                            class="gift_description"
                        >
                            <p v-if="description.label" class="gift_badge">{{ description.label }}</p>

                            <ul v-if="description.info?.type === 'list-dot'" class="gift_list">
                                <li
                                    v-for="(line, lineIndex) in getDetails(description)"
                                    :key="lineIndex"
                                    class="gift_list_item text-base sm:text-xl"
                                >
                                    {{ line }}
                                </li>
                            </ul>

                            <div v-else class="gift_text_group">
                                <p
                                    v-for="(line, lineIndex) in getDetails(description)"
                                    :key="lineIndex"
                                    class="gift_text text-base sm:text-xl"
                                >
                                    {{ line }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.gift_grid {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 0.95fr);
    align-items: center;
    gap: 72px;
}

.gift_image {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2.8;
    object-fit: cover;
    border-radius: 56px;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);
    margin-left: 0rem;
    transform: scale(1);
}

.gift_text_wrap {
    display: flex;
    flex-direction: column;
    gap: 48px;
    color: #666;
}

.gift_section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.gift_section_title {
    color: #167f74;
    font-size: 58px;
    line-height: 1.22;
    font-weight: 700;
    letter-spacing: 0.08em;
}

.gift_section_title :deep(p) {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
    color: inherit;
    letter-spacing: inherit;
}

.gift_section_title--highlight {
    font-size: 2rem;
    color: #a0ce2d;
    letter-spacing: 0.12em;
}

.gift_description {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.gift_badge {
    display: inline-block;
    width: fit-content;
    border-radius: 9999px;
    padding: 6px 18px;
    background-color: #a8d82f;
    color: #167f74;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.4;
}

.gift_list,
.gift_text_group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.gift_list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.gift_list_item,
.gift_text {
    margin: 0;
    color: #676767;
    line-height: 1.65;
    letter-spacing: 0.05em;
}

.gift_list_item {
    position: relative;
    padding-left: 1.15em;
}

.gift_list_item::before {
    content: '・';
    position: absolute;
    top: 0;
    left: 0;
}

@media screen and (max-width: 1200px) {

    .gift_image{
        margin-left: -6rem;
        transform: scale(1.2);
    }

    .gift_grid {
        gap: 44px;
    }

    .gift_section_title {
        font-size: 52px;
    }


    .gift_section_title--highlight {
        font-size: 2rem;
    }

    .gift_badge {
        font-size: 20px;
    }

}

@media screen and (max-width: 1024px) {
    
    .gift_grid {
        grid-template-columns: 1fr;
        gap: 40px;
        align-items: start;
    }

    .gift_image {
        border-radius: 48px;
        aspect-ratio: 16 / 10;
        margin-left: auto;
        transform: scale(1);
    }

    .gift_text_wrap {
        gap: 34px;
    }

    .gift_section {
        gap: 14px;
    }

    .gift_section_title {
        font-size: clamp(44px, 6vw, 56px);
    }

    .gift_section_title--highlight {
        font-size: 1.5rem;
        letter-spacing: 0.09em;
    }

    .gift_badge {
        font-size: clamp(17px, 2.7vw, 20px);
        padding: 6px 16px;
    }

    .gift_list_item,
    .gift_text {
        letter-spacing: 0.04em;
    }
}

@media screen and (max-width: 768px) {

    .gift_grid {
        gap: 30px;
    }

    .gift_image {
        border-radius: 36px;
    }

    .gift_text_wrap {
        gap: 28px;
    }

    .gift_section_title {
        font-size: 2.5rem;
        letter-spacing: 0.06em;
    }

    .gift_section_title--highlight {
        font-size: 1.7rem;
        letter-spacing: 0.04em;
    }

    .gift_badge {
        font-size: 16px;
    }

    .gift_list,
    .gift_text_group {
        gap: 10px;
    }

    .gift_list_item,
    .gift_text {
        line-height: 1.7;
        letter-spacing: 0.03em;
    }
}
</style>
