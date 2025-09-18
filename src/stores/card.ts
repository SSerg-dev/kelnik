import { defineStore } from "pinia";
import cards from "../data/data.json";

export const useCardStore = defineStore("cardStore", { 
  state: () => ({
    cards,
    nativeCards: [...cards],             
    filterCards: [],

    filterRooms: [],
    filterFloor: [],
    filterSquare: [],
    filterPrice: [],
    
    cardVisible: {
      isRoom: true,
      isFloor: true,
      isSquare: true,
      isCost: true,
    },
  }),
  getters: {
    getFilterCards(): any {
      return this.filterCards
    },
    getNativeCards(): any {
      return this.nativeCards
    },
    getFilterRooms(): any {
      return this.filterRooms
    },
    getFilterFloor(): any {
      return this.filterFloor
    },
    getFilterSquare(): any {
      return this.filterSquare
    },
    getFilterPrice(): any {
      return this.filterPrice
    }

  },
  actions: {
    setFilterCards(cards: any) {
      this.filterCards = cards
    },
    setFilterRooms(rooms: any) {
      this.filterRooms = rooms
    },
    setFilterFloor(floor: any) {
      this.filterFloor = floor
    },
    setFilterSquare(square: any) {
      this.filterSquare = square
    },
    setFilterPrice(price: any) {
      this.filterPrice = price
    }

  }
  
});
