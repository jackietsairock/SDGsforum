<script setup>
import { computed, ref, watch } from 'vue'

import Title from './Title.vue'

const props = defineProps({
    infoData: Object
})

const OTHER_SENTINEL = '__OTHER__'

const form = ref({})
const otherInputs = ref({})
const termsAnchor = ref(null)

const visibleLabels = computed(() =>
    (props.infoData?.label ?? []).filter((item) => item.show !== false)
)

const mobileRegex = /^09\d{8}$/
const emailRegex = /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
const nameRegex = /^.{2,30}$/

function createInitialFormState(infoData) {
    const nextForm = { Agree: false }

    for (const field of infoData?.label ?? []) {
        if (!field?.inputName) continue

        if (field.type === 'checkbox') {
            nextForm[field.inputName] = (field.label ?? [])
                .filter((option) => option.checked)
                .map((option) => (option.labelName === '其他' ? OTHER_SENTINEL : option.value))
            continue
        }

        if (field.type === 'select') {
            const defaultOption = (field.option ?? []).find((option) => option.checked) ?? field.option?.[0]
            nextForm[field.inputName] = defaultOption?.value ?? ''
            continue
        }

        nextForm[field.inputName] = field.value ?? ''
    }

    return nextForm
}

function createInitialOtherInputs(infoData) {
    const nextOtherInputs = {}

    for (const field of infoData?.label ?? []) {
        const hasOtherCheckbox = field.type === 'checkbox' && (field.label ?? []).some((option) => option.labelName === '其他')
        const hasOtherSelect = field.type === 'select' && (field.option ?? []).some((option) => option.value === '其他')

        if (hasOtherCheckbox || hasOtherSelect) {
            nextOtherInputs[field.inputName] = ''
        }
    }

    return nextOtherInputs
}

function getFieldConfig(inputName) {
    return (props.infoData?.label ?? []).find((item) => item.inputName === inputName)
}

function shouldValidate(inputName) {
    const field = getFieldConfig(inputName)
    return Boolean(field && field.show !== false)
}

watch(
    () => props.infoData,
    (nextInfoData) => {
        form.value = createInitialFormState(nextInfoData)
        otherInputs.value = createInitialOtherInputs(nextInfoData)
    },
    { immediate: true }
)

function checkVal() {
    if (shouldValidate('Company_name') && !form.value.Company_name) {
        alert('請輸入您的所屬企業')
        return
    } else if (shouldValidate('Department') && !form.value.Department) {
        alert('請輸入您的部門')
        return
    } else if (shouldValidate('Job_title') && !form.value.Job_title?.length) {
        alert('請選擇您的職稱')
        return
    } else if (shouldValidate('Industry') && !form.value.Industry) {
        alert('請選擇所述產業')
        return
    } else if (shouldValidate('Industry') && isOtherSelected('Industry') && !getOtherValue('Industry')) {
        alert('請填寫其他產業')
        return
    } else if (shouldValidate('Name') && !form.value.Name) {
        alert('請輸入姓名')
        return
    } else if (shouldValidate('Name') && !nameRegex.test(form.value.Name)) {
        alert('姓名長度請輸入2~30字')
        return
    } else if (shouldValidate('Mobile') && !form.value.Mobile) {
        alert('請輸入包含09開頭之連續10碼阿拉伯數字')
        return
    } else if (shouldValidate('Mobile') && !mobileRegex.test(form.value.Mobile)) {
        alert('請輸入包含09開頭之連續10碼阿拉伯數字')
        return
    } else if (shouldValidate('Email') && !form.value.Email) {
        alert('請輸入電子信箱')
        return
    } else if (shouldValidate('Email') && !emailRegex.test(form.value.Email)) {
        alert('請填寫正確電子郵件')
        return
    } else if (shouldValidate('Sessions') && !form.value.Sessions?.length) {
        alert('請選擇報名場次')
        return
    } else if (shouldValidate('Job_title') && isOtherSelected('Job_title') && !getOtherValue('Job_title')) {
        alert('請填寫其他職稱')
        return
    } else if (form.value.Agree === false) {
        alert('請同意報名條款')
        return
    }

    sign_up()
}

