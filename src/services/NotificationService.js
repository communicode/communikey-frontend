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
