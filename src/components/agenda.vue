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
            <div class="event_info_box flex flex-col gap-4 my-10 w-fit mx-auto">
                <div v-for="(item, idx) in infoData.event_info" :key="idx" class="event_info_item flex flex-col items-start gap-4 sm:items-center sm:flex-row sm:gap-8">
                    <div class="event_info_label">
                        <div class="label_box bg-[#050505] w-fit px-5 py-2">
                            <p class="text-lg text-[#fff] font-bold sm:text-2xl">{{ item.label }}</p>
                        </div>
                    </div>
                    <div class="event_info_value flex flex-col gap-3 text-left mb-5 items-baseline sm:mb-0 sm:flex-row sm:gap-8">
                        <p class="text-2xl text-[#fff] font-bold sm:text-4xl" v-html="item.title"></p>
                        <p class="text-sm text-[#2e362b] sm:text-base">{{item.detail}}</p>
                    </div>
                </div>
            </div>
            <p class="agenda_note2 text-center text-lg text-[#2e362b] mt-0 mb-10">{{ infoData.note2 }}</p>
            <div class="agenda_table flex flex-col bg-white p-3 rounded-lg">
                <div v-for="(item ,idx) in infoData.agendaInfo" :key="idx" class="agenda_table_item flex flex-col lg:flex-row">
                    <div class="time_box w-full lg:w-[14%]">
                        <p class="text-md lg:text-xl" :style="{color: idx === 0 ? '#474747' : '#474747'}">{{item.time}}</p>
                    </div>
                    <div class="title_box w-full lg:w-[55%]">
                        <p class="text-md font-bold lg:text-xl" :style="{color: idx === 0 ? '#474747' : '#474747'}" v-html="item.topic"></p>
                    </div>
                    <div class="speaker_area flex flex-col w-full gap-3 lg:w-[45%]">
                        <div v-for="(item ,idx) in item.speaker" :key="idx" class="speaker_box flex flex-row text-md w-full items-center lg:text-xl">
                            <p v-html="item.speakerTitle" class="" style="color: #474747"></p>
                            <p :class="item.speakerName !== '' ? `block bg-[#00c19f] text-white whitespace-nowrap font-bold ml-1 py-1 px-2` : `hidden`" :style="{color: item.speakerName !== '講者' ? '#fff' : '#fff'}"> {{item.speakerName}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p class="agenda_note text-center text-sm text-[#2e362b] mt-4">{{ infoData.note }}</p>
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

    .agenda_table_item{
        border-bottom: 1px solid #a9a9a9;
    }

    .agenda_table_item > div{
        padding: 1.5rem 1.5rem;
    }

    .agenda_table_item:last-child{
        border-bottom: 0px solid #a9a9a9;
    }

    .agenda_note::before{
        content: '*';
        color: #b91c1c;
        font-weight: 700;
        margin-right: 0.25rem;
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
