
/**
 * Determines the base URL for API calls based on the current environment.
 * 
 * When running in a browser or Tauri desktop, 'localhost' is usually fine.
 * When running on Android (via Tauri mobile dev), the app runs on the device/emulator,
 * so 'localhost' refers to the device itself. We need to connect to the host machine's IP.
 * 
 * In Tauri v2 dev mode, the frontend is served from the internal network IP (e.g., 192.168.x.x).
 * We can use `window.location.hostname` to dynamically target that same IP.
 */
export const getApiBaseUrl = (port: number): string => {
  const hostname = window.location.hostname;

  // If hostname is empty (some file protocol edge cases), default to localhost
  if (!hostname) {
    return `http://localhost:${port}`;
  }

  // If we are strictly on localhost, keep it as is.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }

  // On Android/Mobile (Tauri), hostname might be 'tauri.localhost'.
  // We need to use the dev server IP injected by Vite to reach the backend on the host.
  if (hostname === 'tauri.localhost') {
    const devHost = import.meta.env.VITE_DEV_HOST;
    if (devHost) {
      return `http://${devHost}:${port}`;
    }
    // Fallback for emulator if no host detected (though tauri dev usually detects it)
    return `http://10.0.2.2}:${port}`;
  }

  // Otherwise, we are likely on a LAN IP (Android dev) or a specific host.
  // We assume the backend is running on the same host as the frontend server.
  return `http://${hostname}:${port}`;
};
