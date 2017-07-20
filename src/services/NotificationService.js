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

  error = (message, description) => {
    const key = `open${Date.now()}`;
    notification.error({
      message: message,
      description: description,
      key
    });
  };

  warn = (message, description) => {
    const key = `open${Date.now()}`;
    notification.warn({
      message: message,
      description: description,
      key
    });
  };

  info = (message, description) => {
    const key = `open${Date.now()}`;
    notification.info({
      placement: "bottomRight",
      message: message,
      description: description,
      key
    });
  };
}

export default NotificationService;
