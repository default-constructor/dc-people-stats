<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {ChartData} from '@/models/chart-data.model'
import Chart from '@/components/Chart.vue'
import LabeledSelect from '@/components/LabeledSelect.vue'
import StackedAreaGraph from '@/components/StackedAreaGraph.vue'
import {populationStore} from "@/states/population.state"
import {colors} from "@/constants/colors"
import LabeledCheckbox from "@/components/LabeledCheckbox.vue"
import {usePopulationApi} from "@/apis/population.api"
import {Population, PopulationByAgeAndSex} from "@/models/population.model"

const populationsRef = ref()
const chartDataRef = ref([] as ChartData[])

let chartTypeRef = ref('country')
const chartTypeChoiceRef = ref([
  {id: 'population-by-age', label: 'Nach Alter', value: 'age', checked: false},
  {id: 'population-by-age-groups', label: 'Nach Altersgruppen', value: 'age-group', checked: false},
  {id: 'population-by-sex', label: 'Nach Geschlecht', value: 'sex', checked: false}
])

const maxPositiveYValueRef = ref(0)
const xLabelsRef = ref([] as string[])
const ageColorsRef = ref(new Map<number, string>())

const fromYearRef = ref(populationStore.fromYear)
const toYearRef = ref(populationStore.toYear)
const sexRef = ref(populationStore.sex)
const minAgeRef = ref(populationStore.minAge)
const maxAgeRef = ref(populationStore.maxAge)
const ageGroupsRef = ref(populationStore.ageGroups)
const lessAliensCheckboxRef = ref(populationStore.lessAliens)

const minYear = 1998;
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))
const agesRef = ref(Array.from(Array(95 + 1), (_, i) => i))

const {loadPopulationByAge, populationResult} = usePopulationApi()

const retrievePopulationChartData = (data: PopulationByAgeAndSex[]): ChartData[] => {
  return data.map((population => {
    return {
      x: population.year,
      y: population.count,
      z: population.age
    } as ChartData
  }))
}

const retrieveAgeColors = (data: PopulationByAgeAndSex[]) => {
  const map = new Map<number, string>();
  const ages = [...new Set(data.map((population: PopulationByAgeAndSex) => population.age)).values()]
  ages.forEach((age, i) => {
    map.set(age, colors[i])
  })

  return map
}

const retrieveGroupedData = (data: ChartData[]) => {
  const grouped = new Map()
  for (const d of data) {
    const sum = (grouped.has(d.x) ? grouped.get(d.x) : 0) + d.y
    grouped.set(d.x, sum)
  }

  return grouped
}

const loadPopulationByAgeData = () => {
  loadPopulationByAge(fromYearRef.value, toYearRef.value, minAgeRef.value, maxAgeRef.value, sexRef.value, lessAliensCheckboxRef.value)
      .then(() => {
        populationsRef.value = populationResult.value
        chartDataRef.value = retrievePopulationChartData(populationResult.value)
        ageColorsRef.value = retrieveAgeColors(populationResult.value)
        xLabelsRef.value = [...new Set(chartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(chartDataRef.value).values()) as number[])
      })
}

watchEffect(() => {
  if (fromYearRef.value || toYearRef.value || minAgeRef.value || maxAgeRef.value || sexRef.value || lessAliensCheckboxRef.value) {
    populationStore.set(fromYearRef.value, toYearRef.value, minAgeRef.value, maxAgeRef.value, sexRef.value, lessAliensCheckboxRef.value)

    loadPopulationByAgeData()
  }
})
</script>

<template>
  <article id="population-stats-view">
    <div class="population">
      <Chart id="population-stats-chart" :xLabels="xLabelsRef" :maxPositiveYValue="maxPositiveYValueRef" :maxNegativeYValue="0">
        <template v-slot:graph="slotProps">
          <StackedAreaGraph
              :scale="slotProps.scale"
              :chartData="chartDataRef"
              :colors="Array.from(ageColorsRef.values())"
          >
          </StackedAreaGraph>
        </template>
        <template v-slot:legend>
          <div class="population__legend">
            <ul class="legend__years">
              <li>
                <LabeledSelect id="from-year" label="Von Jahr" v-model="fromYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
              <li>
                <LabeledSelect id="to-year" label="Bis Jahr" v-model="toYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
            </ul>

            <ul class="legend__ages">
              <li>
                <LabeledSelect id="min-age" label="Von Alter" v-model="minAgeRef" :options="agesRef">
                </LabeledSelect>
              </li>
              <li>
                <LabeledSelect id="max-age" label="Bis Alter" v-model="maxAgeRef" :options="agesRef">
                </LabeledSelect>
              </li>
            </ul>

            <div>
              <!--<RadioGroup name="population" :options="chartTypeChoiceRef" v-model="chartTypeRef"></RadioGroup>-->
              <ul>
                <li>
                  <LabeledCheckbox id="less-aliens" label="Ohne Ausländer" v-model="lessAliensCheckboxRef">
                  </LabeledCheckbox>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-slot:info>
          <div class="population__reference">
            <strong>Quelle: </strong>
            <span>Statistisches Bundesamt (<a href="https://www.destatis.de" target="_blank">www.destatis.de</a>)</span><br>
          </div>
        </template>
      </Chart>
    </div>
  </article>
</template>

<style lang="scss">
.population {
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
.population {
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