function scrollToTerms() {
    const el = termsAnchor.value
    if (!el) return

    const header = document.querySelector('header')
    const headerHeight = header ? header.getBoundingClientRect().height : 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12

    window.scrollTo({ top, behavior: 'smooth' })
}

function sign_up() {
    const data = new FormData()
    const url = 'https://events.businesstoday.com.tw/backend/HRforum2026/sign_up?v=' + new Date().getTime()

    for (const key in form.value) {
        const value = form.value[key]

        if (Array.isArray(value)) {
            const normalized = value
                .map((item) => (item === OTHER_SENTINEL ? getOtherValue(key) : item))
                .filter((item) => item)

            data.append(key, normalized.join(','))
        } else {
            const normalized = value === '其他' ? (getOtherValue(key) || value) : value
            data.append(key, normalized)
        }
    }

    fetch(url, {
        method: 'POST',
        body: data
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.bIsSignUpSuccess === '0') {
                alert(response.sError)
            } else {
                alert('感謝報名，審核通過將於報名後5個工作天內，收到email及 簡訊通知報名成功，並於4/27~28 簡訊發送報到序號，敬請留意手機簡訊通知。')
                location.href = './index.html'
            }
        })
        .catch(() => {
            alert('系統忙碌中，請稍後再試！')
        })
}

function getOtherValue(key) {
    return String(otherInputs.value[key] || '').trim()
}

function isOtherSelected(key) {
    const value = form.value[key]

    if (Array.isArray(value)) {
        return value.includes(OTHER_SENTINEL)
    }

    return value === '其他'
}
</script>

