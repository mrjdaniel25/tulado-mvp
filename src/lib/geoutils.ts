
import geohash from 'ngeohash'

export function encodeGeohash(lat: number, lng: number, precision = 8) {
  return geohash.encode(lat, lng, precision)
}
export function prefixForRadius(lat: number, lng: number) {
  return geohash.encode(lat, lng).slice(0, 5)
}
