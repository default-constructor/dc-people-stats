<script setup lang="ts">
import {ref, watchEffect} from "vue"
import {ChartData} from "@/models/chart-data.model"
import Chart from "@/components/Chart.vue"
import LabeledSelect from "@/components/LabeledSelect.vue"
import StackedAreaGraph from "@/components/StackedAreaGraph.vue"
import {useAliensApi} from "@/apis/aliens.api";
import {AliensByCountry, AliensBySex} from "@/models/aliens.model";

const aliensRef = ref()
const aliensChartDataRef = ref([] as ChartData[])
const yearLinesDataRef = ref()

const sexGroups = [{name: "männlich", color: "#00d9ff"}, {name: "weiblich", color: "#ff4d4d"}]
const countries = [
  {name: 'Ägypten', color: "#00d9ff"},
  {name: 'Äquatorialguinea', color: "#00d9ff"},
  {name: 'Äthiopien', color: "#00d9ff"},
  {name: 'Afghanistan', color: "#ff0000"},
  {name: 'Albanien', color: "#00d9ff"},
  {name: 'Algerien', color: "#00d9ff"},
  {name: 'Andorra', color: "#00d9ff"},
  {name: 'Angola', color: "#00d9ff"},
  {name: 'Antigua und Barbuda', color: "#00d9ff"},
  {name: 'Argentinien', color: "#00d9ff"},
  {name: 'Armenien', color: "#00d9ff"},
  {name: 'Aserbaidschan', color: "#00d9ff"},
  {name: 'Australien', color: "#00d9ff"},
  {name: 'Bahamas', color: "#00d9ff"},
  {name: 'Bahrain', color: "#00d9ff"},
  {name: 'Bangladesch', color: "#00d9ff"},
  {name: 'Barbados', color: "#00d9ff"},
  {name: 'Belarus', color: "#00d9ff"},
  {name: 'Belgien', color: "#00d9ff"},
  {name: 'Belize', color: "#00d9ff"},
  {name: 'Benin', color: "#00d9ff"},
  {name: 'Bhutan', color: "#00d9ff"},
  {name: 'Bolivien, Plurinationaler Staat', color: "#00d9ff"},
  {name: 'Bosnien und Herzegowina', color: "#00d9ff"},
  {name: 'Botsuana', color: "#00d9ff"},
  {name: 'Brasilien', color: "#00d9ff"},
  {name: 'Britische Überseegebiete', color: "#00d9ff"},
  {name: 'Brunei Darussalam', color: "#00d9ff"},
  {name: 'Bulgarien', color: "#00d9ff"},
  {name: 'Burkina Faso', color: "#00d9ff"},
  {name: 'Burundi', color: "#00d9ff"},
  {name: 'Cabo Verde', color: "#00d9ff"},
  {name: 'Chile', color: "#00d9ff"},
  {name: 'China', color: "#00d9ff"},
  {name: 'Costa Rica', color: "#00d9ff"},
  {name: 'Cote d\'Ivoire', color: "#00d9ff"},
  {name: 'Dominica', color: "#00d9ff"},
  {name: 'Dominikanische Republik', color: "#00d9ff"},
  {name: 'Dschibuti', color: "#00d9ff"},
  {name: 'Dänemark', color: "#00d9ff"},
  {name: 'Ecuador', color: "#00d9ff"},
  {name: 'El Salvador', color: "#00d9ff"},
  {name: 'Eritrea', color: "#0000ff"},
  {name: 'Estland', color: "#00d9ff"},
  {name: 'Eswatini', color: "#00d9ff"},
  {name: 'Fidschi', color: "#00d9ff"},
  {name: 'Finnland', color: "#00d9ff"},
  {name: 'Frankreich', color: "#00d9ff"},
  {name: 'Gabun', color: "#00d9ff"},
  {name: 'Gambia', color: "#00d9ff"},
  {name: 'Georgien', color: "#00d9ff"},
  {name: 'Ghana', color: "#00d9ff"},
  {name: 'Grenada', color: "#00d9ff"},
  {name: 'Griechenland', color: "#00d9ff"},
  {name: 'Guatemala', color: "#00d9ff"},
  {name: 'Guinea', color: "#00d9ff"},
  {name: 'Guinea-Bissau', color: "#00d9ff"},
  {name: 'Guyana', color: "#00d9ff"},
  {name: 'Haiti', color: "#00d9ff"},
  {name: 'Honduras', color: "#00d9ff"},
  {name: 'Hongkong', color: "#00d9ff"},
  {name: 'Indien', color: "#00d9ff"},
  {name: 'Indonesien', color: "#00d9ff"},
  {name: 'Irak', color: "#ffff00"},
  {name: 'Iran, Islamische Republik', color: "#00d9ff"},
  {name: 'Irland', color: "#00d9ff"},
  {name: 'Island', color: "#00d9ff"},
  {name: 'Israel', color: "#00d9ff"},
  {name: 'Italien', color: "#00d9ff"},
  {name: 'Jamaika', color: "#00d9ff"},
  {name: 'Japan', color: "#00d9ff"},
  {name: 'Jemen', color: "#00d9ff"},
  {name: 'Jordanien', color: "#00d9ff"},
  {name: 'Jugoslawien, Bundesrep. (27.04.1992-04.02.2003)', color: "#00d9ff"},
  {name: 'Jugoslawien, Soz. Föd. Republik (bis 26.04.1992)', color: "#00d9ff"},
  {name: 'Kambodscha', color: "#00d9ff"},
  {name: 'Kamerun', color: "#00d9ff"},
  {name: 'Kanada', color: "#00d9ff"},
  {name: 'Kasachstan', color: "#00d9ff"},
  {name: 'Katar', color: "#00d9ff"},
  {name: 'Kenia', color: "#00d9ff"},
  {name: 'Kirgisistan', color: "#00d9ff"},
  {name: 'Kiribati', color: "#00d9ff"},
  {name: 'Kolumbien', color: "#00d9ff"},
  {name: 'Komoren', color: "#00d9ff"},
  {name: 'Kongo, Demokratische Republik', color: "#00d9ff"},
  {name: 'Kongo, Republik', color: "#00d9ff"},
  {name: 'Korea, Demokratische Volksrepublik', color: "#00d9ff"},
  {name: 'Korea, Republik', color: "#00d9ff"},
  {name: 'Kosovo', color: "#00d9ff"},
  {name: 'Kroatien', color: "#00d9ff"},
  {name: 'Kuba', color: "#00d9ff"},
  {name: 'Kuwait', color: "#00d9ff"},
  {name: 'Laos, Demokratische Volksrepublik', color: "#00d9ff"},
  {name: 'Lesotho', color: "#00d9ff"},
  {name: 'Lettland', color: "#00d9ff"},
  {name: 'Libanon', color: "#00d9ff"},
  {name: 'Liberia', color: "#00d9ff"},
  {name: 'Libyen', color: "#00d9ff"},
  {name: 'Liechtenstein', color: "#00d9ff"},
  {name: 'Litauen', color: "#00d9ff"},
  {name: 'Luxemburg', color: "#00d9ff"},
  {name: 'Macau', color: "#00d9ff"},
  {name: 'Madagaskar', color: "#00d9ff"},
  {name: 'Malawi', color: "#00d9ff"},
  {name: 'Malaysia', color: "#00d9ff"},
  {name: 'Malediven', color: "#00d9ff"},
  {name: 'Mali', color: "#00d9ff"},
  {name: 'Malta', color: "#00d9ff"},
  {name: 'Marokko', color: "#00d9ff"},
  {name: 'Marshallinseln', color: "#00d9ff"},
  {name: 'Mauretanien', color: "#00d9ff"},
  {name: 'Mauritius', color: "#00d9ff"},
  {name: 'Mexiko', color: "#00d9ff"},
  {name: 'Mikronesien, Föderierte Staaten von', color: "#00d9ff"},
  {name: 'Moldau, Republik', color: "#00d9ff"},
  {name: 'Monaco', color: "#00d9ff"},
  {name: 'Mongolei', color: "#00d9ff"},
  {name: 'Montenegro (ab 03.06.2006)', color: "#00d9ff"},
  {name: 'Mosambik', color: "#00d9ff"},
  {name: 'Myanmar', color: "#00d9ff"},
  {name: 'Namibia', color: "#00d9ff"},
  {name: 'Nauru', color: "#00d9ff"},
  {name: 'Nepal', color: "#00d9ff"},
  {name: 'Neuseeland', color: "#00d9ff"},
  {name: 'Nicaragua', color: "#00d9ff"},
  {name: 'Niederlande', color: "#00d9ff"},
  {name: 'Niger', color: "#00d9ff"},
  {name: 'Nigeria', color: "#00d9ff"},
  {name: 'Nordmazedonien', color: "#00d9ff"},
  {name: 'Norwegen', color: "#00d9ff"},
  {name: 'Österreich', color: "#00d9ff"},
  {name: 'Oman', color: "#00d9ff"},
  {name: 'Pakistan', color: "#00d9ff"},
  {name: 'Palau', color: "#00d9ff"},
  {name: 'Palästinensische Gebiete', color: "#00d9ff"},
  {name: 'Panama', color: "#00d9ff"},
  {name: 'Papua-Neuguinea', color: "#00d9ff"},
  {name: 'Paraguay', color: "#00d9ff"},
  {name: 'Peru', color: "#00d9ff"},
  {name: 'Philippinen', color: "#00d9ff"},
  {name: 'Polen', color: "#00d9ff"},
  {name: 'Portugal', color: "#00d9ff"},
  {name: 'Ruanda', color: "#00d9ff"},
  {name: 'Rumänien', color: "#00d9ff"},
  {name: 'Russische Föderation', color: "#00d9ff"},
  {name: 'Salomonen', color: "#00d9ff"},
  {name: 'Sambia', color: "#00d9ff"},
  {name: 'Samoa', color: "#00d9ff"},
  {name: 'San Marino', color: "#00d9ff"},
  {name: 'Sao Tome und Principe', color: "#00d9ff"},
  {name: 'Saudi-Arabien', color: "#00d9ff"},
  {name: 'Schweden', color: "#00d9ff"},
  {name: 'Schweiz', color: "#00d9ff"},
  {name: 'Senegal', color: "#00d9ff"},
  {name: 'Serbien', color: "#00d9ff"},
  {name: 'Serbien (einschl. Kosovo) (03.06.2006-16.02.2008)', color: "#00d9ff"},
  {name: 'Serbien und Montenegro (05.02.2003-02.06.2006)', color: "#00d9ff"},
  {name: 'Seychellen', color: "#00d9ff"},
  {name: 'Sierra Leone', color: "#00d9ff"},
  {name: 'Simbabwe', color: "#00d9ff"},
  {name: 'Singapur', color: "#00d9ff"},
  {name: 'Slowakei', color: "#00d9ff"},
  {name: 'Slowenien', color: "#00d9ff"},
  {name: 'Somalia', color: "#ff00ff"},
  {name: 'Sowjetunion (bis 25.12.1991)', color: "#00d9ff"},
  {name: 'Spanien', color: "#00d9ff"},
  {name: 'Sri Lanka', color: "#00d9ff"},
  {name: 'St. Kitts und Nevis', color: "#00d9ff"},
  {name: 'St. Lucia', color: "#00d9ff"},
  {name: 'St. Vincent und die Grenadinen', color: "#00d9ff"},
  {name: 'Staatenlos', color: "#00d9ff"},
  {name: 'Sudan (einschließlich Südsudan) (bis 08.07.2011)', color: "#00d9ff"},
  {name: 'Sudan (ohne Südsudan) (ab 09.07.2011)', color: "#00d9ff"},
  {name: 'Suriname', color: "#00d9ff"},
  {name: 'Syrien', color: "#00ff00"},
  {name: 'Südafrika', color: "#00d9ff"},
  {name: 'Südsudan (ab 09.07.2011)', color: "#00d9ff"},
  {name: 'Tadschikistan', color: "#00d9ff"},
  {name: 'Taiwan', color: "#00d9ff"},
  {name: 'Tansania', color: "#00d9ff"},
  {name: 'Thailand', color: "#00d9ff"},
  {name: 'Timor-Leste', color: "#00d9ff"},
  {name: 'Togo', color: "#00d9ff"},
  {name: 'Tonga', color: "#00d9ff"},
  {name: 'Trinidad und Tobago', color: "#00d9ff"},
  {name: 'Tschad', color: "#00d9ff"},
  {name: 'Tschechien', color: "#00d9ff"},
  {name: 'Tschechoslowakei (bis 31.12.1992)', color: "#00d9ff"},
  {name: 'Tunesien', color: "#00d9ff"},
  {name: 'Turkmenistan', color: "#00d9ff"},
  {name: 'Tuvalu', color: "#00d9ff"},
  {name: 'Türkei', color: "#00d9ff"},
  {name: 'Uganda', color: "#00d9ff"},
  {name: 'Ukraine', color: "#00d9ff"},
  {name: 'Ungarn', color: "#00d9ff"},
  {name: 'Ungeklärt / Ohne Angabe', color: "#00d9ff"},
  {name: 'Uruguay', color: "#00d9ff"},
  {name: 'Usbekistan', color: "#00d9ff"},
  {name: 'Vanuatu', color: "#00d9ff"},
  {name: 'Vatikanstadt', color: "#00d9ff"},
  {name: 'Venezuela, Bolivarische Republik', color: "#00d9ff"},
  {name: 'Vereinigte Arabische Emirate', color: "#00d9ff"},
  {name: 'Vereinigte Staaten', color: "#00d9ff"},
  {name: 'Vereinigtes Königreich', color: "#00d9ff"},
  {name: 'Vietnam', color: "#00d9ff"},
  {name: 'Zentralafrikanische Republik', color: "#00d9ff"},
  {name: 'Zypern', color: "#00d9ff"}
]

