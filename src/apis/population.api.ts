import axios from 'axios'
import {ref} from 'vue'
import {PopulationByAgeAndSex} from '@/models/population.model'
import {PopulationByPercentage} from "@/models/aliens.model";

export const usePopulationApi = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8082'
  })

  const loading = ref(false)
  const result = ref()
  const error = ref()

  const loadPopulationByAge = async (from: number = 1998, to: number = 1998, minAge?: number, maxAge?: number, sex?: string, lessAliens?: boolean) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + from + '&to=' + to

    if (minAge) {
      params += '&minAge=' + minAge
    }

    if (maxAge) {
      params += '&maxAge=' + maxAge
    }

    if (sex) {
      params += '&sex=' + sex
    }

    if (lessAliens) {
      params += '&less-aliens=true'
    }

    await api.get('/population' + params)
        .then((r) => {
          result.value = r.data as PopulationByAgeAndSex[]
        })
        .catch((e) => {
          error.value = 'Failed to load populations: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadPopulationByPercentage = async (from: number, to: number) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    await api.get('/population-by-percentage' + params)
        .then((r) => {
          result.value = r.data as PopulationByPercentage[]
        })
        .catch((e) => {
          error.value = 'Failed to load aliens: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  return {
    loadPopulationByAge,
    loadPopulationByPercentage,
    populationLoading: loading,
    populationResult: result,
    populationError: error
  }
}
