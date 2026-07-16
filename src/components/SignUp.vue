<script setup>
import { computed, ref, watch } from 'vue'

import Title from './Title.vue'

const props = defineProps({
    infoData: Object
})

const OTHER_SENTINEL = '__OTHER__'
const LEARNING_HOURS_FIELD = 'Is_civil_servant_learning_hours_required'
const ID_NUMBER_FIELD = 'Id_number'

const form = ref({})
const otherInputs = ref({})
const termsAnchor = ref(null)

const visibleLabels = computed(() =>
    (props.infoData?.label ?? []).filter(isFieldVisible)
)
const personalInfo = computed(() => props.infoData?.personal_info ?? {})
const hasPersonalInfo = computed(() => Boolean(props.infoData?.personal_info))
const showPersonalInfo = computed(() => hasPersonalInfo.value && personalInfo.value.show !== false)
const agreeInputName = computed(() => personalInfo.value.inputName || 'Agree')

const mobileRegex = /^09\d{8}$/
const emailRegex = /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
const nameRegex = /^.{2,30}$/
const idNumberRegex = /^[A-Z][12]\d{8}$/

function isFieldVisible(field) {
    if (field.show === false) return false
    if (!field.showWhen) return true

    return form.value[field.showWhen.inputName] === field.showWhen.equals
}

function createInitialFormState(infoData) {
    // 依照 info.json 的欄位設定建立表單初始值。
    const nextForm = {}

    for (const field of infoData?.label ?? []) {
        if (!field?.inputName) continue

        if (field.type === 'checkbox') {
            nextForm[field.inputName] = (field.label ?? [])
                .filter((option) => option.checked)
                .map((option) => (option.labelName === '其他' ? OTHER_SENTINEL : option.value))
            continue
        }

        if (field.type === 'radio') {
            const defaultOption = (field.label ?? []).find((option) => option.checked)
            nextForm[field.inputName] = field.value ?? defaultOption?.value ?? ''
            continue
        }

        if (field.type === 'select') {
            const defaultOption = (field.option ?? []).find((option) => option.checked) ?? field.option?.[0]
            nextForm[field.inputName] = defaultOption?.value ?? ''
            continue
        }

        nextForm[field.inputName] = field.value ?? ''
    }

    if (infoData?.personal_info) {
        const agreeKey = infoData.personal_info.inputName || 'Agree'
        nextForm[agreeKey] = Boolean(infoData.personal_info.checked)
    }

    return nextForm
}

