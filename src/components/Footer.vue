<script setup>
    defineProps({
        footerInfo: Object
    });
</script>

<template>
    <footer class="footer_area w-full overflow-hidden bg-[#cbcbcb]">
        <div class="footer_box flex flex-col gap-3 max-w-[100%] mx-auto py-0 px-10 text-center" style="color:#000">
            <p class="text-md font-bold mt-15">{{footerInfo.text}}</p>
            <p class="text-sm font-bold mb-15">{{footerInfo.copyright}}</p>
        </div>
    </footer>
</template>

<style scoped>
    
</style>
