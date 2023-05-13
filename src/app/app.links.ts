import {environment} from "./environments/environment.prod"

export const appLinks= {
  production: true,
  login: `${environment.serverUrl}/api/auth/login`,
  signup: `${environment.serverUrl}/api/auth/signup`,
}
