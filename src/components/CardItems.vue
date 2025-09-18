<template>
  <div>
    <div class="cards">
      <CardItem
        v-for="(card, index) in visibleCards"
        :order="index"
        :card="card"
        :key="card.id"
      />
    </div>
    <button
      v-if="showLoadMore"
      class="load-more"
      @click="loadMore"
    >
      Показать ещё
    </button>
    <button v-show="showButton" class="back-to-top" @click="scrollToTop(1000)">
      Наверх
    </button>
  </div>
</template>

<script setup lang="ts">
import CardItem from "./CardItem.vue";
import { useCardStore } from "../stores/card";
import { ref, onMounted, onUnmounted, computed } from "vue";

const cards = useCardStore();
const showButton = ref(false);
const itemsPerPage = 12;
const visibleCount = ref(itemsPerPage);

const visibleCards = computed(() => cards.cards.slice(0, visibleCount.value));
const showLoadMore = computed(() => visibleCount.value < cards.cards.length);

function scrollToTop(duration = 500) {
  const start = window.scrollY;
  const startTime = performance.now();

  function animate(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 → 1
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function loadMore() {
  visibleCount.value += itemsPerPage;
}

function checkScroll() {
  showButton.value = window.scrollY > 100;
}

onMounted(() => {
  window.addEventListener("scroll", checkScroll);
  checkScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<style scoped>
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
  z-index: 1;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.back-to-top:hover {
  opacity: 1;
}

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
</style>
