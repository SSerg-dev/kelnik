<template>
  <h3>Заявка на бронь</h3>

  <div class="row">
    <form class="col s12">
      <div class="row">
        <div class="input-field col s6">
          <input placeholder="" id="first_name" type="text" class="validate" />
          <label for="first_name">Имя</label>
        </div>
        <div class="input-field col s6">
          <input id="last_name" type="text" class="validate" />
          <label for="last_name">Фамилия</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <input id="phone" type="tel" class="validate" />
          <label for="phone">Телефон</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="email" type="email" class="validate" />
          <label for="email">Почта</label>
        </div>
      </div>
    </form>
    <div class="select__content__find">
      <a
        class="waves-effect default green lighten-1 btn select__content__find__button"
        @click="pushRoute('/')"
        >Забронировать</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../router";

// methods
function pushRoute(route: string) {
  router.push(route);
}
</script>

<style scoped>
.order- {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
</style>
