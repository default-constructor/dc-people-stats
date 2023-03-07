<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue'
import {ChartData} from '@/models/chart-data.model'
import Chart from '@/components/Chart.vue'
import LabeledSelect from '@/components/LabeledSelect.vue'
import StackedAreaGraph from '@/components/StackedAreaGraph.vue'
import {useRefugeesApi} from '@/apis/refugees.api'
import {RefugeesByAge, RefugeesByAgeGroup, RefugeesByCountry, RefugeesBySex} from '@/models/refugees.model'
import RadioGroup from '@/components/RadioGroup.vue'
import {range} from 'd3'
import MultiSelect from '@/components/MultiSelect.vue'
import {viewStore} from '@/states/country.state'
import {colors} from "@/constants/colors";
import {countries} from "@/constants/countries";

const refugeesByAgeRef = ref([] as RefugeesByAge[])
const refugeesByCountryRef = ref([] as RefugeesByCountry[])
const refugeesBySexRef = ref([] as RefugeesBySex[])
const refugeesChartDataRef = ref([] as ChartData[])

const countryMap = ref(new Map<any, string>())
const countryColors = ref(new Map<any, string>())
countries.forEach((country, i) => {
  countryMap.value.set(i, country)
  countryColors.value.set(i, colors[i])
})

const ageGroups = range(0, 97).map((age, i) => {return {name: age < 96 ? age.toString() : 'Unbekannt', color: colors[i]}})
const sexGroups = [{name: 'männlich', color: '#00d9ff'}, {name: 'weiblich', color: '#ff4d4d'}]

let refugeesChartRef = ref('country')
const refugeesRadioGroupRef = ref([
  {id: 'refugees-by-country', label: 'Nach Land', value: 'country', checked: true},
  {id: 'refugees-by-age', label: 'Nach Alter', value: 'age', checked: false},
  {id: 'aliens-by-age-groups', label: 'Nach Altersgruppen', value: 'age-group', checked: false},
  {id: 'refugees-by-sex', label: 'Nach Geschlecht', value: 'sex', checked: false}
])

const maxPositiveYValueRef = ref(0)
const xLabelsRef = ref([] as string[])
const ageColorsRef = ref()
const countryColorsRef = ref()
const sexColorsRef = ref()

const fromYearRef = ref(2010)
const toYearRef = ref(2021)
const minAgeRef = ref()
const maxAgeRef = ref()
const ageGroupsRef = ref(['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99'])

let defaultCountries = viewStore.selectedFilters.get('refugees');
if (!defaultCountries || defaultCountries.length === 0) {
  defaultCountries = [0, 164, 171, 175, 196]
  viewStore.setSelectedFilters('refugees', defaultCountries)
}
const countriesRef = ref(defaultCountries as number[])

const minYear = 2007;
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))

const {loadRefugeesByAge, loadRefugeesByAgeGroup, loadRefugeesByCountry, loadRefugeesBySex, refugeesResult} = useRefugeesApi()

const retrieveRefugeesByAgeChartData = (data: RefugeesByAge[]): ChartData[] => {
  return data.map((refugees => {
    return {
      x: refugees.year,
      y: refugees.count,
      z: refugees.age
    } as ChartData
  }))
}

const retrieveRefugeesByAgeGroupChartData = (data: RefugeesByAgeGroup[]): ChartData[] => {
  return data.map((refugees => {
    return {
      x: refugees.year,
      y: refugees.count,
      z: refugees.ageGroup
    } as ChartData
  }))
}

const retrieveRefugeesByCountryChartData = (data: RefugeesByCountry[]): ChartData[] => {
  return data.map((refugees => {
    return {
      x: refugees.year,
      y: refugees.count,
      z: refugees.country
    } as ChartData
  }))
}

const retrieveRefugeesBySexChartData = (data: RefugeesBySex[]): ChartData[] => {
  return data.map((refugees => {
    return {
      x: refugees.year,
      y: refugees.count,
      z: refugees.sex
    } as ChartData
  }))
}