function createInitialOtherInputs(infoData) {
    // 建立「其他」欄位要使用的文字輸入初始值。
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

watch(
    () => props.infoData,
    (nextInfoData) => {
        form.value = createInitialFormState(nextInfoData)
        otherInputs.value = createInitialOtherInputs(nextInfoData)
    },
    { immediate: true }
)

watch(
    () => form.value[LEARNING_HOURS_FIELD],
    (value) => {
        if (value !== '是') {
            form.value[ID_NUMBER_FIELD] = ''
        }
    }
)

function checkVal() {
    // 送出前依照 info.json 的 required 與欄位格式逐一驗證。
    for (const field of visibleLabels.value) {
        const value = form.value[field.inputName]

        if (field.required && isEmpty(value)) {
            alert(getRequiredMessage(field))
            return
        }

        const formatMessage = getFormatMessage(field, value)
        if (formatMessage) {
            alert(formatMessage)
            return
        }

        if (isOtherSelected(field.inputName) && !getOtherValue(field.inputName)) {
            alert(`請填寫其他${field.tagName}`)
            return
        }
    }

    if (showPersonalInfo.value && personalInfo.value.required && !form.value[agreeInputName.value]) {
        alert(`請勾選${personalInfo.value.tagName || '同意個資蒐集'}`)
        return
    }

    sign_up()
}

function scrollToTerms() {
    // 點擊「個資條款」時，捲動到個資聲明區塊。
    const el = termsAnchor.value
    if (!el) return

    const header = document.querySelector('header')
    const headerHeight = header ? header.getBoundingClientRect().height : 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12

    window.scrollTo({ top, behavior: 'smooth' })
}

function sign_up() {
    // 將表單資料整理成 FormData，送到報名 API。
    const data = new FormData()
    const url = 'https://events.businesstoday.com.tw/backend/SDGsforum2026/sign_up?v=' + new Date().getTime()
    // const url = 'https://events.businesstoday.com.tw/backend/HRforum2026/sign_up?v=' + new Date().getTime()

    for (const key in form.value) {
        const value = form.value[key]

        if (key === agreeInputName.value) {
            data.append(key, value ? '是' : '否')
        } else if (key === ID_NUMBER_FIELD) {
            data.append(key, String(value ?? '').trim().toUpperCase())
        } else if (Array.isArray(value)) {
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
            // console.log('sign_up response:', response)
            if (response.bIsSuccess === 0) {
                alert(response.sError)
            } else {
                alert('感謝您的支持，我們已收到您的報名資訊。本活動採審核制，我們將於活動前一周以簡訊發送【報名結果通知】，活動當日憑簡訊【報到序號】入場，敬請留意手機簡訊。')
                location.href = './index.html'
            }
        })
        .catch(() => {
            alert('系統忙碌中，請稍後再試！')
        })
}

function getOtherValue(key) {
    // 取得指定欄位中「其他」文字輸入的內容。
    return String(otherInputs.value[key] || '').trim()
}

function isEmpty(value) {
    // 判斷欄位值是否為空，支援一般文字與 checkbox 陣列。
    if (Array.isArray(value)) return value.length === 0
    return !String(value ?? '').trim()
}

function isRequiredField(field) {
    // 判斷欄位是否在 info.json 設定為必填。
    return field.required === true
}

function getRequiredMessage(field) {
    // 依欄位類型產生必填未填時的提示文字。
    const action = ['select', 'checkbox', 'radio'].includes(field.type) ? '選擇' : '輸入'
    return `請${action}${field.tagName}`
}

function getFormatMessage(field, value) {
    // 檢查姓名、手機、Email 等欄位格式，錯誤時回傳提示文字。
    const text = String(value ?? '').trim()
    if (!text) return ''

    if (field.inputName === 'Name' && !nameRegex.test(text)) {
        return '姓名長度請輸入2~30字'
    }

    if (field.inputName === 'Cell_phone' && !mobileRegex.test(text)) {
        return '手機請輸入09開頭之連續10碼數字'
    }

    if (field.inputName === 'Email' && !emailRegex.test(text)) {
        return '請填寫正確Email'
    }

    if (field.inputName === ID_NUMBER_FIELD && !isValidIdNumber(text)) {
        return '請填寫正確的身分證字號'
    }

    return ''
}

function isValidIdNumber(value) {
    const normalized = String(value ?? '').trim().toUpperCase()
    if (!idNumberRegex.test(normalized)) return false

    const letterCodes = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34,
        J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
        S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33
    }
    const letterCode = letterCodes[normalized[0]]
    const digits = normalized.slice(1).split('').map(Number)
    const weights = [8, 7, 6, 5, 4, 3, 2, 1, 1]
    const sum = Math.floor(letterCode / 10) + (letterCode % 10) * 9
        + digits.reduce((total, digit, index) => total + digit * weights[index], 0)

    return sum % 10 === 0
}

function getInputType(field) {
    // 依欄位名稱轉成合適的 HTML input type。
    if (field.inputName === 'Email') return 'email'
    if (field.inputName === 'Cell_phone') return 'tel'
    if (field.type === 'number') return 'number'
    return 'text'
}

function getMaxLength(field) {
    // 回傳欄位可輸入的最大長度，目前手機限制為 10 碼。
    return ['Cell_phone', ID_NUMBER_FIELD].includes(field.inputName) ? 10 : undefined
}

