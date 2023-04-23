import { networkInterfaces } from 'os'

export const getIPAddress = () => {
  const nets = networkInterfaces();
  const results: Record<string, string[]> = {};

  for (const [name, values] of Object.entries(nets)) {
    if (values) {
      for (const net of values) {
        // Retrieve only IPv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
  }

  const nicNames = Object.keys(results);
  if (nicNames.length > 0) {
    const firstNICAddresses = results[nicNames[0]];
    if (firstNICAddresses.length > 0) {
      return firstNICAddresses[0];
    }
  }

  return '';
};
