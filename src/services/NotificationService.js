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
import {notification} from "antd";
import "antd/lib/notification/style/index.css";

/**
 * Provides functions to display notifications for the user.
 *
 * @author dvonderbey@communicode.de
 * @since 0.13.0
 */
class NotificationService {
  constructor() {
    notification.config({
      placement: "topRight",
      bottom: 50,
      duration: 0
    });
  }

  error = (message, description, duration) => {
    const key = `open${Date.now()}`;
    notification.error({
      message: message,
      description: description,
      duration: duration,
      key
    });
  };

  warn = (message, description, duration) => {
    const key = `open${Date.now()}`;
    notification.warn({
      message: message,
      description: description,
      duration: duration,
      key
    });
  };

  info = (message, description, duration) => {
    const key = `open${Date.now()}`;
    notification.info({
      placement: "bottomRight",
      message: message,
      description: description,
      duration: duration,
      key
    });
  };

  success = (message, description, duration) => {
    const key = `open${Date.now()}`;
    notification.success({
      placement: "topRight",
      message: message,
      description: description,
      duration: duration,
      key
    });
  };

  minorSuccess = (message, description, duration) => {
    const key = `open${Date.now()}`;
    notification.success({
      placement: "bottomRight",
      message: message,
      description: description,
      duration: duration,
      key
    });
  };
}

export default NotificationService;
