import axios from 'axios'
import {ref} from 'vue'
import {RefugeesByAge, RefugeesByCountry, RefugeesBySex} from '@/models/refugees.model'

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

    if (countries && countries.length > 0) {
      params += '&countries=' + countries.map(country => encodeURIComponent(country)).join(',')
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

  const loadRefugeesByCountry = async (from: number, to: number, countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (countries && countries.length > 0) {
      params += '&countries=' + countries.map(country => encodeURIComponent(country)).join(',')
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

    if (countries && countries.length > 0) {
      params += '&countries=' + countries.map(country => encodeURIComponent(country)).join(',')
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
    loadRefugeesByCountry,
    loadRefugeesBySex,
    refugeesLoading: loading,
    refugeesResult: result,
    refugeesError: error
  }
}
