<script setup>
    import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

    const props = defineProps(
        {
            menu: {
                type: Array,
                default: () => []
            }
        }
    );

    // 定義一個狀態來控制選單的開啟或關閉
    const isMenuOpen = ref(false)
    const activeTagUrl = ref('')
    const menuItems = computed(() => props.menu ?? [])

    // 切換選單的開啟狀態
    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
    }

    const getHeaderOffset = () => {
        const header = document.querySelector('header')
        const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0
        return headerHeight
    }

    const getHashMenuItems = () => menuItems.value.filter((item) => item.tagUrl?.startsWith('#'))

    const updateActiveTag = () => {
        const hashItems = getHashMenuItems()

        if (!hashItems.length) {
            activeTagUrl.value = ''
            return
        }

        const scrollPosition = window.scrollY + getHeaderOffset() + 12
        let currentTagUrl = hashItems[0].tagUrl

        hashItems.forEach((item) => {
            const section = document.querySelector(item.tagUrl)

            if (!section) {
                return
            }

            const sectionTop = section.getBoundingClientRect().top + window.scrollY

            if (scrollPosition >= sectionTop) {
                currentTagUrl = item.tagUrl
            }
        })

        activeTagUrl.value = currentTagUrl
    }

    let ticking = false

    const handleScroll = () => {
        if (ticking) {
            return
        }

        ticking = true
        window.requestAnimationFrame(() => {
            updateActiveTag()
            ticking = false
        })
    }

    const handleClick = (tagUrl, event) => {
        isMenuOpen.value = false;
        activeTagUrl.value = tagUrl

        if (!tagUrl?.startsWith('#')) {
            return
        }

        const target = document.querySelector(tagUrl)
        if (!target) {
            return
        }

        event?.preventDefault()
        const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset()

        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: 'smooth'
        })

        history.replaceState(null, '', tagUrl)
    }

    onMounted(() => {
        activeTagUrl.value = window.location.hash || getHashMenuItems()[0]?.tagUrl || ''
        updateActiveTag()
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
    })
</script>

<template>
    <header>
        <a href="https://www.businesstoday.com.tw/" class="btnet_logo_box btnet_logo_box1" aria-label="前往今周刊官網">
            <img src="../assets/image/30th_logo.png" class="btnet_logo1" alt="今周刊 30 週年 logo">
        </a>

        <nav :class="{ open: isMenuOpen }" aria-label="頁面導覽">
            <a
                v-for="(item, idx) in menuItems"
                :key="idx"
                :href="item.tagUrl"
                :class="['menu_link', 'text-lg', item.tagClassName,'sm:text-xl','text-center font-bold', { active: activeTagUrl === item.tagUrl }]"
                :aria-current="activeTagUrl === item.tagUrl ? 'page' : undefined"
                @click="handleClick(item.tagUrl, $event)"
            >
                {{ item.tagName }}
            </a>
        </nav>

        <div :class="['menu_icon', {open: isMenuOpen }]" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>
</template>

