import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  render,
  waitFor,
} from 'react-native-harness';
import {
  type MMKV,
  createMMKV,
  useMMKVBuffer,
  useMMKVString,
} from 'react-native-mmkv';

let renderCount = 0;

function StringProbe({ storage }: { storage: MMKV }): null {
  useMMKVString('key', storage);
  renderCount++;
  return null;
}

function BufferProbe({ storage }: { storage: MMKV }): null {
  useMMKVBuffer('key', storage);
  renderCount++;
  return null;
}

let renders: { requested: string; got: string | undefined }[] = [];

function KeyProbe({
  storage,
  storageKey,
}: {
  storage: MMKV;
  storageKey: string;
}): null {
  const [value] = useMMKVString(storageKey, storage);
  renders.push({ requested: storageKey, got: value });
  return null;
}

describe('MMKV Hooks', () => {
  let storage: MMKV;

  beforeEach(() => {
    storage = createMMKV({ id: 'hooks-test' });
    storage.clearAll();
    renderCount = 0;
  });

  afterEach(() => {
    storage.clearAll();
  });

  it('useMMKVString renders a bounded number of times for a stored value', async () => {
    storage.set('key', 'value');

    await render(<StringProbe storage={storage} />);

    await waitFor(() => expect(renderCount).toBeGreaterThan(0));
    expect(renderCount).toBeLessThan(5);
  });

  it('useMMKVBuffer renders a bounded number of times for a stored value', async () => {
    const buffer = new ArrayBuffer(3);
    new Uint8Array(buffer).set([1, 100, 255]);
    storage.set('key', buffer);

    await render(<BufferProbe storage={storage} />);

    await waitFor(() => expect(renderCount).toBeGreaterThan(0));
    expect(renderCount).toBeLessThan(5);
  });

  it('reads the new value when the key changes', async () => {
    storage.set('key-a', 'value a');
    storage.set('key-b', 'value b');
    renders = [];

    const { rerender } = await render(
      <KeyProbe storage={storage} storageKey="key-a" />,
    );
    renders = [];

    await rerender(<KeyProbe storage={storage} storageKey="key-b" />);

    expect(renders).toStrictEqual([{ requested: 'key-b', got: 'value b' }]);
  });

  it('reads the new value when the instance changes', async () => {
    const otherStorage = createMMKV({ id: 'hooks-test-other' });
    otherStorage.clearAll();
    storage.set('shared-key', 'from first');
    otherStorage.set('shared-key', 'from second');
    renders = [];

    const { rerender } = await render(
      <KeyProbe storage={storage} storageKey="shared-key" />,
    );
    renders = [];

    await rerender(<KeyProbe storage={otherStorage} storageKey="shared-key" />);

    expect(renders).toStrictEqual([
      { requested: 'shared-key', got: 'from second' },
    ]);
    otherStorage.clearAll();
  });
});
