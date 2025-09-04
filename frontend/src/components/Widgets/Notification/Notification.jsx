/**
 * Added by - Tejasve gupta on 24-05-2024
 * Reason - Added configuration for notification
 */
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notificationObject = new Notyf({
  duration: 2000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: "success",
      background: "#4AB516",
    },
  ],
});

export default notificationObject;
