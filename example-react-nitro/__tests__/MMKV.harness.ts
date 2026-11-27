import { expect, test } from 'react-nitro-harness'
import { MMKV } from 'react-nitro-mmkv'

test('two instances share the same native storage', () => {
  const id = 'react-nitro-harness'
  const writer = new MMKV({ id })
  writer.setString('message', 'hello')
  const reader = new MMKV({ id })
  const message = reader.getString('message')
  expect(message).toBe('hello')
  reader.remove('message')
  const removed = writer.contains('message')
  expect(removed).toBe(false)
})
