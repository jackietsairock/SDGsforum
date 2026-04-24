<script setup>
    import { ref } from 'vue'

    // 定義一個狀態來控制選單的開啟或關閉
    const isMenuOpen = ref(false)

    // 切換選單的開啟狀態
    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
    }

    const getHeaderOffset = () => {
        const header = document.querySelector('header')
        const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0
        return headerHeight
    }

    const handleClick = (tagUrl, event) => {
        isMenuOpen.value = false;

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

    defineProps(
        {
            menu: Array
        }
    );
</script>

<template>
    <header>
        <a href="https://www.businesstoday.com.tw/" class="btnet_logo_box btnet_logo_box1" aria-label="前往今周刊官網">
            <img src="../assets/image/30th_logo.png" class="btnet_logo1" alt="今周刊 30 週年 logo">
        </a>
        <a href="https://esg.businesstoday.com.tw/" class="btnet_logo_box btnet_logo_box2" aria-label="前往今周 ESG 頻道">
            <img src="../assets/image/ESG_logo.png" class="btnet_logo2" alt="今周 ESG logo">
        </a>
        <a href="https://esgschool.businesstoday.com.tw/" class="btnet_logo_box btnet_logo_box3" aria-label="前往 ESG 學院">
            <img src="../assets/image/esg-school-logo.png" class="btnet_logo2" alt="ESG 學院 logo">
        </a>

        <nav :class="{ open: isMenuOpen }" aria-label="頁面導覽">
            <a
                v-for="(item, idx) in menu"
                :key="idx"
                :href="item.tagUrl"
                :class="['text-lg', item.tagClassName,'sm:text-xl','text-center font-bold']"
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
        background-color: #30c4a2;
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
        background-color: #30c4a2;
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
        position: absolute;
        top: 0;
        bottom: 0;
        right: 25px;
        background-color: #fff;
        margin: auto 0;
        height: fit-content;
        width: fit-content;
    }

    nav.open {
        display: flex;
    }

    nav a {
        position: relative;
        display: block;
        text-decoration: none;
        color: #30c4a2;
        padding: 0.5rem 1rem;
    }

    nav a::after{
        content:'';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        height: 40%;
        border-right: 1px solid #188d71;
    }

    nav a:last-child::after{
        display: none;
    }

    nav a:hover {
        color: #188d71;
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
            width: 100%;
            right: 0;
            top: 55px;
            margin: 0 auto;
            padding: 1rem 0;
        }

        nav a{
            padding: 1.2rem 0;
            border-bottom: 1px solid #d8d8d8;
        }

        nav a::after{
            display: none;
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
