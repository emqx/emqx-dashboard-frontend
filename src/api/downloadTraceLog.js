import http from '../common/api'
import { downloadBlobData } from '../common/utils'

export default async function downloadTrace(name) {
  try {
    const { data } = await http.get(`/trace/${encodeURIComponent(name)}/download`, {
      responseType: 'blob',
    })
    downloadBlobData(data)
    return Promise.resolve()
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}
