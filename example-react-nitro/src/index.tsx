import { Application, renderRoot, Text, View, ViewController, Window } from 'react-nitro-renderer'
import { MMKV, useMMKVNumber } from 'react-nitro-mmkv'

const storage = new MMKV({ id: 'example' })
const launches = storage.getNumber('launches') ?? 0
storage.setNumber('launches', launches + 1)

function App() {
  const [count] = useMMKVNumber('launches', storage)
  return (
    <View layout={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`App launches: ${count}`}</Text>
    </View>
  )
}

Application.registerRoot((scene) => {
  const controller = new ViewController()
  const window = new Window(scene, controller)
  renderRoot(<App />, controller)
  return window
})
