export function convertTo12HourFormat(time) {
  if (!time) return "N/A"; // Handle case where time is null or undefined

  const [hours, minutes] = time.split(":");

  // Create a new Date object and set the time based on the provided time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0); // Set seconds to 0 for consistency

  // Format the time to 12-hour format with AM/PM
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function convertReceiptTime(time) {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Get the weekday, month, day, year, hours, and minutes using Date methods
    const options = {
      weekday: "short", // Abbreviated weekday (e.g. "Wed")
      month: "long", // Full month name (e.g. "December")
      day: "2-digit", // Two-digit day (e.g. "27")
      year: "numeric", // Full year (e.g. "2025")
      hour: "2-digit", // Two-digit hour (e.g. "03")
      minute: "2-digit", // Two-digit minute (e.g. "46")
      hour12: true, // 12-hour format (AM/PM)
    };

    // Get the weekday name (e.g. "Sat")
    const weekday = date.toLocaleString("en-US", { weekday: "short" });

    // Get the month name (e.g. "December")
    const month = date.toLocaleString("en-US", { month: "long" });

    // Get the day (e.g. "27")
    const day = date.toLocaleString("en-US", { day: "2-digit" });

    // Get the full year (e.g. "2025")
    const year = date.toLocaleString("en-US", { year: "numeric" });

    // Get the time in 12-hour format (e.g. "03:46 PM")
    const timeFormatted = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${weekday} • ${month} ${day}, ${year} • ${timeFormatted}`;
  }

  const formattedDate = formatDate(time);
  return formattedDate;
}
