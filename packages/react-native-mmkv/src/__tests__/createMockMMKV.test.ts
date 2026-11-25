import { createMockMMKV } from '../createMMKV/createMockMMKV'

test('clearAll notifies listeners for every cleared key', () => {
  const storage = createMockMMKV({ id: 'clear-all-test' })
  storage.set('a', 'one')
  storage.set('b', 2)
  const changed: string[] = []
  storage.addOnValueChangedListener((key) => changed.push(key))

  storage.clearAll()

  expect(changed).toEqual(['a', 'b'])
})
