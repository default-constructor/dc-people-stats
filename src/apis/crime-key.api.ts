import axios from 'axios'
import {ref} from 'vue'
import {CrimeKey} from '@/models/crime-key.model';

export const useCrimeKeyApi = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8082'
  })

  const loading = ref(false)
  const result = ref()
  const error = ref()

  const loadCrimeKeys = async () => {
    loading.value = true
    error.value = undefined

    await api.get('/crime-key')
        .then((r) => {
          result.value = r.data as CrimeKey[]
        })
        .catch((e) => {
          error.value = 'Failed to load crime keys: ' + e.message
        })
        .finally(() => {
          loading.value = false
        })
  }

  return {
    loadCrimeKeys,
    crimeKeysLoading: loading,
    crimeKeysResult: result,
    crimeKeysError: error
  }
}
