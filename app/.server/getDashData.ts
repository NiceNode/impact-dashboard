import { impactDashRedisClient } from "./RedisClient";
import { monthlyActiveNodesByDay } from "./redisTypes";
import { getLastXDaysWithPrefix, generateXDaysFormatyyyyMMdd } from "./util";

const daysOfData = 30;
export const getDashData = async () => {
  const days = generateXDaysFormatyyyyMMdd(daysOfData);
  console.log("days: ", days);
  days.shift(); // start with yesterday
  const daysWithPrefix = getLastXDaysWithPrefix(
    monthlyActiveNodesByDay,
    daysOfData,
  );
  daysWithPrefix.shift(); // start with yesterday
  const daysJson: unknown[][] = await impactDashRedisClient.client.json.mget(
    daysWithPrefix,
    "$",
  );
  const monthlyActiveNodesIndexByDays = days.map((day, index) => {
    let dayJson: any = {};
    if (Array.isArray(daysJson[index])) {
      dayJson = daysJson[index][0];
    }

    return {
      day,
      data: dayJson,
    };
  });
  const mostRecentDay = monthlyActiveNodesIndexByDays[0];
  const numActiveNodes = mostRecentDay?.data?.count;

  console.log("mostRecenDay", mostRecentDay);
  let activeNodesByCountry: { country: string; count: number }[] = [];
  if (mostRecentDay?.data?.country) {
    activeNodesByCountry = Object.keys(mostRecentDay?.data?.country).map(
      (countryCode) => {
        return {
          count: mostRecentDay.data.country[countryCode],
          country: countryCode,
        };
      },
    );
  }
  let activeNodesByType: { type: string; count: number }[] = [];
  if (mostRecentDay?.data?.specId) {
    activeNodesByType = Object.keys(mostRecentDay?.data?.specId).map(
      (specId) => {
        return {
          count: mostRecentDay.data.specId[specId],
          type: specId,
        };
      },
    );
  }
  // Puts highest counts at the beginning of the arrays
  activeNodesByCountry = activeNodesByCountry.sort((a, b) => {
    return a.count < b.count ? 1 : a.count > b.count ? -1 : 0;
  });
  activeNodesByType = activeNodesByType.sort((a, b) => {
    return a.count < b.count ? 1 : a.count > b.count ? -1 : 0;
  });
  return {
    numActiveNodes,
    activeNodesByCountry,
    activeNodesByType,
    monthlyActiveNodesIndexByDays,
  };
};
