
# 🧬 atomhooks

atomhooks is a lightweight, composable collection of custom React hooks for advanced state and ref management.

Built with TypeScript. Fully typed. Compatible with React 17+.

---

## 📚 Table of Contents

- [Install](#-install)
- [Hooks](#-hooks)
  - [useStateRef](#usestateref)
  - [useLocalStorage](#uselocalstorage)
  - [useDraftLocalStorage](#usedraftlocalstorage)
  - [useIsOnline](#useisonline)
- [License](#-license)

---

## 📦 Install

```sh
npm install atomhooks
```

---

## 🪝 Hooks

### useStateRef

**A React state hook with a synchronous ref getter.**

#### Quick Usage

```js
import { useStateRef } from 'atomhooks';
const [state, setState, getCurrent] = useStateRef(0);
```


#### Example

```jsx
import React from 'react';
import { useStateRef } from 'atomhooks';

function Counter() {
  const [count, setCount, getCount] = useStateRef(0);

  const handleAlert = () => {
    setTimeout(() => {
      alert('Current count: ' + getCount());
    }, 1000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={handleAlert}>Show Count in 1s</button>
    </div>
  );
}
```

---

#### TypeScript/TSX Example

```tsx
import React from 'react';
import { useStateRef } from 'atomhooks';

function CounterTSX() {
  const [count, setCount, getCount] = useStateRef<number>(0);

  const handleAlert = () => {
    setTimeout(() => {
      alert('Current count: ' + getCount());
    }, 1000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={handleAlert}>Show Count in 1s</button>
    </div>
  );
}
```

#### API

`useStateRef(initialValue)`

- `state`: Current state value (used for rendering)
- `setState`: Function to update the state (like useState)
- `getCurrent()`: Synchronously get the latest state, even in async callbacks

**Why use `getCurrent()`?**

React’s state can become stale inside `setTimeout`, event handlers, or `useEffect` closures. `getCurrent()` ensures you always access the latest value.

---

### useLocalStorage

**A React hook for persistent state in localStorage, with cross-component sync.**

#### Quick Usage

```js
import { useLocalStorage } from 'atomhooks';
const [value, setValue, remove] = useLocalStorage('key', 'default');
```


#### Example

```jsx
import React from 'react';
import { useLocalStorage } from 'atomhooks';

function NameInput() {
  const [name, setName, remove] = useLocalStorage('name', '');
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={remove}>Remove</button>
    </>
  );
}
```

---

#### TypeScript/TSX Example

```tsx
import React from 'react';
import { useLocalStorage } from 'atomhooks';

function NameInputTSX() {
  const [name, setName, remove] = useLocalStorage<string>('name', '');
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={remove}>Remove</button>
    </>
  );
}
```


#### API

`useLocalStorage(key, defaultValue)`

- `value`: Current value from localStorage (or default)
- `setValue`: Update and persist value to localStorage
- `remove()`: Remove the value from localStorage

---

### useDraftLocalStorage

**A React hook for localStorage with draft editing — changes are only saved when you call `save()`.**

#### Quick Usage


```js
import { useDraftLocalStorage } from 'atomhooks';

const {
  draftValue,
  setDraftValue,
  save,
  reset,
  removeValue,
  hasChanges,
  storedValue
} = useDraftLocalStorage('key', 'default');
```

#### Example

```jsx
import React from 'react';
import { useDraftLocalStorage } from 'atomhooks';

function DraftNote() {
  const {
    draftValue,
    setDraftValue,
    save,
    reset,
    removeValue,
    hasChanges,
    storedValue
  } = useDraftLocalStorage('note', '');

  return (
    <div>
      <p>Saved value: {storedValue}</p>
      <textarea
        value={draftValue}
        onChange={e => setDraftValue(e.target.value)}
      />
      <button onClick={save} disabled={!hasChanges}>Save</button>
      <button onClick={reset} disabled={!hasChanges}>Reset</button>
      <button onClick={removeValue}>Remove</button>
    </div>
  );
}
```
Another example showing custom imports:
```jsx
import { useDraftLocalStorage } from 'atomhooks';

function SettingsForm() {
  const {
    draftValue: formData,
    setDraftValue: updateForm,
    save: commitChanges,
    hasChanges: changed,
  } = useDraftLocalStorage('settings', { darkMode: false });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={formData.darkMode}
          onChange={e =>
            updateForm({ ...formData, darkMode: e.target.checked })
          }
        />
        Dark Mode
      </label>

      <button onClick={commitChanges} disabled={!changed}>
        Save Settings
      </button>
    </div>
  );
}
```

---

#### TypeScript/TSX Example

```tsx
import React from 'react';
import { useDraftLocalStorage } from 'atomhooks';

type Settings = {
  darkMode: boolean;
  username: string;
};

function SettingsFormTSX() {
  const {
    draftValue: formData,
    setDraftValue: updateForm,
    save: commitChanges,
    hasChanges: changed,
    storedValue,
  } = useDraftLocalStorage<Settings>('settings', { darkMode: false, username: '' });

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={formData.darkMode}
          onChange={e => updateForm({ ...formData, darkMode: e.target.checked })}
        />
        Dark Mode
      </label>
      <br />
      <label>
        Username:
        <input
          type="text"
          value={formData.username}
          onChange={e => updateForm({ ...formData, username: e.target.value })}
        />
      </label>
      <br />
      <button type="button" onClick={commitChanges} disabled={!changed}>
        Save Settings
      </button>
      <div>Saved: {storedValue.username} ({storedValue.darkMode ? 'Dark' : 'Light'})</div>
    </form>
  );
}
```


#### API

`useDraftLocalStorage(key, defaultValue)`

- `draft`: Current draft value
- `setDraft`: Update draft value
- `save()`: Save draft to localStorage
- `reset()`: Reset draft to last saved value
- `remove()`: Remove the value from localStorage
- `hasChanges`: Boolean, true if draft differs from saved value

---

#### More Details & Tips


**About & Tips**

- `useDraftLocalStorage` is built on top of `useLocalStorage`.
- Use it when you want users to edit a value (like a form or note) and only save changes when they explicitly click save.
- Unlike `useLocalStorage`, which saves every change instantly, `useDraftLocalStorage` keeps edits in memory until you call `save()`.
- Works well for settings forms, wizards, or any scenario where you want to prevent accidental saves.
- Handles objects/arrays (uses JSON under the hood). Avoid non-serializable values (like functions, Dates, Maps).
- Use the `hasChanges` flag to warn users about unsaved changes before navigating away.

**Example: Prompt on Unsaved Changes**

```jsx
import { useDraftLocalStorage } from 'atomhooks';
import { useEffect } from 'react';

function MyForm() {
  const { hasChanges } = useDraftLocalStorage('myform', {});
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);
  // ...existing code...
}
```

### useIsOnline

**A React hook to detect if the browser is online or offline.**

#### Quick Usage

```js
import { useIsOnline } from 'atomhooks';
const isOnline = useIsOnline();
```


#### Example

```jsx
import React from 'react';
import { useIsOnline } from 'atomhooks';

function OnlineStatus() {
  const isOnline = useIsOnline();
  return <span>{isOnline ? 'Online' : 'Offline'}</span>;
}
```

---

#### TypeScript/TSX Example

```tsx
import React from 'react';
import { useIsOnline } from 'atomhooks';

function OnlineStatusTSX() {
  const isOnline: boolean = useIsOnline();
  return <span>{isOnline ? 'Online' : 'Offline'}</span>;
}
```

#### API

`useIsOnline()`

- Returns `true` if the browser is online, `false` if offline

---

## 📄 License

MIT © [Muhammad Ahmad](https://github.com/mahmadabid)
