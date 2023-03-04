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

const crimesRef = ref()
const crimesChartDataRef = ref([] as ChartData[])
const suspectsChartDataRef = ref()

const crimes = ref(new Map([
  ['000000', 'Straftaten gegen das Leben'],
  ['010000', 'Mord § 211 StGB'],
  ['010079', 'Sonstiger Mord'],
  ['011000', 'Mord im Zusammenhang mit Raubdelikten'],
  ['012000', 'Mord im Zusammenhang mit Sexualdelikten'],
  ['020010', 'Totschlag § 212 StGB'],
  ['020020', 'Minder schwerer Totschlag § 213 StGB'],
  ['020030', 'Tötung auf Verlangen § 216 StGB'],
  ['100000', 'Straftaten gegen die sexuelle Selbstbestimmung'],
  ['110000', 'Straftaten gegen die sexuelle Selbstbestimmung §§ 174, 174a, 174b, 174c, 177, 178, 184i, 184j StGB'],
  ['111000', 'Vergewaltigung, sexuelle Nötigung und sexueller Übergriff im besonders schweren Fall einschl. mit Todesfolge §§ 177, 178 StGB'],
  ['111100', 'Vergewaltigung überfallartig (Einzeltäter) § 177 Abs. 2 Nr. 1, Abs. 3 und 4 StGB'],
  ['111200', 'Vergewaltigung überfallartig (durch Gruppen) § 177 Abs. 2 Nr. 2 StGB'],
  ['111300', 'Vergewaltigung durch Gruppen § 177 Abs. 2 Nr. 2 StGB'],
  ['111400', 'Sonstige Straftaten gemäß § 177 Abs. 2 Nr. 1, Abs. 3 und 4 StGB'],
  ['111500', 'Vergewaltigung/sexuelle Nötigung mit Todesfolge § 178 StGB'],
  ['111600', 'Sexuelle Übergriffe § 177 Abs. 1, 2, 3, 4, 7, 8 und 9 StGB'],
  ['111700', 'Vergewaltigung § 177 Abs. 6, 7, 8 StGB'],
  ['111710', 'Vergewaltigung § 177 Abs. 6 Nr. 1, 2 StGB (ohne Schlüssel 111730)'],
  ['111720', 'Vergewaltigung im besonders schweren Fall § 177 Abs. 6 Nr. 1, 2 i. V. m. Abs. 7, 8 StGB'],
  ['111730', 'Vergewaltigung von widerstandsunfähigen Personen (§ 177 Abs. 2 Nr. 1, Abs. 4) gem. § 177 Abs. 6 Nr. 1, 2 StGB'],
  ['111800', 'Sexueller Übergriff und sexuelle Nötigung im besonders schweren Fall § 177 Abs. 1, 2, 4, 5 i. V. m. Abs. 6 Nr. 2, Abs. 7, 8 StGB'],
  ['111810', 'Sexueller Übergriff im besonders schweren Fall § 177 Abs. 1, 2 (ohne Nr. 1) i. V. m. Abs. 6 Nr. 2, Abs. 7, 8 StGB'],
  ['111820', 'Sexuelle Nötigung im besonders schweren Fall § 177 Abs. 5 i.V.m. Abs. 6 Nr. 2, Abs. 7, 8 StGB'],
  ['111830', 'Sexueller Übergriff an widerstandsunfähigen Personen im besonders schweren Fall § 177 Abs. 2 Nr. 1, Abs. 4 i. V. m. Abs. 6 Nr. 2, Abs. 7, 8 StGB'],
  ['111900', 'Sexueller Übergriff, sexuelle Nötigung und Vergewaltigung mit Todesfolge § 178 StGB'],
  ['112000', 'Sonstige sexuelle Nötigung § 177 Abs. 1 und 5 StGB'],
  ['112100', 'Sexueller Übergriff und sexuelle Nötigung § 177 Abs. 1, 2, 4, 5, 9 StGB'],
  ['112110', 'Sexueller Übergriff § 177 Abs. 1, 2 (ohne Nr. 1), 9 StGB'],
  ['112120', 'Sexuelle Nötigung § 177 Abs. 5, 9 StGB'],
  ['112130', 'Sexueller Übergriff an widerstandsunfähigen Personen § 177 Abs. 2 Nr. 1, Abs. 4, 9 StGB'],
  ['113000', 'Sexueller Missbrauch von Schutzbefohlenen pp., unter Ausnutzung einer Amtsstellung oder eines Vertrauensverhältnisses §§ 174, 174a-c StGB'],
  ['113010', 'Sexueller Missbrauch von Schutzbefohlenen ab 14 Jahren § 174 StGB'],
  ['113020', 'Sexueller Missbrauch von Gefangenen/Verwahrten usw. ab 14 Jahren § 174a StGB'],
  ['113030', 'Sexueller Missbrauch - Ausnutzung einer Amtsstellung zum Nachteil von Personen ab 14 Jahren § 174b StGB'],
  ['113040', 'Sexueller Missbrauch - Ausnutzung eines Beratungs-/Behandlungs-/Betreuungsverhältnisses zum Nachteil von Personen ab 14 Jahren § 174c StGB'],
  ['114000', 'Sexuelle Belästigung § 184i StGB'],
  ['115000', 'Straftaten aus Gruppen § 184j StGB'],
  ['130000', 'Sexueller Missbrauch §§ 176, 176a, 176b, 182, 183, 183a StGB'],
  ['131000', 'Sexueller Missbrauch von Kindern §§ 176, 176a, 176b StGB'],
  ['131010', 'Sexuelle Handlungen § 176 Abs. 5 StGB'],
  ['131100', 'Sexuelle Handlungen § 176 Abs. 1 und 2 StGB'],
  ['131200', 'Exhibitionistische/sexuelle Handlungen vor Kindern § 176 Abs. 4 Nr. 1 StGB'],
  ['131300', 'Sexuelle Handlungen § 176 Abs. 4 Nr. 2 StGB'],
  ['131400', 'Einwirken auf Kinder § 176 Abs. 4 Nr. 3 und 4 StGB'],
  ['131500', 'Vollzug des Beischlafs mit einem Kind oder Vornahme einer ähnlichen sexuellen Handlung § 176a Abs. 2 Nr. 1 StGB'],
  ['131600', 'Schwerer sexueller Missbrauch von Kindern zur Herstellung und Verbreitung pornografischer Schriften § 176a Abs. 3 StGB'],
  ['131700', 'Sonstiger schwerer sexueller Missbrauch von Kindern § 176a StGB'],
  ['131800', 'Sexueller Missbrauch von Kindern mit Todesfolge § 176b StGB'],
  ['132000', 'Exhibitionistische Handlungen und Erregung öffentlichen Ärgernisses §§ 183, 183a StGB'],
  ['132010', 'Exhibitionistische Handlungen § 183 StGB'],
  ['132020', 'Erregung öffentlichen Ärgernisses § 183a StGB'],
  ['133000', 'Sexueller Missbrauch von Jugendlichen § 182 StGB'],
  ['133100', 'Sexueller Missbrauch von Jugendlichen gegen Entgelt § 182 Abs. 2 StGB'],
  ['133700', 'Sonstiger Sexueller Missbrauch von Jugendlichen § 182 StGB'],
  ['134000', 'Sexueller Missbrauch Widerstandsunfähiger § 179 StGB'],
  ['140000', 'Ausnutzen sexueller Neigung §§ 180, 180a, 181a, 184, 184a, 184b, 184c, 184d, 184e, 184f, 184g, 184k StGB'],
  ['140010', 'Ausübung der verbotenen Prostitution § 184f StGB'],
  ['140020', 'Jugendgefährdende Prostitution § 184g StGB'],
  ['141000', 'Förderung sexueller Handlungen Minderjähriger oder Ausbeuten von Prostituierten §§ 180, 180a StGB'],
  ['141100', 'Förderung sexueller Handlungen Minderjähriger § 180 StGB'],
  ['141110', 'Förderung sexueller Handlungen Minderjähriger durch Vermittlung oder gegen Entgelt § 180 Abs. 1, Nr. 1, Abs. 2 StGB'],
  ['141179', 'Sonstige Förderung sexueller Handlungen Minderjähriger § 180 StGB'],
  ['141200', 'Ausbeuten von Prostituierten § 180a StGB'],
  ['142000', 'Zuhälterei § 181a StGB'],
  ['143000', 'Verbreitung pornografischer Schriften (Erzeugnisse) §§ 184, 184a, 184b, 184c, 184d, 184e StGB'],
  ['143010', 'Sonstige Verbreitung pornografischer Schriften (Erzeugnisse) § 184 StGB'],
  ['143020', 'Verbreitung gewalt- oder tierpornografischer Schriften § 184a StGB'],
  ['143030', 'Zugänglichmachen pornografischer Inhalte mittels Rundfunk oder Telemedien'],
  ['143040', 'Veranstaltung und Besuch kinder- und jugendpornografischer Darbietungen § 184e StGB'],
  ['143100', 'Verbreitung pornografischer Schriften (Erzeugnisse) an Personen unter 18 Jahren § 184 Abs. 1 Nr. 1, 2, 5 StGB'],
  ['143200', 'Verbreitung, Erwerb, Besitz und Herstellung kinderpornografischer Schriften § 184b StGB'],
  ['143210', 'Verbreitung, Erwerb, Besitz und Herstellung von Kinderpornografie § 184b Abs. 1 StGB'],
  ['143211', 'Verbreitung von Kinderpornografie § 184b Abs. 1 Nr. 1 StGB'],
  ['143212', 'Besitzverschaffung für andere von Kinderpornografie § 184b Abs. 1 Nr. 2 StGB'],
  ['143213', 'Herstellung auch ohne Verbreitungsabsicht von Kinderpornografie mit tatsächlichem Geschehen § 184b Abs. 1 Nr. 3 StGB'],
  ['143214', 'Herstellung mit Verbreitungsabsicht von Kinderpornografie § 184b Abs. 1 Nr. 4 StGB'],
  ['143220', 'Verbreitung und Herstellung von Kinderpornografie gewerbs-/bandenmäßig § 184b Abs. 2 StGB'],
  ['143230', 'Besitz oder sich Verschaffen von Kinderpornografie § 184b Abs. 3 StGB'],
  ['143300', 'Besitz/Verschaffung von Kinderpornographie gemäß § 184b Abs. 2 und 4 StGB'],
  ['143400', 'Verbreitung von Kinderpornographie gemäß § 184b Abs. 1 StGB'],
  ['143500', 'Verbreitung, Erwerb, Besitz und Herstellung jugendpornografischer Schriften § 184c StGB'],
  ['143510', 'Verbreitung, Erwerb, Besitz und Herstellung von Jugendpornografie § 184c Abs. 1 StGB'],
  ['143511', 'Verbreitung von Jugendpornografie § 184c Abs. 1 Nr. 1 StGB'],
  ['143512', 'Besitzverschaffung für andere von Jugendpornografie § 184c Abs. 1 Nr. 2 StGB'],
  ['143513', 'Herstellung auch ohne Verbreitungsabsicht mit tatsächlichem Geschehen von Jugendpornografie § 184c Abs. 1 Nr. 3 StGB'],
  ['143514', 'Herstellung mit Verbreitungsabsicht von Jugendpornografie § 184c Abs. 1 Nr. 4 StGB'],
  ['143520', 'Verbreitung und Herstellung von Jugendpornografie gewerbs-/bandenmäßig § 184c Abs. 2 StGB'],
  ['143530', 'Besitz oder sich Verschaffen von Jugendpornografie § 184c Abs. 3 StGB'],
  ['143600', 'Besitz/Verschaffung von Jugendpornographie gemäß § 184c Abs. 2 und 4 StGB'],
  ['143700', 'Verbreitung von Jugendpornographie gemäß § 184c Abs. 1 StGB'],
  ['145000', 'Verletzung des Intimbereichs durch Bildaufnahmen § 184k StGB'],
  ['200000', 'Rohheitsdelikte und Straftaten gegen die persönliche Freiheit'],
  ['3***00', 'Diebstahl ohne erschwerende Umstände'],
  ['4***00', 'Diebstahl unter erschwerenden Umständen'],
  ['500000', 'Vermögens- und Fälschungsdelikte'],
  ['600000', 'Sonstige Straftatbestände'],
  ['700000', 'Strafrechtliche Nebengesetze']
]))

