const signed64BitLimit = 2n ** 63n

export function checkBigIntRange(value: bigint): void {
  if (value < -signed64BitLimit || value >= signed64BitLimit) {
    throw new RangeError('MMKV: BigInt must fit in a signed 64-bit integer!')
  }
}
