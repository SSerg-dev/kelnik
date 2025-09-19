<template>
  <div class="select">
    <div class="select__content">
      <!-- Header -->
      <div class="select__content__header">
        <p>Подбор квартир</p>
      </div>

      <!-- Room Filter -->
      <div class="select__content__room">
        <p>Количество комнат</p>
        <div>
          <button
            class="waves-effect waves-green white btn select__content__room__button"
            @click="filterRooms(1)"
          >1</button>
          <button
            class="waves-effect waves-green white btn select__content__room__button"
            @click="filterRooms(2)"
          >2</button>
          <button
            class="waves-effect waves-green white btn select__content__room__button"
            @click="filterRooms(3)"
          >3</button>
          <button
            class="waves-effect waves-green white btn select__content__room__button"
            @click="filterRooms(4)"
          >4+</button>
        </div>
      </div>

      <!-- Floor Filter -->
      <div class="select__content__floor">
        <p>Этаж</p>
        <div class="row">
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">от</span>
              <span class="black-text">{{ minFloor }}</span>
            </div>
          </div>
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">до</span>
              <span class="black-text">{{ maxFloor }}</span>
            </div>
          </div>
        </div>
        <div id="floor-slider" style="margin: -1.2rem 2rem 0 0.5rem"></div>
      </div>

      <!-- Square Filter -->
      <div class="select__content__square">
        <p>Площадь</p>
        <div class="row">
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">от</span>
              <span class="black-text">{{ minSquare }}</span>
            </div>
          </div>
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">до</span>
              <span class="black-text">{{ maxSquare }}</span>
            </div>
          </div>
        </div>
        <div id="square-slider" style="margin: -1.2rem 2rem 0 0.5rem"></div>
      </div>

      <!-- Cost Filter -->
      <div class="select__content__cost">
        <p>Стоимость</p>
        <div class="row">
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">от</span>
              <span class="black-text">{{ minCost }}</span>
            </div>
          </div>
          <div class="col">
            <div class="card white select__content__floor__range">
              <span class="black-text">до</span>
              <span class="black-text">{{ maxCost }}</span>
            </div>
          </div>
        </div>
        <div id="cost-slider" style="margin: -1.2rem 2rem 0 0.5rem"></div>
      </div>
    </div>

    <!-- Find & Reset -->
    <div class="select__content__find">
      <button class="waves-effect default green lighten-1 btn select__content__find__button">
        Подобрать
      </button>
    </div>
    <button
      class="green-text waves-effect waves-green white lighten-1 btn select__content__find__reset"
      @click="resetFilters"
    >
      Сбросить
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCardStore } from "../stores/card";
import noUiSlider from "nouislider";

const cards = useCardStore();

// Slider values
const minFloor = ref(1);
const maxFloor = ref(10);

const minSquare = ref(22.94);
const maxSquare = ref(192.27);

const minCost = ref(2.23);
const maxCost = ref(12.43);

// ------------------ FILTER FUNCTIONS ------------------

function resetFilters() {
  // Clear all filters
  cards.setFilterRooms([]);
  cards.setFilterFloor([]);
  cards.setFilterSquare([]);
  cards.setFilterPrice([]);
  cards.setFilterCards([]);
}

function intersectionFilterCards() {
  let result = [...cards.getNativeCards];

  if (cards.getFilterRooms.length) result = result.filter(c => cards.getFilterRooms.includes(c));
  if (cards.getFilterFloor.length) result = result.filter(c => cards.getFilterFloor.includes(c));
  if (cards.getFilterSquare.length) result = result.filter(c => cards.getFilterSquare.includes(c));
  if (cards.getFilterPrice.length) result = result.filter(c => cards.getFilterPrice.includes(c));

  cards.setFilterCards(result);
}

// Rooms filter
function filterRooms(amount: number) {
  const filtered = cards.getNativeCards.filter(c => c.rooms === amount);
  cards.setFilterRooms(filtered);
  intersectionFilterCards();
}

// Floor filter
function filterFloor() {
  const filtered = cards.getNativeCards.filter(
    c => c.floor >= minFloor.value && c.floor <= maxFloor.value
  );
  cards.setFilterFloor(filtered);
  intersectionFilterCards();
}

// Square filter
function filterSquare() {
  const filtered = cards.getNativeCards.filter(
    c => c.square >= minSquare.value && c.square <= maxSquare.value
  );
  cards.setFilterSquare(filtered);
  intersectionFilterCards();
}

// Price filter
function filterPrice() {
  const filtered = cards.getNativeCards.filter(
    c => c.price / 1000000 >= minCost.value && c.price / 1000000 <= maxCost.value
  );
  cards.setFilterPrice(filtered);
  intersectionFilterCards();
}

// ------------------ CREATE SLIDERS ------------------

function createSlider(id: string, start: number[], range: any, onUpdate: Function) {
  const slider = document.getElementById(id);
  if (!slider) return;

  const noUi = noUiSlider.create(slider, {
    start,
    connect: true,
    step: 1,
    range,
    orientation: "horizontal"
  });

  noUi.on("update", (values: any) => {
    onUpdate(values.map((v: string) => +v));
  });
}

onMounted(() => {
  createSlider("floor-slider", [minFloor.value, maxFloor.value], { min: 1, max: 10 }, ([min, max]: Array<number>) => {
    minFloor.value = min;
    maxFloor.value = max;
    filterFloor();
  });

  createSlider("square-slider", [minSquare.value, maxSquare.value], { min: 22.94, max: 192.27 }, ([min, max]: Array<number>) => {
    minSquare.value = min;
    maxSquare.value = max;
    filterSquare();
  });

  createSlider("cost-slider", [minCost.value, maxCost.value], { min: 2.23, max: 12.43 }, ([min, max]: Array<number>) => {
    minCost.value = min;
    maxCost.value = max;
    filterPrice();
  });
});
</script>

<style scoped>
.select__content__header { display: none; }
</style>