const maxPositiveYValueRef = ref(0)
const xLabelsRef = ref([] as string[])
const sexGroupColorsRef = ref()
const countryColorsRef = ref()

const minYear = 1998;
const fromYearRef = ref((2010))
const toYearRef = ref(2021)
const yearsRef = ref(Array.from(Array(2021 - minYear + 1), (_, i) => minYear + i))

const {loadAliensByCountry, loadAliensBySex, aliensResult} = useAliensApi()

const retrieveAliensBySexChartData = (data: AliensBySex[]): ChartData[] => {
  return data.map((aliens => {
    return {
      x: aliens.year,
      y: aliens.count,
      z: aliens.sex
    } as ChartData
  }))
}

const retrieveCountryColors = (data: AliensByCountry[]) => {
  const country = [...new Set(data.map((aliens: AliensByCountry)  => aliens.country)).values()];
  return countries
      .filter((item: any) => country.find((countryGroup: String) => countryGroup === item.name))
      .map((item: any) => item.color)
}

const retrieveSexColors = (data: AliensBySex[]) => {
  const sex = [...new Set(data.map((aliens: AliensBySex) => aliens.sex)).values()];
  return sexGroups
      .filter((item: any) => sex.find((sexGroup: String) => sexGroup === item.name))
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

const loadAliensByCountryData = () => {
  loadAliensByCountry(fromYearRef.value, toYearRef.value, countries.map(country => country.name))
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensBySexChartData(aliensResult.value)
        countryColorsRef.value = retrieveCountryColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

const loadAliensBySexData = () => {
  loadAliensBySex(fromYearRef.value, toYearRef.value, undefined, countries.map(country => country.name))
      .then(() => {
        aliensRef.value = aliensResult.value
        aliensChartDataRef.value = retrieveAliensBySexChartData(aliensResult.value)
        sexGroupColorsRef.value = retrieveSexColors(aliensResult.value)
        xLabelsRef.value = [...new Set(aliensChartDataRef.value.map((d: ChartData) => d.x) as string[]).values()]
        maxPositiveYValueRef.value = Math.max(...Array.from(retrieveGroupedData(aliensChartDataRef.value).values()) as number[])
      })
}

watchEffect(() => {
  if (fromYearRef.value || toYearRef.value) {
    loadAliensBySexData()
  }
})

loadAliensBySexData()
</script>

<template>
  <article id="aliens-stats-view">
    <div class="aliens">
      <Chart id="aliens-stats-chart" :xLabels="xLabelsRef" :maxPositiveYValue="maxPositiveYValueRef" :maxNegativeYValue="0">
        <template v-slot:graph="slotProps">
          <StackedAreaGraph
              :scale="slotProps.scale"
              :chartData="aliensChartDataRef"
              :colors="sexGroupColorsRef"
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
