import { ApiRoutes } from '../constants'

type APIPayload<P> = {
  types: [string, string, string],
  endpoint: string,
  method: 'POST' | 'PUT' | 'GET' | 'DELETE',
  payload: P,
}


type ResponseType = {
  ok: boolean,
}