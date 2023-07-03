import {reactive} from 'vue';

export const aliensStore = reactive({
  fromYear: 2010,
  toYear: 2021,
  countries: [] as number[],
  ageGroups: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59',
    '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99'] as string[],
  sumCountries: false,
  lessRefugees: false,

  set(fromYear: number, toYear: number, countries: number[], sumCountries: boolean, lessRefugees: boolean) {
    this.fromYear = fromYear
    this.toYear = toYear
    this.countries = countries
    this.sumCountries = sumCountries
    this.lessRefugees = lessRefugees
  },

  setCountries(countries: number[]) {
    this.countries = countries
  }
})
