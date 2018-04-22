/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import axios from "axios";
import {notificationService} from "../Communikey";
import {API_AUTHORIZE} from "../services/apiRequestMappings";

const apiService = axios.create({timeout: 5000});
apiService.all = axios.all;

apiService.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  switch (error.response.status) {
  case 400: {
    error.response.data.errors.map((errorMessage) => {
      notificationService.error("Error: ", errorMessage, 10);
    });
    break;
  }
  case 401: {
    error.response.config.url === API_AUTHORIZE &&
      notificationService.error("Error: ", "Login failed. Please try again.", 5);
    break;
  }
  case 504: {
    notificationService.error("Error: ", "No connection the the server possible. If the error persists contact key@communicode.de", 10);
    break;
  }
  default: {
    notificationService.error("Error: " + error.response.status, error.response.data.error, 10);
    break;
  }}
  return Promise.reject(error);
});

export default apiService;