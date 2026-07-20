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
                        <p class="text-lg text-[#2e362b] font-bold sm:text-xl">{{item.detail}}</p>
                    </div>
                </div>
            </div>
            <p class="agenda_note2 text-center font-bold text-xl text-[#2e362b] mt-0 mb-10">{{ infoData.note2 }}</p>
            <div class="agenda_table_wrap rounded-4xl">
                <table class="agenda_table">
                    <caption class="sr-only">2026 SDGs永續城市交流論壇議程</caption>
                    <colgroup>
                        <col class="agenda_time_column">
                        <col class="agenda_topic_column">
                        <col class="agenda_speaker_column">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">時間</th>
                            <th scope="col">議題</th>
                            <th scope="col">講者</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, idx) in infoData.agendaInfo" :key="idx">
                            <tr v-if="item.type === 'session'" class="agenda_session_row">
                                <th colspan="3" scope="colgroup" v-html="item.topic"></th>
                            </tr>
                            <tr v-else>
                                <th class="agenda_time" scope="row">{{ item.time }}</th>
                                <td
                                    class="agenda_topic"
                                    :colspan="item.speaker?.length ? 1 : 2"
                                    v-html="item.topic"
                                ></td>
                                <td
                                    v-if="item.speaker?.length"
                                    class="agenda_speaker"
                                    v-html="item.speaker"
                                ></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <p class="agenda_note2 text-center font-bold text-xl text-[#2e362b] mt-4">{{ infoData.note }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .agenda_table_wrap{
        width: 100%;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(31, 73, 68, 0.14);
    }

    .agenda_table{
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        color: #303936;
        background-color: #fff;
    }

    .agenda_time_column{
        width: 18%;
    }

    .agenda_topic_column{
        width: 34%;
    }

    .agenda_speaker_column{
        width: 48%;
    }

    .agenda_table th,
    .agenda_table td{
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #bfc9c6;
        font-size: 1rem;
        line-height: 1.7;
        text-align: left;
        vertical-align: middle;
        overflow-wrap: anywhere;
    }

    .agenda_session_row th{
        border: 0;
    }

    .agenda_table thead th{
        background-color: #1f5842;
        color: #fff;
        font-size: 1.125rem;
        font-weight: 800;
        text-align: center;
    }

    .agenda_time{
        color: #155f58;
        font-weight: 700;
        text-align: center !important;
        white-space: nowrap;
    }

    .agenda_topic{
        font-weight: 700;
    }

    .agenda_speaker{
        font-weight: 500;
    }

    .agenda_speaker :deep(.speaker-name){
        padding: 0.08em 0.28em;
        border-radius: 0.2em;
        background-color: #bdebdc;
        color: #17483e;
        font-weight: 800;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
    }

    .agenda_speaker :deep(.invitation-status){
        display: block;
        font-size: 0.875em;
        text-align: right;
    }

    .agenda_topic :deep(br){
        display: block;
        content: '';
        margin-bottom: 0.35rem;
    }

    .agenda_session_row th{
        padding: 0.8rem 1rem;
        border-color: #9b5c38;
        background-color: #f4bd9d;
        color: #321f15;
        font-size: 1.125rem;
        font-weight: 800;
        line-height: 1.6;
        text-align: center;
    }

    .agenda_note::before{
        content: '*';
        color: #b91c1c;
        font-weight: 700;
        margin-right: 0.25rem;
    }


    @media screen and (max-width: 767px) {
        .agenda_box{
            padding-right: 0.75rem !important;
            padding-bottom: 2rem !important;
            padding-left: 0.75rem !important;
        }

        .event_info_box{
            width: 100%;
            margin-top: 2rem;
            margin-bottom: 2rem;
        }

        .agenda_note2{
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }

        .agenda_time_column{
            width: 27%;
        }

        .agenda_topic_column{
            width: 34%;
        }

        .agenda_speaker_column{
            width: 39%;
        }

        .agenda_table th,
        .agenda_table td{
            padding: 0.75rem 0.65rem;
            font-size: 0.875rem;
            line-height: 1.6;
        }

        .agenda_table thead th{
            font-size: 0.95rem;
        }

        .agenda_session_row th{
            padding: 0.8rem 0.75rem;
            font-size: 0.9rem;
            line-height: 1.55;
        }
    }

    @media screen and (max-width: 380px) {
        .agenda_time_column{
            width: 28%;
        }

        .agenda_topic_column{
            width: 33%;
        }

        .agenda_speaker_column{
            width: 39%;
        }

        .agenda_table th,
        .agenda_table td{
            padding: 0.65rem 0.45rem;
            font-size: 0.78rem;
        }

        .agenda_time{
            letter-spacing: -0.03em;
        }
    }
</style>
