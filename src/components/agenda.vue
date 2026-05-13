<script setup>
  import Title from './Title.vue'

  defineProps({
    infoData: Object
  });

</script>

<template>
    <div :class="['content_wrap',infoData.id===1 ? 'agenda1' : 'agenda2']">
        <Title :infoData="infoData" />
        <div class="agenda_box max-w-[1366px] pl-10 pr-10 pb-10 mx-auto">
            <!--<p class="text-center text-white font-bold text-5xl sm:text-9xl" style="letter-spacing: 3px;">AGENDA</p>-->
            <div class="agenda_table flex flex-col bg-white">
                <div v-for="(item ,idx) in infoData.agendaInfo" :key="idx" class="agenda_table_item flex flex-col lg:flex-row">
                    <div class="time_box w-full lg:w-[14%]">
                        <p class="text-md lg:text-xl" :style="{color: idx === 0 ? '#474747' : '#474747'}">{{item.time}}</p>
                    </div>
                    <div class="title_box w-full lg:w-[55%]">
                        <p class="text-md font-bold lg:text-xl" :style="{color: idx === 0 ? '#474747' : '#474747'}" v-html="item.topic"></p>
                    </div>
                    <div class="speaker_area flex flex-col w-full gap-3 lg:w-[45%]">
                        <div v-for="(item ,idx) in item.speaker" :key="idx" class="speaker_box flex flex-row text-md w-full lg:text-xl">
                            <p v-html="item.speakerTitle" class="" style="color: #474747"></p>
                            <p class="whitespace-nowrap font-bold ml-1" :style="{color: item.speakerName !== '講者' ? '#474747' : '#fff'}"> {{item.speakerName}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .title_box p :deep(br){
        margin-bottom: 1rem;
    }

    .agenda_table{
        border: 2px solid #fff;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }    

    .agenda_table_item:nth-child(odd){
        background-color: #f4f4f4;
    }

    .agenda_table_item > div{
        padding: 1.5rem 1.5rem;
        border-right: 1px solid #fff;
    }
    .agenda_table_item > div:last-child{
        border-right: 0px solid #fff;
    }


    @media screen and (max-width: 1024px) {
         .agenda_table_item > div{
            padding: 0.5rem 1.5rem;
            border-right: 0px solid #fff;
        }
        .agenda_table_item{
            padding: 0.5rem 0;
        }
        
    }
</style>
