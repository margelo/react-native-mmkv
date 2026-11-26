import { AppState } from 'react-native'
import { addMMKVAppStateListeners } from '../addMMKVAppStateListeners'

afterEach(() => {
  jest.restoreAllMocks()
})

test('app state listeners route memory warnings and foreground events to MMKV', () => {
  const addEventListener = jest
    .spyOn(AppState, 'addEventListener')
    .mockReturnValue({ remove: jest.fn() })
  const storage = { trimAll: jest.fn(), checkAllContentChanged: jest.fn() }

  addMMKVAppStateListeners(storage)

  expect(addEventListener.mock.calls.map(([event]) => event)).toEqual([
    'memoryWarning',
    'change',
  ])
  const [, onMemoryWarning] = addEventListener.mock.calls[0]!
  const [, onAppStateChange] = addEventListener.mock.calls[1]!
  onAppStateChange('background')
  expect(storage.checkAllContentChanged).not.toHaveBeenCalled()
  onAppStateChange('active')
  expect(storage.checkAllContentChanged).toHaveBeenCalledTimes(1)

  onMemoryWarning('active')
  expect(storage.trimAll).toHaveBeenCalledTimes(1)
})
