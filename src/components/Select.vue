<template>
  <div>
    <div class="select">
      <div class="select__content">
        <div class="select__content__header">
          <p>Подбор квартир</p>
        </div>

        <div class="select__content__room">
          <p>Количество комнат</p>
          <div>
            <a
              class="waves-effect waves-green white btn select__content__room__button"
              @click="filterCards('rooms', 1)"
              >1</a
            >
            <a
              class="waves-effect waves-green white btn select__content__room__button"
              @click="filterCards('rooms', 2)"
              >2</a
            >
            <a
              class="waves-effect waves-green white btn select__content__room__button"
              @click="filterCards('rooms', 3)"
              >3</a
            >
            <a
              class="waves-effect waves-green white btn select__content__room__button"
              @click="filterCards('rooms', 4)"
              >4+</a
            >
          </div>
        </div>

        <div class="select__content__floor">
          <p>Этаж</p>
          <div class="row">
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">от</span>
                <span class="black-text">{{ `${minFloor}` }}</span>
              </div>
            </div>
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">до</span>
                <span class="black-text">{{ `${maxFloor}` }}</span>
              </div>
            </div>
          </div>
          <div style="margin: -1.2rem 2rem 0 0.5rem" id="floor-slider"></div>
        </div>

        <div class="select__content__square">
          <p>Площадь</p>
          <div class="row">
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">от</span>
                <span class="black-text">{{ `${minSquare}` }}</span>
              </div>
            </div>
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">до</span>
                <span class="black-text">{{ `${maxSquare}` }}</span>
              </div>
            </div>
          </div>

          <div style="margin: -1.2rem 2rem 0 0.5rem" id="square-slider"></div>
        </div>

        <div class="select__content__cost">
          <p>Стоимость</p>
          <div class="row">
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">от</span>
                <span class="black-text">{{ `${minCost}` }}</span>
              </div>
            </div>
            <div class="col">
              <div class="card white select__content__floor__range">
                <span class="black-text">до</span>
                <span class="black-text">{{ `${maxCost}` }}</span>
              </div>
            </div>
          </div>
          <div style="margin: -1.2rem 2rem 0 0.5rem" id="cost-slider"></div>
        </div>
      </div>

      <div class="select__content__find">
        <a
          class="waves-effect default green lighten-1 btn select__content__find__button"
          >Подобрать</a
        >
      </div>

      <div class="select__content__filter"></div>
      <a
        class="green-text waves-effect waves-green white lighten-1 btn select__content__find__reset"
        @click="resetHandler"
        >Сбросить</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardStore } from "../stores/card";
import noUiSlider from "nouislider";
import { type } from "os";

import { defineComponent, defineProps, ref, computed, onMounted } from "vue";

defineComponent({});

const cards = useCardStore();

let minFloor = ref(0);
let maxFloor = ref(0);

let minSquare = ref(0);
let maxSquare = ref(0);

let minCost = ref(0);
let maxCost = ref(0);

// methods
function resetHandler() {
  window.location.reload();
}

function filterCards(type: string, amount: number) {
  switch (type) {
    case "rooms":
      filterRooms("rooms", amount);
      break;
    case "floor":
      filterFloor("floor");
      break;
    case "square":
      filterSquare("square");
      break;
    case "price":
      filterPrice("price");
      break;

    default:
      break;
  }
}
function intersectionFilterCards() {
  const rooms = cards.getFilterRooms;
  const floor = cards.getFilterFloor;
  const square = cards.getFilterSquare;
  const price = cards.getFilterPrice;

  // all cards
  let native;
  if (cards.getFilterCards.length > 0) {
    native = cards.getFilterCards;
  } else {
    native = cards.getNativeCards;
  }
  let result = [...native];

  if (rooms.length > 0 && result.length > 0) {
    result = result.filter((c: any) => rooms.includes(c));
  }
  if (floor.length > 0 && result.length > 0) {
    result = result.filter((c: any) => floor.includes(c));
  }
  if (square.length > 0 && result.length > 0) {
    result = result.filter((c: any) => square.includes(c));
  }
  if (price.length > 0 && result.length > 0) {
    result = result.filter((c: any) => price.includes(c));
  }

  if (result.length > 0) {
    cards.setFilterCards(result);
    cards.cards = [...result];

    return result; 
  } else return;
}

function filterRooms(rooms: string, amount: number) {
  // $$
  // const result = cards.cards.filter((c: any) => c.rooms <= amount);
  const result = cards.cards.filter((c: any) => c.rooms === amount);
  if (result.length > 0) {
    cards.setFilterRooms(result);
    intersectionFilterCards();

    return result;
  }
  return;
}
function filterFloor(floor: string) {
  const result = cards.cards.filter(
    (c: any) => c.floor >= +minFloor.value && c.floor <= +maxFloor.value
  );
  if (result.length > 0) {
    cards.setFilterFloor(result);
    intersectionFilterCards();

    return result;
  }
  return;
}
function filterSquare(square: string) {
  const result = cards.cards.filter(
    (c: any) => c.square >= +minSquare.value && c.square <= +maxSquare.value
  );
  if (result.length > 0) {
    cards.setFilterSquare(result);
    intersectionFilterCards();

    return result;
  }
  return;
}
function filterPrice(price: string) {
  const result = cards.cards.filter(
    (c: any) =>
      c.price / 1000000 >= +minCost.value && c.price / 1000000 <= +maxCost.value
  );
  if (result.length > 0) {
    cards.setFilterPrice(result);
    intersectionFilterCards();

    return result;
  }
  return;
}

function createFloorSlider() {
  const floorSlider: any = document.getElementById("floor-slider");

  // create slider
  const slider = noUiSlider.create(floorSlider, {
    start: [1, 10],
    connect: true,
    step: 1,
    orientation: "horizontal",
    range: {
      min: 1,
      max: 10,
    },
  });
  // listen slider
  slider.on("update", (values) => {
    minFloor.value = +values[0];
    maxFloor.value = +values[1];
    const type = "floor";
    filterCards(type, 0);
  });
}

function createSquareSlider() {
  const squareSlider = <HTMLElement>document.getElementById("square-slider");

  // create slider
  const slider = noUiSlider.create(squareSlider, {
    start: [22.94, 192.27],
    connect: true,
    step: 1,
    orientation: "horizontal",
    range: {
      min: 22.94,
      max: 192.27,
    },
  });
  // listen slider
  slider.on("update", (values) => {
    minSquare.value = +values[0];
    maxSquare.value = +values[1];
    const type = "square";
    filterCards(type, 0);
  });
}

function createCostSlider() {
  const costSlider = <HTMLElement>document.getElementById("cost-slider");

  // create slider
  const slider = noUiSlider.create(costSlider, {
    start: [2.23, 12.43],
    connect: true,
    step: 0.1,
    orientation: "horizontal",
    range: {
      min: 2.23,
      max: 12.43,
    },
  });
  // listen slider
  slider.on("update", (values) => {
    minCost.value = +values[0];
    maxCost.value = +values[1];
    const type = "price";
    filterCards(type, 0);
  });
}

onMounted(() => {
  createFloorSlider();
  createSquareSlider();
  createCostSlider();
});
</script>

<style lang="scss" scoped>
.select {
  @media screen and (max-width: 960px) { 
    margin-top: 0;
    margin-right: 0;
    display: block;
  }
}
.select__content__header {
  @media screen and (max-width: 960px) { 
    display: none;
  }
}

</style>
