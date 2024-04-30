import { impactDashRedisClient } from "./RedisClient";
import { monthlyActiveNodesByDay } from "./redisTypes";
import { getLastXDaysWithPrefix, generateXDaysFormatyyyyMMdd } from "./util";

// Define your types for clarity and reusability
type ClientType =
  | "geth"
  | "nethermind"
  | "besu"
  | "reth"
  | "erigon"
  | "prysm"
  | "lighthouse"
  | "lodestar"
  | "nimbus"
  | "teku";
type ExecutionClientType = "geth" | "nethermind" | "besu" | "reth" | "erigon";
type ConsensusClientType =
  | "prysm"
  | "lighthouse"
  | "lodestar"
  | "nimbus"
  | "teku";
type NetworkType = "mainnet" | "sepolia" | "holesky" ;

interface EthereumData {
  count: number;
  networks: Record<NetworkType, number>;
  clients: Record<ClientType, number>;
}

interface EthereumNodeDetail {
  count: number;
  type: string;
  clients: {
    execution: { name: string; count: number }[];
    consensus: { name: string; count: number }[];
  };
  networks: { name: NetworkType; count: number }[];
}

// Function to process the Ethereum node data
function processEthereumNode(ethereumData: EthereumData): EthereumNodeDetail {
  const executionClients: ExecutionClientType[] = [
    "geth",
    "nethermind",
    "besu",
    "reth",
    "erigon",
  ];
  const consensusClients: ConsensusClientType[] = [
    "prysm",
    "lighthouse",
    "lodestar",
    "nimbus",
    "teku",
  ];

  // Calculate total counts
  const totalExecutionCount = sumClientCounts(
    ethereumData.clients,
    executionClients,
  );
  const totalConsensusCount = sumClientCounts(
    ethereumData.clients,
    consensusClients,
  );

  // Generate sorted and percentage-formatted client records
  const execution = createSortedClientArray(
    ethereumData.clients,
    executionClients,
    totalExecutionCount,
  );
  const consensus = createSortedClientArray(
    ethereumData.clients,
    consensusClients,
    totalConsensusCount,
  );

  // Sort and format networks
  const sortedNetworks = sortAndFormatNetworks(ethereumData.networks);

  return {
    count: ethereumData.count,
    type: "ethereum",
    clients: { execution, consensus },
    networks: sortedNetworks,
  };
}
// Function to sum counts for a subset of clients
function sumClientCounts(
  clients: Record<ClientType, number>,
  clientTypes: ClientType[],
): number {
  return clientTypes.reduce((sum, type) => sum + (clients[type] || 0), 0);
}

// Function to create a sorted array of clients with percentages
function createSortedClientArray(
  clients: Record<ClientType, number>,
  clientTypes: ClientType[],
  total: number,
) {
  return clientTypes
    .map((client) => ({
      name: client,
      count: Math.round(((clients[client] || 0) / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

// Function to sort networks by their count and keep them as array of objects
function sortAndFormatNetworks(
  networks: Record<NetworkType, number>,
): { name: NetworkType; count: number }[] {
  return Object.entries(networks)
    .map(([name, count]) => ({ name: name as NetworkType, count }))
    .sort((a, b) => b.count - a.count);
}

const daysOfData = 30;
export const getDashData = async () => {
  function sortByCountDescending(arr: any[]) {
    return arr.sort((a, b) => b.count - a.count);
  }
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

  console.log("mostRecentDay", mostRecentDay);
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
  let activeNodesByType: any[] = []; // Define the correct type based on your application's needs
  if (mostRecentDay?.data?.specId) {
    // manually process ethereum data
    // todo: generalize each /node/<node-type> endpoint to list all clients
    mostRecentDay.data.specId.ethereum = {
      count: mostRecentDay.data.specId.ethereum.count,
      networks: {
        mainnet: mostRecentDay.data.specId.ethereum.networks?.Mainnet ?? 0,
        sepolia: mostRecentDay.data.specId.ethereum.networks?.Seploia ?? 0,
        holesky: mostRecentDay.data.specId.ethereum.networks?.Holesky ?? 0,
      },
      clients: {
        geth: mostRecentDay.data.specId.ethereum.services?.geth?.count ?? 0,
        nethermind: mostRecentDay.data.specId.ethereum.services?.nethermind?.count ?? 0,
        besu: mostRecentDay.data.specId.ethereum.services?.besu?.count ?? 0,
        reth: mostRecentDay.data.specId.ethereum.services?.reth?.count ?? 0,
        erigon: mostRecentDay.data.specId.ethereum.services?.erigon?.count ?? 0,
        prysm: mostRecentDay.data.specId.ethereum.services?.['prysm-beacon']?.count ?? 0,
        lighthouse: mostRecentDay.data.specId.ethereum.services?.['lighthouse-beacon']?.count ?? 0,
        lodestar: mostRecentDay.data.specId.ethereum.services?.['lodestar-beacon']?.count ?? 0,
        nimbus: mostRecentDay.data.specId.ethereum.services?.['nimbus-beacon']?.count ?? 0,
        teku: mostRecentDay.data.specId.ethereum.services?.['teku-beacon']?.count ?? 0,
      },
    };

    Object.keys(mostRecentDay.data.specId).forEach((specId) => {
      if (specId === "ethereum") {
        activeNodesByType.push(
          processEthereumNode(mostRecentDay.data.specId[specId]),
        );
      } else {
        activeNodesByType.push({
          count: mostRecentDay.data.specId[specId].count,
          type: specId,
        });
      }
    });
  }

  activeNodesByCountry = sortByCountDescending(activeNodesByCountry);
  activeNodesByType = sortByCountDescending(activeNodesByType);
  return {
    numActiveNodes,
    activeNodesByCountry,
    activeNodesByType,
    monthlyActiveNodesIndexByDays,
  };
};
