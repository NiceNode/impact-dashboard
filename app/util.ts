export const convertUTCTimestampToMonthDay = (utcTimestamp: number): string => {
  // Create a new Date object with the UTC timestamp
  const date = new Date(utcTimestamp);

  // Array of three-letter month abbreviations
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month and day
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();

  // Return the formatted string
  return `${month} ${day}`;
};

// Example usage
// const utcTimestamp: number = Date.now(); // Replace with any UTC timestamp
// const formattedDate: string = convertUTCTimestampToMonthDay(utcTimestamp);
// console.log(formattedDate);
