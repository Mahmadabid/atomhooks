import { useEffect, useState } from "react";

/**
 * useOnline is a custom React hook that returns the current online/offline status of the browser.
 * It does not require any context or provider and works out-of-the-box in any component.
 *
 * @returns {boolean} `true` if the browser is online, `false` if offline
 */
export function useIsOnline(): boolean {
  // Initialize the state with the current online status of the browser
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    // Event handlers for online and offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Register the event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup function: remove event listeners when component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Return the current online status
  return isOnline;
}
