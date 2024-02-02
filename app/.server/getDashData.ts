import { impactDashRedisClient } from "./RedisClient"
import { monthlyActiveNodesByDay } from "./redisTypes"
import { getLastXDaysWithPrefix, generateXDaysFormatyyyyMMdd } from "./util"


const TODAY_yyyy_MM_dd = "2024-01-30"
const daysOfData = 30
export const getDashData = async () => {
    const days = generateXDaysFormatyyyyMMdd(daysOfData)
    const daysWithPrefix = getLastXDaysWithPrefix(monthlyActiveNodesByDay, daysOfData)
    const daysJson: unknown[][] = await impactDashRedisClient.client.json.mget(daysWithPrefix, '$')
    const monthlyActiveNodesIndexByDays = days.map((day, index) => {
        let dayJson: any = {}
        if(Array.isArray(daysJson[index])) {
            dayJson = daysJson[index][0]
        }

        return {
            day,
            data: dayJson
        }
    })
    const mostRecentDay = monthlyActiveNodesIndexByDays[2]
    const numActiveNodes = mostRecentDay?.data?.count
    let activeNodesByCountry: {country: string, count: number}[] = []
    if(mostRecentDay?.data?.country) {
        activeNodesByCountry = Object.keys(mostRecentDay?.data?.country).map((countryCode) => {
            return {
                count: mostRecentDay.data.country[countryCode],
                country: countryCode
            }
        })
    }
    let activeNodesByType: {type: string, count: number}[] = []
    if(mostRecentDay?.data?.specId) {
        activeNodesByType = Object.keys(mostRecentDay?.data?.specId).map((specId) => {
            return {
                count: mostRecentDay.data.specId[specId],
                type: specId
            }
        })
    }
    return {
        numActiveNodes,
        activeNodesByCountry,
        activeNodesByType,
        monthlyActiveNodesIndexByDays
    }
}