const retrieveAgeColors = (data: RefugeesByAge[]) => {
  const ages = [...new Set(data.map((refugees: RefugeesByAge) => {return refugees.age ? refugees.age.toString() : 'Unbekannt'})).values()];
  return ageGroups
      .filter((item: any) => ages.find((ageGroup: string) => ageGroup === item.name))
      .map((item: any) => item.color)
}

const retrieveColors = (identifiers: any[]) => {
  return identifiers.map((identifier, i) => colors[i])
}

const retrieveCountryColors = (data: RefugeesByCountry[]) => {
  const indexes = [...new Set(data.map((refugees: RefugeesByCountry)  => refugees.country)).values()]
      .map(country => countries.indexOf(country)).sort((a, b) => a - b)
  return indexes.map(index => colors[index])
}

const retrieveSexColors = (data: RefugeesBySex[]) => {
  const sex = [...new Set(data.map((refugees: RefugeesBySex) => refugees.sex)).values()];
  return sexGroups
      .filter((item: any) => sex.find((sexGroup: string) => sexGroup === item.name))
      .map((item: any) => item.color)
}

const retrieveGroupedData = (data: ChartData[]) => {
  const grouped = new Map()
  for (const d of data) {
    const sum = (grouped.has(d.x) ? grouped.get(d.x) : 0) + d.y
    grouped.set(d.x, sum)
  }

  return grouped
}

const loadRefugeesByAgeData = () => {
  loadRefugeesByAge(fromYearRef.value, toYearRef.value, minAgeRef.value, maxAgeRef.value, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        refugeesByAgeRef.value = refugeesResult.value
        refugeesChartDataRef.value = retrieveRefugeesByAgeChartData(refugeesResult.value)
        ageColorsRef.value = retrieveAgeColors(refugeesResult.value)
        xLabelsRef.value = [...new Set(refugeesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(refugeesChartDataRef.value).values()) as number[])
      })
}

const loadRefugeesByAgeGroupData = () => {
  loadRefugeesByAgeGroup(fromYearRef.value, toYearRef.value, ageGroupsRef.value, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        refugeesByAgeRef.value = refugeesResult.value
        refugeesChartDataRef.value = retrieveRefugeesByAgeGroupChartData(refugeesResult.value)
        ageColorsRef.value = retrieveColors([...new Set(refugeesResult.value.map((refugees: RefugeesByAgeGroup) => {return refugees.ageGroup ? refugees.ageGroup : 'Unbekannt'})).values()])
        xLabelsRef.value = [...new Set(refugeesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(refugeesChartDataRef.value).values()) as number[])
      })
}

const loadRefugeesByCountryData = () => {
  loadRefugeesByCountry(fromYearRef.value, toYearRef.value, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        refugeesByCountryRef.value = refugeesResult.value
        refugeesChartDataRef.value = retrieveRefugeesByCountryChartData(refugeesResult.value)
        countryColorsRef.value = retrieveCountryColors(refugeesResult.value)
        xLabelsRef.value = [...new Set(refugeesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(refugeesChartDataRef.value).values()) as number[])
      })
}

const loadRefugeesBySexData = () => {
  loadRefugeesBySex(fromYearRef.value, toYearRef.value, undefined, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        refugeesBySexRef.value = refugeesResult.value
        refugeesChartDataRef.value = retrieveRefugeesBySexChartData(refugeesResult.value)
        sexColorsRef.value = retrieveSexColors(refugeesResult.value)
        xLabelsRef.value = [...new Set(refugeesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(refugeesChartDataRef.value).values()) as number[])
      })
}

watch(countriesRef, countries => {
  viewStore.setSelectedFilters('refugees', countries)
})

watchEffect(() => {
  if (fromYearRef.value || toYearRef.value || countriesRef.value) {
    if (refugeesChartRef.value === 'age') {
      loadRefugeesByAgeData()
    }
    if (refugeesChartRef.value === 'age-group') {
      loadRefugeesByAgeGroupData()
    }
    if (refugeesChartRef.value === 'country') {
      loadRefugeesByCountryData()
    }
    if (refugeesChartRef.value === 'sex') {
      loadRefugeesBySexData()
    }
  }
})
</script>

