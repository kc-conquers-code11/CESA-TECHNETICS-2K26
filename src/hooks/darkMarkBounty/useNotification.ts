import { useState, useCallback } from "react";
import type { Notification } from "../../types/darkMarkBounty";

export const useNotification = (duration = 3000) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (msg: string, type: "success" | "warn" = "success") => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), duration);
    },
    [duration],
  );

  return { notification, showNotification };
};
