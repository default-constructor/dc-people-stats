<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue'
import {ChartData} from '@/models/chart-data.model'
import Chart from '@/components/Chart.vue'
import LabeledSelect from '@/components/LabeledSelect.vue'
import StackedAreaGraph from '@/components/StackedAreaGraph.vue'
import LineGraph from '@/components/LineGraph.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import MultiSelect from '@/components/MultiSelect.vue'
import {viewStore} from '@/states/country.state'
import {useCrimeApi} from "@/apis/crime.api";
import {Crime, CrimeByKey, CrimeBySex} from "@/models/crime.model";
import {colors} from "@/constants/colors";
import {crimeMappings} from "@/constants/crimes";
import LabeledCheckbox from "@/components/LabeledCheckbox.vue";
import {useCrimeKeyApi} from "@/apis/crime-key.api";
import {CrimeKey} from "@/models/crime-key.model";
import {PopulationByPercentage} from "@/models/aliens.model";
import {usePopulationApi} from "@/apis/population.api";

const stackedAreaChartDataRef = ref([] as ChartData[])
const lineChartDataRef = ref()
const populationLineChartDataRef = ref()

const crimes = ref(new Map<string, string>(crimeMappings))
const crimesRef = ref()
const populationRef = ref()

const keyColors = ref(new Map<string, string>())
const sexGroups = [{name: 'männlich', color: '#00d9ff'}, {name: 'weiblich', color: '#ff4d4d'}]

let crimesChartTypeRef = ref('case')
const crimesRadioGroupRef = ref([
  {id: 'crimes-by-case', label: 'Nach Fall', value: 'case', checked: true},
  {id: 'crimes-by-suspects', label: 'Nach Tatverdächtigen', value: 'suspects', checked: false},
  {id: 'crimes-by-non-german-percentage', label: 'Nach Anteil ausländischer Tatverdächtiger', value: 'non-german-percentage', checked: false},
  {id: 'crimes-by-sex', label: 'Nach Geschlecht', value: 'sex', checked: false}
])

const maxPositiveYValueRef = ref(0)
const xLabelsRef = ref([] as string[])
const sexColorsRef = ref()

const fromYearRef = ref(2012)
const toYearRef = ref(2021)
const cleanCasesCheckboxRef = ref()
const sumCasesCheckboxRef = ref()
const showForeignPopulationPercentageRef = ref()
const sumSuspectsCheckboxRef = ref()
const showForeignSuspectsCheckboxRef = ref()

let defaultFilters = viewStore.selectedFilters.get('crimes') as string[];
if (!defaultFilters || defaultFilters.length === 0) {
  defaultFilters = ['000000']
  viewStore.setSelectedFilters('crimes', defaultFilters)
}
const keysRef = ref(defaultFilters)

const minYear = 2012;
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))

const {loadCrimeKeys, crimeKeysResult} = useCrimeKeyApi()
const {loadCrimes, loadCrimesByKey, loadCrimesBySuspects, loadCrimesBySex, crimesResult} = useCrimeApi()
const {loadPopulationByPercentage, populationResult} = usePopulationApi()

const crimeKeys = ref()
await loadCrimeKeys().then(() =>
  crimeKeys.value = new Map<string, string>(crimeKeysResult.value.filter((crimeKey: CrimeKey) => crimeKey.key).map((crimeKey: CrimeKey) => [crimeKey.key, crimeKey.description]).sort())
)

const retrieveNonGermanPercentageChartData = (data: Crime[]): Map<string, ChartData[]> => {
  const map = new Map();
  data.forEach(d => {
    if (!map.has(d.key)) {
      map.set(d.key, [])
    }
    let amountSuspects = d.amountMaleSuspects + d.amountFemaleSuspects;
    map.set(d.key, [...map.get(d.key), {
      x: d.year,
      y: amountSuspects !== 0 ? Number((d.amountNonGermanSuspects * 100 / amountSuspects).toFixed(2)) : 0
    }])
  })
  return map
}

const retrieveCrimeByKeyChartData = (data: CrimeByKey[]): ChartData[] => {
  return data.map((d => {
    return {
      x: d.year,
      y: d.count,
      z: d.key
    } as ChartData
  }))
}

