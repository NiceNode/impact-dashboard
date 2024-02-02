import util from 'util'

/**
 * Useful to get a range of time series keys from a db
 * @param x number of days before today
 * @returns array of strings in <prefix> + 'yyyy-MM-dd' format
 */
export const getLastXDaysWithPrefix = (prefix: string, x: number) => {
    return generateXDaysFormatyyyyMMdd(x).map(dayStr => prefix + dayStr)
}
  
/**
 * Thanks chatGPT
 * @param x number of days before today
 * @returns array of strings in 'yyyy-MM-dd' format
 */
  export const generateXDaysFormatyyyyMMdd = (x: number) => {
    let dates: string[] = []; // Array to hold the formatted dates
    let currentDate = new Date(); // Starting point is today
  
    for (let i = 0; i < x; i++) {
        // Format the date as 'yyyy-MM-dd'
        let formattedDate = currentDate.toISOString().split('T')[0];
  
        // Push the formatted date into the array
        dates.push(formattedDate);
  
        // Subtract one day
        currentDate.setDate(currentDate.getDate() - 1);
    }
  
    return dates;
  }
  

export const logDeepObj = (myObject: unknown): void => {
  console.log(util.inspect(myObject, { showHidden: false, depth: null, colors: true }))
}
