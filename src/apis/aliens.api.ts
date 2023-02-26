import axios from 'axios';
import {ref} from 'vue';
import {AliensByCountry, AliensBySex} from '@/models/aliens.model';

export const useAliensApi = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8082'
  })

  const loading = ref(false)
  const result = ref()
  const error = ref()

  const loadAliensByAge = async (from: number, to: number, minAge?: number, maxAge?: number, countries?: string[]) => {
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

    await api.get('/aliens-by-age' + params)
        .then((r) => {
          result.value = r.data as AliensByCountry[]
        })
        .catch((e) => {
          error.value = 'Failed to load aliens: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadAliensByCountry = async (from: number, to: number, countries?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (countries && countries.length > 0) {
      params += '&countries=' + countries.map(country => encodeURIComponent(country)).join(',')
    }

    await api.get('/aliens-by-country' + params)
        .then((r) => {
          result.value = r.data as AliensByCountry[]
        })
        .catch((e) => {
          error.value = 'Failed to load aliens: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadAliensBySex = async (from: number, to: number, sex?: string, countries?: string[]) => {
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

    await api.get('/aliens-by-sex' + params)
        .then((r) => {
          result.value = r.data as AliensBySex[]
        })
        .catch((e) => {
          error.value = 'Failed to load aliens: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  return {
    loadAliensByAge,
    loadAliensByCountry,
    loadAliensBySex,
    aliensLoading: loading,
    aliensResult: result,
    aliensError: error
  }
}
