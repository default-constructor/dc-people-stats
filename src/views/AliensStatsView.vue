<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {ChartData} from '@/models/chart-data.model'
import Chart from '@/components/Chart.vue'
import LabeledSelect from '@/components/LabeledSelect.vue'
import StackedAreaGraph from '@/components/StackedAreaGraph.vue'
import {useAliensApi} from '@/apis/aliens.api';
import {AliensByAge, AliensByCountry, AliensBySex} from '@/models/aliens.model';
import RadioGroup from '@/components/RadioGroup.vue';
import {range} from 'd3';
import MultiSelect from '@/components/MultiSelect.vue';

const aliensRef = ref()
const aliensChartDataRef = ref([] as ChartData[])

const colors = [
  '#00d9ff',
  '#167322',
  '#ffcc00',
  '#ff0000',
  '#3a5cc4',
  '#00ffbb',
  '#aa00ff',
  '#97ceb5',
  '#193338',
  '#8c534c',
  '#7300ff',
  '#065d1c',
  '#a49765',
  '#247e8d',
  '#e600ff',
  '#ff6a00',
  '#0022ff',
  '#82cbdc',
  '#234f29',
  '#6e0c0c',
  '#2d8f2d',
  '#3a114f',
  '#694444',
  '#6b6b6b',
  '#c76b6b',
  '#7e427e',
  '#18317c',
  '#e54d4d',
  '#209620',
  '#a2a2a2',
  '#358600',
  '#70385c',
  '#142350',
  '#ff6200',
  '#64641b',
  '#4e1b69',
  '#c79089',
  '#08444f',
  '#3d9a49',
  '#c7c717',
  '#2a2929',
  '#ea3434',
  '#0000ff',
  '#113315',
  '#5eb8c9',
  '#5dc45d',
  '#4d004d',
  '#26269a',
  '#a8965e',
  '#7be37b',
  '#23419b',
  '#ce5656',
  '#0f3238',
  '#c24d97',
  '#6c4b47',
  '#8cf88c',
  '#2a562f',
  '#804511',
  '#c2c228',
  '#006577',
  '#1f8f71',
  '#494747',
  '#a4889a',
  '#ffff00',
  '#700900',
  '#479127',
  '#ff8134',
  '#2b6dfa',
  '#662280',
  '#f3cc27',
  '#108f78',
  '#8f1bd3',
  '#28d981',
  '#96c419',
  '#de1313',
  '#424fe0',
  '#68f158',
  '#dabb3c',
  '#3dbe9c',
  '#0c157c',
  '#3db9ce',
  '#5c229a',
  '#2dd209',
  '#ab3c83',
  '#494747',
  '#55b055',
  '#29298c',
  '#4b275d',
  '#7a5753',
  '#f5ab69',
  '#085612',
  '#a86ca8',
  '#e03a3a',
  '#483a04',
  '#a6a6a6',
  '#288f60',
  '#282880',
  '#bd69bd',
  '#3fc53f',
  '#a42e2e',
  '#2d545b',
  '#754821',
  '#85d7c1',
  '#713b8c',
  '#484848',
  '#910d91',
  '#5d9da8',
  '#16348f',
  '#79285b',
  '#227a22',
  '#bb938f',
  '#257281',
  '#c22525',
  '#adad4b',
  '#111162',
  '#376b3e',
  '#75448d',
  '#5d5a5a',
  '#3e913e',
  '#c77070',
  '#296d79',
  '#655c5c',
  '#67e1f6',
  '#733a73',
  '#257925',
  '#6e0c0c',
  '#4f774f',
  '#cb762b',
  '#494993',
  '#be1380',
  '#72b4c0',
  '#805e5a',
  '#4f4646',
  '#3b773b',
  '#da5959',
  '#5757cc',
  '#912d6d',
  '#2e8594',
  '#3333a2',
  '#a28481',
  '#95cbbc',
  '#722996',
  '#45814d',
  '#d25b5b',
  '#51b45e',
  '#0f673f',
  '#8c2727',
  '#2e2ebe',
  '#806161',
  '#8f7a26',
  '#700e4e',
  '#122e85',
  '#4a8852',
  '#813c81',
  '#232391',
  '#594c4c',
  '#b07b4d',
  '#0d6b7c',
  '#376037',
  '#b43333',
  '#d333d3',
  '#817878',
  '#4cb24c',
  '#3030b7',
  '#ff00ff',
  '#3ca8bb',
  '#919128',
  '#54c563',
  '#543f3c',
  '#a1a125',
  '#772e9b',
  '#8c1919',
  '#8484b2',
  '#570b57',
  '#9f6431',
  '#00ff00',
  '#abcdd3',
  '#a11770',
  '#9b9bfa',
  '#544f4f',
  '#444413',
  '#b22f2f',
  '#4ac44a',
  '#c44e99',
  '#24b28c',
  '#a84c4c',
  '#06064f',
  '#d5d518',
  '#62e762',
  '#a62177',
  '#28422b',
  '#6c4a4a',
  '#ff7700',
  '#3fa2b4',
  '#2a5240',
  '#8a1160',
  '#4a734f',
  '#a43dd7',
  '#69706d',
  '#ad1f1f',
  '#3edc3e',
  '#0d0d9b',
  '#e17211',
  '#e352b0',
  '#5e0e0e',
  '#7a681d',
  '#58b264',
  '#284449'
]

