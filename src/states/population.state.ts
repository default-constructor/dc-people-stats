import {reactive} from 'vue';

export const populationStore = reactive({
  fromYear: 2010,
  toYear: 2021,
  sex: undefined as (string | undefined),
  minAge: 0,
  maxAge: 95,
  ageGroups: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59',
    '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99'] as string[],
  lessAliens: false,

  set(fromYear: number, toYear: number, minAge: number, maxAge: number, sex?: string, lessAliens: boolean = false) {
    this.fromYear = fromYear
    this.toYear = toYear
    this.minAge = minAge
    this.maxAge = maxAge
    this.sex = sex
    this.lessAliens = lessAliens
  }
})