const keyColors = ref(new Map<string, string>())
Array.from(crimes.value.keys()).forEach((key, i) => {
  keyColors.value.set(key, colors[i])
})

const sexGroups = [{name: 'männlich', color: '#00d9ff'}, {name: 'weiblich', color: '#ff4d4d'}]

let crimesChartTypeRef = ref('suspects')
const crimesRadioGroupRef = ref([
  {id: 'crimes-by-suspects', label: 'Nach Anteil ausländischer Tatverdächtiger', value: 'suspects', checked: true},
  {id: 'crimes-by-key', label: 'Nach Schlüssel', value: 'key', checked: false},
  {id: 'crimes-by-sex', label: 'Nach Geschlecht', value: 'sex', checked: false}
])

const maxPositiveYValueRef = ref(0)
const xLabelsRef = ref([] as string[])
const keyColorsRef = ref()
const sexColorsRef = ref()

const fromYearRef = ref(2012)
const toYearRef = ref(2021)

let defaultFilters = viewStore.selectedFilters.get('crimes') as string[];
if (!defaultFilters || defaultFilters.length === 0) {
  defaultFilters = ['000000']
  viewStore.setSelectedFilters('crimes', defaultFilters)
}
const keysRef = ref(defaultFilters)

const minYear = 2012;
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))

