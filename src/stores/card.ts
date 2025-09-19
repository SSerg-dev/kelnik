import { defineStore } from "pinia";

export const useCardStore = defineStore("cardStore", {
  state: () => ({
    cards: [] as any[],
    nativeCards: [] as any[],
    filterCards: [] as any[],

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

    hasMore: true, // флаг, есть ли ещё данные
  }),

  getters: {
    getFilterCards: (state) => state.filterCards,
    getNativeCards: (state) => state.nativeCards,
    getFilterRooms: (state) => state.filterRooms,
    getFilterFloor: (state) => state.filterFloor,
    getFilterSquare: (state) => state.filterSquare,
    getFilterPrice: (state) => state.filterPrice,
  },

  actions: {
    // filtered methods
    setFilterCards(cards: any[]) {
      this.filterCards = cards;
    },
    setFilterRooms(rooms: any[]) {
      this.filterRooms = rooms;
    },
    setFilterFloor(floor: any[]) {
      this.filterFloor = floor;
    },
    setFilterSquare(square: any[]) {
      this.filterSquare = square;
    },
    setFilterPrice(price: any[]) {
      this.filterPrice = price;
    },
    async fetchCards(page: number, limit: number) {
      let newCards: any[] = [];

      try {
        const response = await fetch(`/api/cards?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error("Ошибка загрузки данных с API");

        newCards = await response.json();
      } catch (apiError) {
        // console.warn("Ошибка API, пробуем локальный JSON:", apiError);
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

        if (page === 1) {
          this.nativeCards = [...newCards];
        }
      }

      if (newCards.length < limit) {
        this.hasMore = false;
      }
    },

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

    getTotalCards() {
      return this.cards.length;
    },
  },
});
