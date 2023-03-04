import {reactive} from 'vue';

export const viewStore = reactive({
  selectedFilters: new Map<string, string[] | number[]>(),
  setSelectedFilters(view: string, countries: string[] | number[]) {
    this.selectedFilters.set(view, countries)
  }
})