<template>
    <div class="content_wrap">
        <Title :infoData="props.infoData" />
        <div class="signUp_box max-w-[1366px] pl-10 pr-10 pb-10 mx-auto">
            <!--<p class="text-center text-white font-bold text-5xl sm:text-9xl" style="letter-spacing: 3px;">SIGN UP</p>-->
            <div class="event_info_box flex flex-col gap-4 my-10 w-fit mx-auto">
                <div v-for="(item, idx) in props.infoData.event_info" :key="idx" class="event_info_item flex flex-col items-start gap-4 sm:items-center sm:flex-row sm:gap-8">
                    <div class="event_info_label">
                        <div class="label_box bg-[#28c8a2] w-fit px-5 py-2 rounded-4xl">
                            <p class="text-lg text-[#303136] font-bold sm:text-2xl">{{ item.label }}</p>
                        </div>
                    </div>
                    <div class="event_info_value flex flex-col gap-3 text-left mb-5 sm:mb-0">
                        <p class="text-2xl text-[#2ac9a9] font-bold sm:text-4xl" v-html="item.title"></p>
                        <p class="text-sm text-[#2e362b] sm:text-base">{{item.detail}}</p>
                    </div>
                </div>
            </div>
            <form class="flex flex-col gap-6 w-full bg-white rounded-4xl p-10" @submit.prevent="checkVal">
                <div class="sign_up_info_box flex flex-col gap-8 my-10 mx-auto text-center text-[#4e4e5a]">
                    <div v-for="(item, idx) in props.infoData.signUp_info" :key="idx" class="sign_up_info_item flex flex-col items-center gap-4 text-justify sm:text-center">
                        <div class="label_box bg-[#f5c82d] w-fit px-6 py-2 rounded-4xl">
                            <p class="text-base text-[#4e4e5a] font-bold sm:text-lg">{{ item.label }}</p>
                        </div>
                        <p class="text-base leading-relaxed sm:text-lg" v-html="item.detail"></p>
                    </div>
                    <div class="border-t border-dashed border-gray-300 pt-2"></div>
                </div>
                <div v-for="(item, idx) in visibleLabels" :key="idx" class="flex flex-col w-full sm:flex-row items-center gap-2">
                    <label class="w-full text-lg font-bold shrink-0 sm:w-24" style="color:#2f3158;"><span class="text-red-700">*</span>{{ item.tagName }}</label>

                    <input
                        v-if="item.type !== 'select' && item.type !== 'checkbox'"
                        v-model="form[item.inputName]"
                        :name="item.inputName"
                        :type="item.type"
                        :min="item.type === 'number' ? 0 : undefined"
                        :maxlength="item.inputName === 'Mobile' ? 10 : undefined"
                        class="w-full flex-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <div v-else-if="item.type === 'checkbox'" class="w-full flex-1 flex flex-wrap gap-4">
                        <label v-for="(opt, oidx) in item.label" :key="oidx" class="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                v-model="form[item.inputName]"
                                type="checkbox"
                                :name="item.inputName"
                                :value="opt.labelName === '其他' ? OTHER_SENTINEL : opt.value"
                                class="h-4 w-4"
                            />
                            <span class="text-black">{{ opt.labelName }}</span>
                            <input
                                v-if="opt.labelName === '其他'"
                                v-model="otherInputs[item.inputName]"
                                type="text"
                                :disabled="!isOtherSelected(item.inputName)"
                                class="ml-1 text-black w-40 border-b border-gray-400 bg-transparent text-sm focus:outline-none"
                                :placeholder="`請輸入${item.tagName}`"
                            />
                        </label>
                    </div>
                    <div v-else class="w-full flex-1 flex flex-col gap-2">
                        <select v-model="form[item.inputName]" :name="item.inputName" class="w-full p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none">
                            <option v-for="(opt, idx) in item.option" :key="idx" :value="opt.value">{{ opt.optionName }}</option>
                        </select>
                        <input
                            v-if="item.inputName === 'Industry' && isOtherSelected(item.inputName)"
                            v-model="otherInputs[item.inputName]"
                            type="text"
                            class="w-full p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none"
                            :placeholder="`請輸入${item.tagName}`"
                        />
                    </div>
                </div>
                <div class="flex items-start gap-2 mt-2 p-5" style="background-color: #e6e6e6;">
                    <label id="agree-terms" ref="termsAnchor" for="agree" class="text-sm leading-tight" style="color:#464646;">
                        <span class="block text-base font-bold">{{ props.infoData.personal_info.title }}</span>
                        <span class="block text-sm leading-snug mt-2 text-justify" v-html="props.infoData.personal_info.detail"></span>
                    </label>
                </div>
                <div class="agree_box mx-auto">
                    <input v-model="form.Agree" type="checkbox" id="agree" class="" />
                    <label for="agree" class="text-lg ml-1" style="color:#464646;">我已閱讀<a href="#agree-terms" class="personal_information_terms_text text-red-700" @click.stop.prevent="scrollToTerms">個資條款</a>且同意送出資料</label>
                </div>
                <button type="submit" class="w-fit px-15 bg-[#f5c82d] rounded-4xl mx-auto mt-4 py-2 transition hover:cursor-pointer">
                    <p class="text-lg tracking-[.15em] text-[#4e4e5a] font-bold">送出報名</p>
                </button>
                <div class="sign_up_info_box w-full flex flex-col gap-8 my-10 mx-auto text-justify text-[#4e4e5a] sm:text-center">
                    <div class="border-t border-dashed border-gray-300 pt-2 pb-2"></div>
                    <p class="text-base text-[#676767] sm:text-lg" v-html="props.infoData.notice"></p>
                </div>
                <!-- <div class="text-[#2f3158] text-center font-bold text-2xl border-2 border-dashed border-[#2f3158] rounded-2xl p-10">
                    <h2>報名額滿，感謝支持!</h2>
                </div> -->
            </form>
        </div>
    </div>

</template>

<style scoped>
    form{
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
</style>