const countries = ref([
  'Ägypten',
  'Äquatorialguinea',
  'Äthiopien',
  'Afghanistan',
  'Albanien',
  'Algerien',
  'Andorra',
  'Angola',
  'Antigua und Barbuda',
  'Argentinien',
  'Armenien',
  'Aserbaidschan',
  'Australien',
  'Bahamas',
  'Bahrain',
  'Bangladesch',
  'Barbados',
  'Belarus',
  'Belgien',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivien, Plurinationaler Staat',
  'Bosnien und Herzegowina',
  'Botsuana',
  'Brasilien',
  'Britische Überseegebiete',
  'Brunei Darussalam',
  'Bulgarien',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Chile',
  'China',
  'Costa Rica',
  'Cote d\'Ivoire',
  'Dominica',
  'Dominikanische Republik',
  'Dschibuti',
  'Dänemark',
  'Ecuador',
  'El Salvador',
  'Eritrea',
  'Estland',
  'Eswatini',
  'Fidschi',
  'Finnland',
  'Frankreich',
  'Gabun',
  'Gambia',
  'Georgien',
  'Ghana',
  'Grenada',
  'Griechenland',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hongkong',
  'Indien',
  'Indonesien',
  'Irak',
  'Iran, Islamische Republik',
  'Irland',
  'Island',
  'Israel',
  'Italien',
  'Jamaika',
  'Japan',
  'Jemen',
  'Jordanien',
  'Jugoslawien, Bundesrep. (27.04.1992-04.02.2003)',
  'Jugoslawien, Soz. Föd. Republik (bis 26.04.1992)',
  'Kambodscha',
  'Kamerun',
  'Kanada',
  'Kasachstan',
  'Katar',
  'Kenia',
  'Kirgisistan',
  'Kiribati',
  'Kolumbien',
  'Komoren',
  'Kongo, Demokratische Republik',
  'Kongo, Republik',
  'Korea, Demokratische Volksrepublik',
  'Korea, Republik',
  'Kosovo',
  'Kroatien',
  'Kuba',
  'Kuwait',
  'Laos, Demokratische Volksrepublik',
  'Lesotho',
  'Lettland',
  'Libanon',
  'Liberia',
  'Libyen',
  'Liechtenstein',
  'Litauen',
  'Luxemburg',
  'Macau',
  'Madagaskar',
  'Malawi',
  'Malaysia',
  'Malediven',
  'Mali',
  'Malta',
  'Marokko',
  'Marshallinseln',
  'Mauretanien',
  'Mauritius',
  'Mexiko',
  'Mikronesien, Föderierte Staaten von',
  'Moldau, Republik',
  'Monaco',
  'Mongolei',
  'Montenegro (ab 03.06.2006)',
  'Mosambik',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Neuseeland',
  'Nicaragua',
  'Niederlande',
  'Niger',
  'Nigeria',
  'Nordmazedonien',
  'Norwegen',
  'Österreich',
  'Oman',
  'Pakistan',
  'Palau',
  'Palästinensische Gebiete',
  'Panama',
  'Papua-Neuguinea',
  'Paraguay',
  'Peru',
  'Philippinen',
  'Polen',
  'Portugal',
  'Ruanda',
  'Rumänien',
  'Russische Föderation',
  'Salomonen',
  'Sambia',
  'Samoa',
  'San Marino',
  'Sao Tome und Principe',
  'Saudi-Arabien',
  'Schweden',
  'Schweiz',
  'Senegal',
  'Serbien',
  'Serbien (einschl. Kosovo) (03.06.2006-16.02.2008)',
  'Serbien und Montenegro (05.02.2003-02.06.2006)',
  'Seychellen',
  'Sierra Leone',
  'Simbabwe',
  'Singapur',
  'Slowakei',
  'Slowenien',
  'Somalia',
  'Sowjetunion (bis 25.12.1991)',
  'Spanien',
  'Sri Lanka',
  'St. Kitts und Nevis',
  'St. Lucia',
  'St. Vincent und die Grenadinen',
  'Staatenlos',
  'Sudan (einschließlich Südsudan) (bis 08.07.2011)',
  'Sudan (ohne Südsudan) (ab 09.07.2011)',
  'Suriname',
  'Syrien',
  'Südafrika',
  'Südsudan (ab 09.07.2011)',
  'Tadschikistan',
  'Taiwan',
  'Tansania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad und Tobago',
  'Tschad',
  'Tschechien',
  'Tschechoslowakei (bis 31.12.1992)',
  'Tunesien',
  'Turkmenistan',
  'Tuvalu',
  'Türkei',
  'Uganda',
  'Ukraine',
  'Ungarn',
  'Ungeklärt / Ohne Angabe',
  'Uruguay',
  'Usbekistan',
  'Vanuatu',
  'Vatikanstadt',
  'Venezuela, Bolivarische Republik',
  'Vereinigte Arabische Emirate',
  'Vereinigte Staaten',
  'Vereinigtes Königreich',
  'Vietnam',
  'Zentralafrikanische Republik',
  'Zypern'
])