const {loadCrimes, loadCrimesByKey, loadCrimesBySex, crimesResult} = useCrimeApi()

const retrieveCrimeChartData = (data: Crime[]): Map<string, ChartData[]> => {
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
  })).sort((a, b) => (a.z as string).localeCompare(b.z as string, 'de'))
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

const retrieveKeyColors = (keys: string[]) => {
  return keys.map(key => keyColors.value.get(key))
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

const loadCrimesData = () => {
  loadCrimes(fromYearRef.value, toYearRef.value, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        suspectsChartDataRef.value = retrieveCrimeChartData(crimesResult.value)
        keyColorsRef.value = retrieveKeyColors([...new Set(crimesResult.value.map((crime: Crime) => crime.key)).values()] as string[])
        xLabelsRef.value = [...new Set(crimesResult.value.map((d: Crime) => d.year) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...[...suspectsChartDataRef.value.values()].flat().map(value => value.y) as number[])
      })
}

const loadCrimeByKeyData = () => {
  loadCrimesByKey(fromYearRef.value, toYearRef.value, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        crimesChartDataRef.value = retrieveCrimeByKeyChartData(crimesResult.value)
        keyColorsRef.value = retrieveKeyColors([...new Set(crimesResult.value.map((crime: CrimeByKey) => crime.key)).values()] as string[])
        xLabelsRef.value = [...new Set(crimesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(crimesChartDataRef.value).values()) as number[])
      })
}

