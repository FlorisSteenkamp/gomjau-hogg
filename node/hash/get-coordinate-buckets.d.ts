/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
declare function getCoordinateBuckets(c: number): number[];
export { getCoordinateBuckets };
