import axios from 'axios'
import {ref} from 'vue'
import {Crime, CrimeByKey, CrimeBySex} from '@/models/crime.model'

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

    if (keys) {
      keys.forEach(key => params += '&key=' + key)
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

  const loadCrimesByKey = async (from: number, to: number, cleanCases?: boolean, sumCases?: boolean, keys?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (cleanCases) {
      params += '&clean-cases=true'
    }

    if (sumCases) {
      params += '&sum-cases=true'
    }

    if (keys) {
      keys.forEach(key => params += '&key=' + key)
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

  const loadCrimesBySuspects = async (from: number, to: number, showForeignSuspects?: boolean, sumSuspects?: boolean, keys?: string[]) => {
    loading.value = true
    error.value = undefined

    let params = '?from=' + ((from && from > 1998) ? from : 1998)

    if (to && to >= 1998) {
      params += '&to=' + to
    }

    if (showForeignSuspects) {
      params += '&show-foreign-suspects=true'
    }

    if (sumSuspects) {
      params += '&sum-suspects=true'
    }

    if (keys) {
      keys.forEach(key => params += '&key=' + key)
    }

    await api.get('/crime-by-suspects' + params)
        .then((r) => {
          result.value = r.data as CrimeByKey[]
        })
        .catch((e) => {
          error.value = 'Failed to load crimes by suspects: ' + e.message
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

    if (keys) {
      keys.forEach(key => params += '&key=' + key)
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
    loadCrimesBySuspects,
    loadCrimesBySex,
    crimesLoading: loading,
    crimesResult: result,
    crimesError: error
  }
}
