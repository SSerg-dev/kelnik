<template>
  <div>
    <div class="cards">
      <CardItem
        v-for="(card, index) in visibleCards"
        :key="card.id"
        :order="index"
        :card="card"
      />
    </div>

    <button
      v-if="cardStore.hasMore && !isLoading"
      class="load-more"
      @click="loadMore"
    >
      Показать ещё ...
    </button>

    <p v-if="!cardStore.hasMore" class="end-text">Все квартиры загружены</p>

    <button v-show="showButton" class="back-to-top" @click="scrollToTop(1000)">
      Наверх
    </button>
  </div>
</template>

<script setup lang="ts">
import CardItem from './CardItem.vue'
import { useCardStore } from '../stores/card'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const cardStore = useCardStore()
const showButton = ref(false)
const isLoading = ref(false)
const showLoadMore = ref(true)
const limit = 12 // cards per page
const pageNumber = ref(1)

const visibleCards = computed(() => {
  return cardStore.getFilterCards
})

async function loadCards() {
  await cardStore.fetchCards(pageNumber.value, limit)
  if (!cardStore.hasMore) {
    showLoadMore.value = false
  }
}

async function loadMore() {
  pageNumber.value++
  await loadCards()
}

function scrollToTop(duration = 500) {
  const start = window.scrollY
  const startTime = performance.now()

  function animate(time: number) {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3) // cubic ease-out
    window.scrollTo(0, start * (1 - ease))
    if (progress < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

function checkScroll() {
  showButton.value = window.scrollY > 100
}

onMounted(async () => {
  await loadCards() // первая загрузка
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Load More Button */
.load-more {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.load-more:hover {
  opacity: 1;
}

.end-text {
  text-align: center;
  margin: 15px 0;
  color: #555;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 1000;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.back-to-top:hover {
  opacity: 1;
}
</style>
