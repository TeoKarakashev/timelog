import axios from 'axios'

const STORAGE_SERVICE_URL = 'http://localhost:4000/rpc'

export async function sendToStorageService(logs: any[]) {
  await axios.post(STORAGE_SERVICE_URL, {
    jsonrpc: '2.0',
    method: 'storeLogs',
    params: { logs },
    id: Date.now()
  })
}