function isOtherSelected(key) {
    // 判斷指定欄位是否有選到「其他」選項。
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
            <form class="flex flex-col gap-6 w-full bg-white rounded-4xl p-10" @submit.prevent="checkVal">
                <!-- <div class="sign_up_info_box flex flex-col gap-8 my-10 mx-auto text-center text-[#4e4e5a]">
                    <div v-for="(item, idx) in props.infoData.signUp_info" :key="idx" class="sign_up_info_item flex flex-col items-center gap-4 text-justify sm:text-center">
                        <div class="label_box bg-[#f5c82d] w-fit px-6 py-2 rounded-4xl">
                            <p class="text-base text-[#4e4e5a] font-bold sm:text-lg">{{ item.label }}</p>
                        </div>
                        <p class="text-base leading-relaxed sm:text-lg" v-html="item.detail"></p>
                    </div>
                    <div class="border-t border-dashed border-gray-300 pt-2"></div>
                </div> -->
                <div v-for="(item, idx) in visibleLabels" :key="idx" class="flex flex-col w-full sm:flex-row items-center gap-2">
                    <label class="w-full text-lg font-bold shrink-0 sm:w-64" style="color:#2f3158;"><span v-if="isRequiredField(item)" class="text-red-700">*</span>{{ item.tagName }}</label>

                    <input
                        v-if="!['select', 'checkbox', 'radio'].includes(item.type)"
                        v-model="form[item.inputName]"
                        :name="item.inputName"
                        :type="getInputType(item)"
                        :min="item.type === 'number' ? 0 : undefined"
                        :maxlength="getMaxLength(item)"
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
                    <div v-else-if="item.type === 'radio'" class="w-full flex-1 flex flex-wrap gap-6">
                        <label v-for="(opt, oidx) in item.label" :key="oidx" class="flex items-center gap-2 text-sm sm:text-base">
                            <input
                                v-model="form[item.inputName]"
                                type="radio"
                                :name="item.inputName"
                                :value="opt.value"
                                class="h-4 w-4"
                            />
                            <span class="text-black">{{ opt.labelName }}</span>
                        </label>
                    </div>
                    <div v-else class="w-full flex-1 flex flex-col gap-2">
                        <select v-model="form[item.inputName]" :name="item.inputName" class="w-full p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none">
                            <option v-for="(opt, idx) in item.option" :key="idx" :value="opt.value">{{ opt.optionName }}</option>
                        </select>
                        <input
                            v-if="isOtherSelected(item.inputName)"
                            v-model="otherInputs[item.inputName]"
                            type="text"
                            class="w-full p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none"
                            :placeholder="`請輸入${item.tagName}`"
                        />
                    </div>
                </div>
                <div v-if="showPersonalInfo && (personalInfo.title || personalInfo.detail)" id="agree-terms" ref="termsAnchor" class="flex flex-col gap-2 mt-2 p-5" style="background-color: #e6e6e6; color:#464646;">
                    <div v-if="showPersonalInfo" class="agree_box">
                        <input v-model="form[agreeInputName]" type="checkbox" id="agree" :name="agreeInputName" class="" />
                        <label for="agree" class="text-lg ml-1" style="color:#464646;">
                            我同意下列條款
                        </label>
                    </div>
                    <p v-if="personalInfo.title" class="text-sm font-bold">{{ personalInfo.title }}</p>
                    <p v-if="personalInfo.detail" class="text-sm leading-snug text-justify" v-html="personalInfo.detail"></p>
                </div>
                <button type="submit" class="w-fit mx-auto mt-4 hover:cursor-pointer">
                    <img class="w-full h-auto sm:w-auto sm:h-[55px]" src="../assets/image/signup2.png" alt="立即報名圖示">
                </button>
                <!-- <div class="sign_up_info_box w-full flex flex-col gap-8 my-10 mx-auto text-justify text-[#4e4e5a] sm:text-center">
                    <div class="border-t border-dashed border-gray-300 pt-2 pb-2"></div>
                    <p class="text-base text-[#676767] sm:text-lg" v-html="props.infoData.notice"></p>
                </div> -->
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