const ageGroups = range(0, 97).map((age, i) => {return {name: age < 96 ? age.toString() : 'Unbekannt', color: colors[i]}})
const countryGroups = countries.value.map((country, i) => {return {name: country, color: colors[i]}})
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
// const countriesRef = ref(['Afghanistan', 'Somalia', 'Staatenlos', 'Syrien', 'Ungeklärt / Ohne Angabe'])
const countriesRef = ref([])

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
  const country = [...new Set(data.map((aliens: AliensByCountry)  => aliens.country)).values()];
  return countryGroups
      .filter((item: any) => country.find((countryGroup: string) => countryGroup === item.name))
      .map((item: any) => item.color)
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
  loadAliensByAge(fromYearRef.value, toYearRef.value, minAgeRef.value, maxAgeRef.value, countriesRef.value)
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensByAgeChartData(aliensResult.value)
        ageColorsRef.value = retrieveAgeColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

const loadAliensByCountryData = () => {
  loadAliensByCountry(fromYearRef.value, toYearRef.value, countriesRef.value)
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensByCountryChartData(aliensResult.value)
        countryColorsRef.value = retrieveCountryColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

const loadAliensBySexData = () => {
  loadAliensBySex(fromYearRef.value, toYearRef.value, undefined, countriesRef.value)
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensBySexChartData(aliensResult.value)
        sexColorsRef.value = retrieveSexColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

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
                <LabeledSelect id="from-year" label="Von Anfang" v-model="fromYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
              <li>
                <LabeledSelect id="to-year" label="Bis Ende" v-model="toYearRef" :options="yearsRef">
                </LabeledSelect>
              </li>
            </ul>
            <MultiSelect :options="countries" :defaults="countriesRef" label="Länderauswahl" v-model="countriesRef"></MultiSelect>
            <RadioGroup name="aliens" :options="aliensRadioGroupRef" v-model="aliensChartRef"></RadioGroup>
          </div>
        </template>
        <template v-slot:info>
          <div class="aliens__reference">
            <strong>Quellen:</strong><br>
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
    margin: 0 128px;

    ul {
      list-style: none;
      min-width: 168px;
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
