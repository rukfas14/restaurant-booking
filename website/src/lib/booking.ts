// Thin wrapper around the global widget API (loaded via <script> in index.html).

declare global {
  interface Window {
    RestaurantBooking?: { open: () => void; close: () => void };
  }
}

export function openBookingWidget() {
  if (typeof window === "undefined") return;
  if (window.RestaurantBooking) {
    window.RestaurantBooking.open();
    return;
  }
  // Widget script not loaded yet — wait briefly then retry once.
  setTimeout(() => {
    if (window.RestaurantBooking) window.RestaurantBooking.open();
    else
      console.warn(
        "[booking] widget.js has not loaded — check the <script> tag in index.html"
      );
  }, 300);
}

export {};
