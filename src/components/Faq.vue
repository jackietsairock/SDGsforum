<script setup>
defineProps({
  faqs: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section id="faq" class="faq_area" aria-labelledby="faq-heading">
    <div class="faq_shell">
      <div class="faq_header">
        <p class="faq_eyebrow">AEO / FAQ</p>
        <h2 id="faq-heading" class="faq_title">常見問題</h2>
        <p class="faq_intro">
          把活動資訊整理成搜尋引擎與回答型引擎都容易理解的格式，也方便使用者快速找到重點。
        </p>
      </div>

      <div class="faq_list">
        <details
          v-for="(item, index) in faqs"
          :key="item.question"
          class="faq_item"
          :open="index === 0"
        >
          <summary class="faq_question">
            <span class="faq_index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ item.question }}</span>
          </summary>
          <p class="faq_answer">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq_area {
  padding: 88px 24px;
  background:
    radial-gradient(circle at top left, rgba(169, 216, 47, 0.2), transparent 32%),
    linear-gradient(180deg, #f1f1ef 0%, #ffffff 100%);
}

.faq_shell {
  max-width: 1200px;
  margin: 0 auto;
}

.faq_header {
  text-align: center;
  margin-bottom: 36px;
}

.faq_eyebrow {
  display: inline-block;
  margin: 0 0 14px;
  padding: 8px 18px;
  border-radius: 999px;
  background-color: #a8d82f;
  color: #1b6f69;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.faq_title {
  margin: 0;
  color: #0f7f83;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.15;
  font-weight: 700;
}

.faq_intro {
  max-width: 760px;
  margin: 16px auto 0;
  color: #5c5f66;
  font-size: 18px;
  line-height: 1.8;
}

.faq_list {
  display: grid;
  gap: 16px;
}

.faq_item {
  border: 1px solid rgba(15, 127, 131, 0.14);
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 32px rgba(15, 127, 131, 0.08);
  overflow: hidden;
}

.faq_question {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 28px;
  list-style: none;
  cursor: pointer;
  color: #214f53;
  font-size: 22px;
  line-height: 1.5;
  font-weight: 700;
}

.faq_question::-webkit-details-marker {
  display: none;
}

.faq_index {
  min-width: 2.4em;
  color: #8bc628;
  font-size: 15px;
  letter-spacing: 0.16em;
}

.faq_answer {
  margin: 0;
  padding: 0 28px 24px 78px;
  color: #61646d;
  font-size: 17px;
  line-height: 1.9;
}

@media screen and (max-width: 768px) {
  .faq_area {
    padding: 64px 20px;
  }

  .faq_intro {
    font-size: 16px;
  }

  .faq_question {
    padding: 18px 20px;
    font-size: 18px;
  }

  .faq_answer {
    padding: 0 20px 18px 20px;
    font-size: 15px;
  }
}
</style>
