import axios from "axios";
import {notificationService} from "../Communikey";
import {API_AUTHORIZE} from "../services/apiRequestMappings";

const apiService = axios.create({timeout: 5000});

apiService.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  switch (error.response.status) {
  case 400: {
    error.response.data.errors.map((errorMessage) => {
      notificationService.error("Error: ", errorMessage, 5);
    });
    break;
  }
  case 401: {
    error.response.config.url === API_AUTHORIZE &&
      notificationService.error("Error: ", "Login failed. Please try again.", 5);
    break;
  }
  case 504: {
    notificationService.error("Error: ", "No connection the the server possible. If the error persists contact key@communicode.de", 5);
    break;
  }
  default: {
    notificationService.error("Error: " + error.response.status, error.response.data.error, 3);
    break;
  }}
  return Promise.reject(error);
});

export default apiService;