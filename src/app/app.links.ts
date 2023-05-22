import {environment} from "./environments/environment"
import {Cloudinary} from "@cloudinary/url-gen";

export const appLinks= {
  production: true,
  login: `${environment.serverUrl}/api/auth/login`,
  signup: `${environment.serverUrl}/api/auth/signup`,
  plans: `${environment.serverUrl}/api/users/plans`,
  getPlans: `${environment.serverUrl}/api/users/plans/search`,
  uploadImage:`https://api.cloudinary.com/v1_1/dir5cpatv/image/upload`,
}
export const cld = new Cloudinary({
  cloud: {
    cloudName: "dir5cpatv",
    apiKey: "899965346192757",
    apiSecret: "RCMQ2gzn5dzRkcLRMp7XCbOvXn0"
  }
});