const retrieveCrimeBySexChartData = (data: CrimeBySex[]): ChartData[] => {
  return data.map((d => {
    return {
      x: d.year,
      y: d.count,
      z: d.sex
    } as ChartData
  }))
}

const retrievePopulationLineChartData = (data: PopulationByPercentage[]): ChartData[] => {
  return data.map((d => {
    return {
      x: d.year,
      y: d.percentage,
    } as ChartData
  }))
}

const retrieveKeyColors = (keys: string[]) => {
  const map = new Map<string, string>();
  if ((crimesChartTypeRef.value === 'case' && sumCasesCheckboxRef.value) ||
      (crimesChartTypeRef.value === 'suspects' && sumSuspectsCheckboxRef.value)) {
    map.set('summary', '#6b6b6b')
  } else {
    keys.forEach((key, i) => {
      map.set(key, colors[i])
    })
  }

  return map
}

const retrieveSexColors = (data: CrimeBySex[]) => {
  const sex = [...new Set(data.map((crime: CrimeBySex) => crime.sex)).values()];
  return sexGroups
      .filter((group: any) => sex.find((s: string) => s === group.name))
      .map((group: any) => group.color)
}

const retrieveGroupedData = (data: ChartData[]) => {
  const grouped = new Map()
  for (const d of data) {
    const sum = (grouped.has(d.x) ? grouped.get(d.x) : 0) + d.y
    grouped.set(d.x, sum)
  }

  return grouped
}

const loadNonGermanPercentageData = () => {
  loadCrimes(fromYearRef.value, toYearRef.value, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        lineChartDataRef.value = retrieveNonGermanPercentageChartData(crimesResult.value)
        keyColors.value = retrieveKeyColors([...new Set(crimesResult.value.map((crime: Crime) => crime.key)).values()] as string[])
        xLabelsRef.value = [...new Set(crimesResult.value.map((d: Crime) => d.year) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...[...lineChartDataRef.value.values()].flat().map(value => value.y) as number[])
      })
}

const loadCrimeByKeyData = () => {
  loadCrimesByKey(fromYearRef.value, toYearRef.value, cleanCasesCheckboxRef.value, sumCasesCheckboxRef.value, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        stackedAreaChartDataRef.value = retrieveCrimeByKeyChartData(crimesResult.value)
        keyColors.value = retrieveKeyColors([...new Set(crimesResult.value.map((crime: CrimeByKey) => crime.key)).values()] as string[])
        xLabelsRef.value = [...new Set(stackedAreaChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(stackedAreaChartDataRef.value).values()) as number[])
      })
}

const loadCrimeBySuspectsData = () => {
  loadCrimesBySuspects(fromYearRef.value, toYearRef.value, showForeignSuspectsCheckboxRef.value, sumSuspectsCheckboxRef.value, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        stackedAreaChartDataRef.value = retrieveCrimeByKeyChartData(crimesResult.value)
        keyColors.value = retrieveKeyColors([...new Set(crimesResult.value.map((crime: CrimeByKey) => crime.key)).values()] as string[])
        xLabelsRef.value = [...new Set(stackedAreaChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(stackedAreaChartDataRef.value).values()) as number[])
      })
}

const loadCrimeBySexData = () => {
  loadCrimesBySex(fromYearRef.value, toYearRef.value, undefined, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        stackedAreaChartDataRef.value = retrieveCrimeBySexChartData(crimesResult.value)
        sexColorsRef.value = retrieveSexColors(crimesResult.value)
        xLabelsRef.value = [...new Set(stackedAreaChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(stackedAreaChartDataRef.value).values()) as number[])
      })
}

const loadPopulationByPercentageData = () => {
  loadPopulationByPercentage(fromYearRef.value, toYearRef.value)
      .then(() => {
        populationRef.value = populationResult.value
        populationLineChartDataRef.value = retrievePopulationLineChartData(populationResult.value)
      })
}

watch(showForeignPopulationPercentageRef, showForeignSuspectsCheckbox => {
  if (showForeignSuspectsCheckbox) {
    loadPopulationByPercentageData()
  } else {
    populationLineChartDataRef.value = []
  }
})

