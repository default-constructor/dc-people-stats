import axios from 'axios'
import {ref} from 'vue'
import {Crime, CrimeByKey, CrimeBySex} from '@/models/crime.model';

export const useCrimeApi = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8082'
  })

  const loading = ref(false)
  const result = ref()
  const error = ref()

  const loadCrimes = async (from: number, to: number, keys?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (keys && keys.length > 0) {
      params += '&keys=' + keys.join(',')
    }

    await api.get('/crime' + params)
        .then((r) => {
          result.value = r.data as Crime[]
        })
        .catch((e) => {
          error.value = 'Failed to load crimes: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadCrimesByKey = async (from: number, to: number, keys?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (keys && keys.length > 0) {
      params += '&keys=' + keys.join(',')
    }

    await api.get('/crime-by-key' + params)
        .then((r) => {
          result.value = r.data as CrimeByKey[]
        })
        .catch((e) => {
          error.value = 'Failed to load crimes: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  const loadCrimesBySex = async (from: number, to: number, sex?: string, keys?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (sex) {
      params += '&sex=' + sex
    }

    if (keys && keys.length > 0) {
      params += '&keys=' + keys.join(',')
    }

    await api.get('/crime-by-sex' + params)
        .then((r) => {
          result.value = r.data as CrimeBySex[]
        })
        .catch((e) => {
          error.value = 'Failed to load crimes: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  return {
    loadCrimes,
    loadCrimesByKey,
    loadCrimesBySex,
    crimesLoading: loading,
    crimesResult: result,
    crimesError: error
  }
}
