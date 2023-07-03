import axios from 'axios'
import {ref} from 'vue'
import {RefugeesByAge, RefugeesByAgeGroup, RefugeesByCountry, RefugeesBySex} from '@/models/refugees.model'

export const useRefugeesApi = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8082'
  })

  const loading = ref(false)
  const result = ref()
  const error = ref()

  const loadRefugeesByAge = async (from: number, to: number, minAge?: number, maxAge?: number, countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (minAge) {
      params += '&minAge=' + minAge
    }

    if (maxAge) {
      params += '&maxAge=' + maxAge
    }

    if (countries) {
      countries.forEach(country => params += '&country=' + encodeURIComponent(country))
    }

    await api.get('/refugees-by-age' + params)
        .then((r) => {
          result.value = r.data as RefugeesByAge[]
        })
        .catch((e) => {
          error.value = 'Failed to load refugees: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadRefugeesByAgeGroup = async (from: number, to: number, ageGroups?: string[], countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (ageGroups) {
      ageGroups.forEach(ageGroup => params += '&age-group=' + ageGroup)
    }

    if (countries) {
      countries.forEach(country => params += '&country=' + encodeURIComponent(country))
    }

    await api.get('/refugees-by-age-group' + params)
        .then((r) => {
          result.value = r.data as RefugeesByAgeGroup[]
        })
        .catch((e) => {
          error.value = 'Failed to load aliens: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadRefugeesByCountry = async (from: number, to: number, sumCountries?: boolean, countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (sumCountries) {
      params += '&sum-countries=true'
    }

    if (countries) {
      countries.forEach(country => params += '&country=' + encodeURIComponent(country))
    }

    await api.get('/refugees-by-country' + params)
        .then((r) => {
          result.value = r.data as RefugeesByCountry[]
        })
        .catch((e) => {
          error.value = 'Failed to load refugees: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadRefugeesBySex = async (from: number, to: number, sex?: string, countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (sex) {
      params += '&sex=' + sex
    }

    if (countries) {
      countries.forEach(country => params += '&country=' + encodeURIComponent(country))
    }

    await api.get('/refugees-by-sex' + params)
        .then((r) => {
          result.value = r.data as RefugeesBySex[]
        })
        .catch((e) => {
          error.value = 'Failed to load refugees: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  return {
    loadRefugeesByAge,
    loadRefugeesByAgeGroup,
    loadRefugeesByCountry,
    loadRefugeesBySex,
    refugeesLoading: loading,
    refugeesResult: result,
    refugeesError: error
  }
}
