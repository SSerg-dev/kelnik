
import { defineStore } from "pinia";

export const useCardStore = defineStore("cardStore", {
  state: () => ({
    cards: [] as any[],          // все загруженные карточки
    nativeCards: [] as any[],    // полная копия карточек
    filterCards: [] as any[],    // карточки после фильтров

    filterRooms: [] as any[],
    filterFloor: [] as any[],
    filterSquare: [] as any[],
    filterPrice: [] as any[],

    cardVisible: {
      isRoom: true,
      isFloor: true,
      isSquare: true,
      isCost: true,
    },

    hasMore: true,  // есть ли ещё данные
  }),

  getters: {
    // Возвращает карточки после фильтров; если фильтров нет, возвращает все
    getFilterCards: (state) => {
      if (
        state.filterRooms.length > 0 ||
        state.filterFloor.length > 0 ||
        state.filterSquare.length > 0 ||
        state.filterPrice.length > 0
      ) {
        return state.filterCards;
      }
      return state.cards;
    },

    getNativeCards: (state) => state.nativeCards,
    getFilterRooms: (state) => state.filterRooms,
    getFilterFloor: (state) => state.filterFloor,
    getFilterSquare: (state) => state.filterSquare,
    getFilterPrice: (state) => state.filterPrice,
  },

  actions: {
    // Устанавливаем фильтры
    setFilterCards(cards: any[]) { this.filterCards = cards; },
    setFilterRooms(rooms: any[]) { this.filterRooms = rooms; },
    setFilterFloor(floor: any[]) { this.filterFloor = floor; },
    setFilterSquare(square: any[]) { this.filterSquare = square; },
    setFilterPrice(price: any[]) { this.filterPrice = price; },

    // Загрузка карточек (API или локальный JSON)
    async fetchCards(page: number, limit: number) {
      let newCards: any[] = [];

      try {
        const response = await fetch(`/api/cards?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error("Ошибка загрузки данных с API");
        newCards = await response.json();
      } catch (apiError) {
        console.warn("Ошибка API, пробуем локальный JSON:", apiError);
        try {
          const response = await fetch("/data/data.json");
          if (!response.ok) throw new Error("Ошибка локального JSON");
          const localCards = await response.json();
          const start = (page - 1) * limit;
          const end = page * limit;
          newCards = localCards.slice(start, end);
        } catch (localError) {
          console.error("Ошибка загрузки локального файла:", localError);
          this.hasMore = false;
          return;
        }
      }

      if (newCards.length > 0) {
        this.cards.push(...newCards);
        if (page === 1) this.nativeCards = [...newCards];
      }

      if (newCards.length < limit) this.hasMore = false;
    },

    // Сброс всех фильтров
    resetStore() {
      this.cards = [];
      this.nativeCards = [];
      this.filterCards = [];
      this.filterRooms = [];
      this.filterFloor = [];
      this.filterSquare = [];
      this.filterPrice = [];
      this.hasMore = true;
    },

    // Всего карточек
    getTotalCards() { return this.cards.length; },
  },
});