<style scoped>
    /* Header 基本樣式 */
    header {
        position: fixed;
        display: block;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        height: 80px;
        top: 0;
        width: 100%;
        left: 0;
        z-index: 99;
    }

    /* Logo 樣式 */
    .btnet_logo_box1 {
        position: absolute;
        display: block;
        width: 500px;
        height: 40px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        z-index: 3;
        left: 25px;
    }
    .btnet_logo_box2 {
        position: absolute;
        display: block;
        width: 155px;
        height: 45px;
        z-index: 2;
        top: 0;
        bottom: 0;
        margin: auto 0;
        left: 417px;
    }
    .btnet_logo_box3 {
        position: absolute;
        display: block;
        width: 206px;
        height: 28px;
        z-index: 1;
        top: 8px;
        bottom: 0;
        margin: auto 0;
        left: 570px;
    }

    .btnet_logo_box img {
        max-width: 100%;
        max-height: 100%;
    }

    /* 漢堡選單圖示樣式 */
    .menu_icon {
        position: absolute;
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 20px;
        cursor: pointer;
        top: 0;
        bottom: 0;
        margin: auto 0;
        right: 15px;
        z-index: 2;
    }

    .menu_icon span {
        display: block;
        height: 3px;
        background-color: #168ee2;
        border-radius: 2px;
        /* transition: all 0.3s ease; */
    }

    /* 當選單開啟時，改變漢堡圖示的樣式 */
    .menu_icon span:nth-child(1) {
        transform-origin: center;
    }

    .menu_icon span:nth-child(3) {
        transform-origin: center;
    }

    .menu_icon:hover span {
        background-color: #168ee2;
    }

    .menu_icon.open {
       right: 5px;
    }

    .menu_icon.open span:nth-child(1) {
        transform: rotate(45deg) translateY(12px);
    }

    .menu_icon.open span:nth-child(2) {
        opacity: 0;
    }

    .menu_icon.open span:nth-child(3) {
        transform: rotate(-45deg) translateY(-12px);
    }

    /* 選單樣式 */
    nav {
        position: absolute;
        display: flex;
        flex-direction: row;
        top: 0;
        bottom: 0;
        right: 25px;
        align-items: center;
        gap: 16px;
        background-color: #fff;
        margin: auto 0;
        height: 100%;
        width: fit-content;
    }

    nav.open {
        display: flex;
    }

    nav a {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #2f2f2f;
        min-width: 112px;
        height: 36px;
        padding: 0 1.15rem;
        line-height: 1;
        letter-spacing: 0;
        isolation: isolate;
        transition: color 0.2s ease;
    }

    nav a::before{
        content:'';
        position: absolute;
        inset: 1px 8px;
        background-color: #168ee2;
        transform: skewX(-28deg);
        opacity: 0;
        z-index: -1;
        transition: opacity 0.2s ease;
    }

    nav a:hover,
    nav a.active {
        color: #168ee2;
    }

    nav a.active {
        color: #fff;
    }

    nav a.active::before {
        opacity: 1;
    }

    @media screen and (max-width: 1920px) {
        header{
            height: 60px;
        }

        .btnet_logo_box1 {
            width: 315px;
            height: 35px;
        }
        .btnet_logo_box2 {
            width: 104px;
            height: 37px;
            left: 356px;
        }
        .btnet_logo_box3 {
            width: 167px;
            height: 29px;
            left: 472px;
        }
    }

    @media screen and (max-width: 1350px) {
        header{
            height: 55px;
        }

        .btnet_logo_box1 {
            width: 204px;
            height: 23px;
            left: 25px;
        }
        .btnet_logo_box2 {
            width: 75px;
            height: 25px;
            left: 260px;
        }
        .btnet_logo_box3 {
            width: 130px;
            height: 22px;
            left: 355px;
        }

        .menu_icon{
            display: flex;
        }

        nav{
            display: none;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            width: 100%;
            right: 0;
            top: 55px;
            margin: 0 auto;
            padding: 1rem 0;
            height: 100vh;
        }

        nav a{
            min-width: 0;
            width: 100%;
            height: 52px;
            padding: 1.2rem 0;
            border-bottom: 1px solid #d8d8d8;
        }

        nav a::before{
            inset: 9px auto;
            left: 50%;
            width: min(180px, calc(100% - 48px));
            transform: translateX(-50%) skewX(-28deg);
        }

        nav a:last-child{
            border-bottom: 0;
        }
    }
    @media screen and (max-width: 768px) {
        .btnet_logo_box1{
            width: 204px;
            height: 23px;
            left: 25px;
        }
        .btnet_logo_box2 {
            width: 56px;
            height: 21px;
            left: 240px;
        }
        .btnet_logo_box3 {
            width: 85px;
            height: 17px;
            left: 303px;
        }
    }
    @media screen and (max-width: 430px) {
        .btnet_logo_box1{
            width: 186px;
            height: 22px;
            left: 12px;
        }
        .btnet_logo_box2 {
            width: 59px;
            height: 19px;
            left: 210px;
        }
        .btnet_logo_box3 {
            width: 85px;
            height: 16px;
            left: 270px;
        }
    }
    @media screen and (max-width: 390px) {
        .btnet_logo_box1{
            width: 155px;
            height: 17px;
            left: 12px;
        }
        .btnet_logo_box2 {
            width: 50px;
            height: 17px;
            left: 170px;
        }
        .btnet_logo_box3 {
            width: 76px;
            height: 15px;
            left: 223px;
        }
    }
</style>
