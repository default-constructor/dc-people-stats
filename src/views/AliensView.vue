<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue'
import {ChartData} from '@/models/chart-data.model'
import Chart from '@/components/Chart.vue'
import LabeledSelect from '@/components/LabeledSelect.vue'
import StackedAreaGraph from '@/components/StackedAreaGraph.vue'
import {useAliensApi} from '@/apis/aliens.api';
import {AliensByAge, AliensByCountry, AliensBySex} from '@/models/aliens.model';
import RadioGroup from '@/components/RadioGroup.vue';
import {range} from 'd3';
import MultiSelect from '@/components/MultiSelect.vue';
import {viewStore} from "@/states/country.state";
import {colors} from "@/constants/colors";
import {countries} from "@/constants/countries";

const aliensRef = ref()
const aliensChartDataRef = ref([] as ChartData[])

const countryMap = ref(new Map<any, string>())
const countryColors = ref(new Map<any, string>())
countries.forEach((country, i) => {
  countryMap.value.set(i, country)
  countryColors.value.set(i, colors[i])
})

const ageGroups = range(0, 97).map((age, i) => {return {name: age < 96 ? age.toString() : 'Unbekannt', color: colors[i]}})
const sexGroups = [{name: 'männlich', color: '#00d9ff'}, {name: 'weiblich', color: '#ff4d4d'}]

let aliensChartRef = ref('country')
const aliensRadioGroupRef = ref([
  {id: 'aliens-by-country', label: 'Nach Land', value: 'country', checked: true},
  {id: 'aliens-by-age', label: 'Nach Alter', value: 'age', checked: false},
  {id: 'aliens-by-sex', label: 'Nach Geschlecht', value: 'sex', checked: false}
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

let defaultCountries = viewStore.selectedFilters.get('aliens');
if (!defaultCountries || defaultCountries.length === 0) {
  defaultCountries = [3, 164, 171, 175, 196]
  viewStore.setSelectedFilters('aliens', defaultCountries)
}
const countriesRef = ref(defaultCountries as number[])

const minYear = 1998;
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))

const {loadAliensByAge, loadAliensByCountry, loadAliensBySex, aliensResult} = useAliensApi()

const retrieveAliensByAgeChartData = (data: AliensByAge[]): ChartData[] => {
  return data.map((aliens => {
    return {
      x: aliens.year,
      y: aliens.count,
      z: aliens.age
    } as ChartData
  }))
}

const retrieveAliensByCountryChartData = (data: AliensByCountry[]): ChartData[] => {
  return data.map((aliens => {
    return {
      x: aliens.year,
      y: aliens.count,
      z: aliens.country
    } as ChartData
  }))
}

const retrieveAliensBySexChartData = (data: AliensBySex[]): ChartData[] => {
  return data.map((aliens => {
    return {
      x: aliens.year,
      y: aliens.count,
      z: aliens.sex
    } as ChartData
  }))
}

const retrieveAgeColors = (data: AliensByAge[]) => {
  const ages = [...new Set(data.map((aliens: AliensByAge) => {return aliens.age ? aliens.age.toString() : 'Unbekannt'})).values()];
  return ageGroups
      .filter((item: any) => ages.find((ageGroup: string) => ageGroup === item.name))
      .map((item: any) => item.color)
}

const retrieveCountryColors = (data: AliensByCountry[]) => {
  const indexes = [...new Set(data.map((aliens: AliensByCountry)  => aliens.country)).values()]
      .map(country => countries.indexOf(country)).sort((a, b) => a - b)
  return indexes.map(index => countryColors.value.get(index))
}

const retrieveSexColors = (data: AliensBySex[]) => {
  const sex = [...new Set(data.map((aliens: AliensBySex) => aliens.sex)).values()];
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

const loadAliensByAgeData = () => {
  loadAliensByAge(fromYearRef.value, toYearRef.value, minAgeRef.value, maxAgeRef.value, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensByAgeChartData(aliensResult.value)
        ageColorsRef.value = retrieveAgeColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

const loadAliensByCountryData = () => {
  loadAliensByCountry(fromYearRef.value, toYearRef.value, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensByCountryChartData(aliensResult.value)
        countryColorsRef.value = retrieveCountryColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

const loadAliensBySexData = () => {
  loadAliensBySex(fromYearRef.value, toYearRef.value, undefined, countries.filter((country, index) => countriesRef.value.includes(index)))
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensBySexChartData(aliensResult.value)
        sexColorsRef.value = retrieveSexColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

watch(countriesRef, countries => {
  viewStore.setSelectedFilters('aliens', countries)
})

watchEffect(() => {
  if (fromYearRef.value || toYearRef.value || countriesRef.value) {
    if (aliensChartRef.value === 'age') {
      loadAliensByAgeData()
    }
    if (aliensChartRef.value === 'country') {
      loadAliensByCountryData()
    }
    if (aliensChartRef.value === 'sex') {
      loadAliensBySexData()
    }
  }
})
</script>

<template>
  <article id="aliens-stats-view">
    <div class="aliens">
      <Chart id="aliens-stats-chart" :xLabels="xLabelsRef" :maxPositiveYValue="maxPositiveYValueRef" :maxNegativeYValue="0">
        <template v-slot:graph="slotProps">
          <StackedAreaGraph
              v-if="aliensChartRef === 'country'"
              :scale="slotProps.scale"
              :chartData="aliensChartDataRef"
              :colors="countryColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="aliensChartRef === 'age'"
              :scale="slotProps.scale"
              :chartData="aliensChartDataRef"
              :colors="ageColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="aliensChartRef === 'sex'"
              :scale="slotProps.scale"
              :chartData="aliensChartDataRef"
              :colors="sexColorsRef"
          >
          </StackedAreaGraph>
        </template>
        <template v-slot:legend>
          <div class="aliens__legend">
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
            <RadioGroup name="aliens" :options="aliensRadioGroupRef" v-model="aliensChartRef"></RadioGroup>
            <MultiSelect :options="countryMap" :defaults="countriesRef" :colors="countryColors" label="Länderauswahl" v-model="countriesRef"></MultiSelect>
          </div>
        </template>
        <template v-slot:info>
          <div class="aliens__reference">
            <strong>Quellen: </strong>
            <span>Statistisches Bundesamt (<a href="https://www.destatis.de" target="_blank">www.destatis.de</a>)</span><br>
          </div>
        </template>
      </Chart>
    </div>
  </article>
</template>

<style lang="scss">
.aliens {
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
.aliens {
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