<template>
  <article id="refugees-stats-view">
    <div class="refugees">
      <Chart id="refugees-stats-chart" :xLabels="xLabelsRef" :maxPositiveYValue="maxPositiveYValueRef" :maxNegativeYValue="0">
        <template v-slot:graph="slotProps">
          <StackedAreaGraph
              v-if="refugeesChartRef === 'country'"
              :scale="slotProps.scale"
              :chartData="refugeesChartDataRef"
              :colors="countryColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="refugeesChartRef === 'age'"
              :scale="slotProps.scale"
              :chartData="refugeesChartDataRef"
              :colors="ageColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="refugeesChartRef === 'age-group'"
              :scale="slotProps.scale"
              :chartData="refugeesChartDataRef"
              :colors="ageColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="refugeesChartRef === 'sex'"
              :scale="slotProps.scale"
              :chartData="refugeesChartDataRef"
              :colors="sexColorsRef"
          >
          </StackedAreaGraph>
        </template>
        <template v-slot:legend>
          <div class="refugees__legend">
            <ul class="legend__years">
              <li>
                <LabeledSelect id="from-year" label="Von" v-model="fromYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
              <li>
                <LabeledSelect id="to-year" label="Bis" v-model="toYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
            </ul>
            <RadioGroup name="refugees" :options="refugeesRadioGroupRef" v-model="refugeesChartRef"></RadioGroup>
            <MultiSelect :options="countryMap" :defaults="countriesRef" :colors="countryColors" label="Länderauswahl" v-model="countriesRef"></MultiSelect>
          </div>
        </template>
        <template v-slot:info>
          <div class="refugees__reference">
            <strong>Quelle: </strong>
            <span>Statistisches Bundesamt (<a href="https://www.destatis.de" target="_blank">www.destatis.de</a>)</span><br>
          </div>
        </template>
      </Chart>
    </div>
  </article>
</template>

<style lang="scss">
.refugees {
  &__legend {
    ul {
      li {
        .labeled-checkbox,
        .labeled-select {
          margin-right: 24px;
        }
      }

      &.legend__age-groups {
        .labeled-checkbox input {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
          -webkit-appearance: none;

          + label {
            position: absolute;
            top: 0;
            left: 0;

            &::before {
              width: 16px;
              height: 16px;
              background-color: white;
              border: 1px solid #2c3e50;
              display: block;
              content: "";
              float: left;
              margin-right: 6px;
              z-index: 1;
              position: relative;
            }
          }

          &#age-group-0:checked + label::before {
            background-color: #00d9ff;
          }

          &#age-group-30:checked + label::before {
            background-color: #ff4d4d;
          }

          &#age-group-35:checked + label::before {
            background-color: #8cff3f;
          }

          &#age-group-40:checked + label::before {
            background-color: #8565e1;
          }

          &#age-group-45:checked + label::before {
            background-color: #ffe258;
          }

          &#age-group-50:checked + label::before {
            background-color: #007fff;
          }

          &#age-group-55:checked + label::before {
            background-color: #e01a1a;
          }

          &#age-group-60:checked + label::before {
            background-color: #199f19;
          }

          &#age-group-65:checked + label::before {
            background-color: #7f3fff;
          }

          &#age-group-70:checked + label::before {
            background-color: #e0b700;
          }

          &#age-group-75:checked + label::before {
            background-color: #0020ff;
          }

          &#age-group-80:checked + label::before {
            background-color: #ad0404;
          }

          &#age-group-85:checked + label::before {
            background-color: #007300;
          }

          &#age-group-90:checked + label::before {
            background-color: #572ea8;
          }

          &#age-group-95:checked + label::before {
            background-color: #b99a00;
          }

          &#pcr-plus:checked + label::before {
            background-color: #000000;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.refugees {
  margin: 0 32px;

  &__legend {
    display: flex;
    justify-content: flex-start;

    ul {
      list-style: none;
      min-width: 128px;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        width: 100%;
        height: 24px;
        position: relative;
      }
    }

    .legend__years {
      li {
        margin-bottom: 8px;

        label {
          margin-right: 4px;
          width: 88px;
          text-align: right;
        }
      }
    }

    .legend__age-groups {
      li {
        margin-bottom: 2px;
      }
    }
  }
}
</style>
