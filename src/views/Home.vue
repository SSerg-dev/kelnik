<template>
  <main>
    <div class="header-wrapper">
      <h1>Подбор квартир</h1>
      <button class="toggle-btn" @click="toggle" v-if="isMobile">
        <span v-if="open" class="icon-x" style="padding-top: 6px;">✕</span>
        <span v-else class="icon-menu" style="padding-top: 6px;">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <CardItems class="card-items" />

    <transition name="slide-fade">
      <Select class="select" v-if="!isMobile || open" />
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardItems from "../components/CardItems.vue";
import Select from "../components/Select.vue";

const open = ref(false);
const isMobile = ref(false);

function toggle() {
  open.value = !open.value;
}

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.matchMedia(`(max-width: 960px)`).matches;
  };
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
</script>

<style lang="scss" scoped>
@use "../scss/mixins" as mixins;

main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;

  .card-items {
    order: 1;
  }
  .select {
    order: 2;
  }
  .header-wrapper {
    display: none;
  }

  @include mixins.md {
    flex-direction: column;
    align-items: center;
    gap: 0;

    .card-items {
      order: 2;
    }
    .select {
      order: 1;
    }
    .header-wrapper {
      display: inline-flex;
    }
  }
}

.header-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }

  .toggle-btn {
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-menu {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      span {
        display: block;
        height: 2px;
        background-color: black;
        width: 100%;
      }
    }
  }
}

.icon-x {
  font-size: 16px;
  line-height: 16px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.8s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
  overflow: hidden;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 2000px;
  overflow: hidden;
}
</style>