watch(keysRef, keys => {
  viewStore.setSelectedFilters('crimes', keys)
})

watchEffect(() => {
  if (
      fromYearRef.value ||
      toYearRef.value ||
      keysRef.value ||
      cleanCasesCheckboxRef.value ||
      sumCasesCheckboxRef.value ||
      sumSuspectsCheckboxRef.value ||
      showForeignSuspectsCheckboxRef.value
  ) {
    switch (crimesChartTypeRef.value) {
      case 'case':
        loadCrimeByKeyData()
        break
      case 'non-german-percentage':
        loadNonGermanPercentageData()
        break
      case 'sex':
        loadCrimeBySexData()
        break
      case 'suspects':
        loadCrimeBySuspectsData()
        break
    }
  }
})
</script>

<template>
  <article id="crimes-stats-view">
    <div class="crimes">
      <Chart id="crimes-stats-chart" :xLabels="xLabelsRef" :maxPositiveYValue="maxPositiveYValueRef"
             :maxNegativeYValue="0">
        <template v-slot:graph="slotProps">
          <StackedAreaGraph
              v-if="crimesChartTypeRef === 'case'"
              :scale="slotProps.scale"
              :chartData="stackedAreaChartDataRef"
              :colors="Array.from(keyColors.values())"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="crimesChartTypeRef === 'sex'"
              :scale="slotProps.scale"
              :chartData="stackedAreaChartDataRef"
              :colors="sexColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="crimesChartTypeRef === 'suspects'"
              :scale="slotProps.scale"
              :chartData="stackedAreaChartDataRef"
              :colors="Array.from(keyColors.values())"
          >
          </StackedAreaGraph>
          <template v-if="crimesChartTypeRef === 'non-german-percentage'">
            <LineGraph
                v-for="([key, value], i) in lineChartDataRef"
                :scale="slotProps.scale"
                :chartData="value"
                :color="keyColors.get(key)"
                :cssClass="'crime-' + i"
            >
            </LineGraph>
          </template>
          <LineGraph
              v-if="crimesChartTypeRef === 'non-german-percentage' && showForeignPopulationPercentageRef"
              :scale="slotProps.scale"
              :chartData="populationLineChartDataRef"
              color="#000000"
              cssClass="population-percentage"
          >
          </LineGraph>
        </template>
        <template v-slot:legend>
          <div class="crimes__legend">
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
            <div>
              <RadioGroup name="crimes" :options="crimesRadioGroupRef" v-model="crimesChartTypeRef"></RadioGroup>
              <LabeledCheckbox
                  v-if="crimesChartTypeRef === 'case'" id="sum-cases" label="Fälle zusammenfassen"
                  v-model="sumCasesCheckboxRef">
              </LabeledCheckbox>
              <LabeledCheckbox
                  v-if="crimesChartTypeRef === 'suspects'" id="sum-suspects" label="Tatverdächtige zusammenfassen"
                  v-model="sumSuspectsCheckboxRef">
              </LabeledCheckbox>
              <LabeledCheckbox
                  v-if="crimesChartTypeRef === 'suspects'" id="sum-cases" label="Ausländische Tatverdächtige anzeigen"
                  v-model="showForeignSuspectsCheckboxRef">
              </LabeledCheckbox>
              <LabeledCheckbox
                  v-if="crimesChartTypeRef === 'non-german-percentage'" id="show-foreign-population-percentage"
                  label="Anteil der ausländischen Bevölkerung anzeigen" v-model="showForeignPopulationPercentageRef">
              </LabeledCheckbox>
            </div>
            <MultiSelect :options="crimeKeys" :defaults="keysRef" label="Straftatensuche" v-model="keysRef"></MultiSelect>
          </div>
        </template>
        <template v-slot:info>
          <div class="crimes__reference">
            <strong>Quelle: </strong>
            <span>Bundeskriminalamt (<a href="https://www.bka.de" target="_blank">www.bka.de</a>)</span><br>
          </div>
        </template>
      </Chart>
    </div>
  </article>
</template>

<style lang="scss">
.crimes {
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
.crimes {
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
