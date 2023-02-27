import {reactive} from "vue";

export const countryStore = reactive({
  selectedCountries: new Map<string, string[]>(),
  setSelectedCountries(view: string, countries: string[]) {
    this.selectedCountries.set(view, countries)
  }
})