const loadCrimeBySexData = () => {
  loadCrimesBySex(fromYearRef.value, toYearRef.value, undefined, keysRef.value)
      .then(() => {
        crimesRef.value = crimesResult.value
        crimesChartDataRef.value = retrieveCrimeBySexChartData(crimesResult.value)
        sexColorsRef.value = retrieveSexColors(crimesResult.value)
        xLabelsRef.value = [...new Set(crimesChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(crimesChartDataRef.value).values()) as number[])
      })
}

watch(keysRef, keys => {
  viewStore.setSelectedFilters('crimes', keys)
})

watchEffect(() => {
  if (fromYearRef.value || toYearRef.value || keysRef.value) {
    if (crimesChartTypeRef.value === 'suspects') {
      loadCrimesData()
    }
    if (crimesChartTypeRef.value === 'key') {
      loadCrimeByKeyData()
    }
    if (crimesChartTypeRef.value === 'sex') {
      loadCrimeBySexData()
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
              v-if="crimesChartTypeRef === 'key'"
              :scale="slotProps.scale"
              :chartData="crimesChartDataRef"
              :colors="keyColorsRef"
          >
          </StackedAreaGraph>
          <StackedAreaGraph
              v-if="crimesChartTypeRef === 'sex'"
              :scale="slotProps.scale"
              :chartData="crimesChartDataRef"
              :colors="sexColorsRef"
          >
          </StackedAreaGraph>
          <template v-if="crimesChartTypeRef === 'suspects'">
            <LineGraph
                v-for="([key, value], i) in suspectsChartDataRef"
                :scale="slotProps.scale"
                :chartData="value"
                :color="keyColorsRef[i]"
                :cssClass="'crime-' + i"
            >
            </LineGraph>
          </template>
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
            <RadioGroup name="crimes" :options="crimesRadioGroupRef" v-model="crimesChartTypeRef"></RadioGroup>
            <MultiSelect :options="crimes" :defaults="keysRef" :colors="keyColors" label="Schlüsselauswahl"
                         v-model="keysRef"></MultiSelect>
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
