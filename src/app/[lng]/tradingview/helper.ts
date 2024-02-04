export interface IFullSymbol {
  exchange: string,
  fromSymbol: string, 
  toSymbol: string
}
// Makes requests to CryptoCompare API

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol: string): IFullSymbol |null {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }
  return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
export function parseFullSymbolStock(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):(\w+)$/);
  if (!match) {
    return null;
  }
  return { exchange: match[1], symbol: match[2] };
}
