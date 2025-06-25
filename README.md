# 🧬 atomhooks

atomhooks is a lightweight, composable collection of custom React hooks for advanced state and ref management — starting with `useStateRef`.

Built with TypeScript. Fully typed. Compatible with React 17+.

---

## 📦 Install

```sh
npm install atomhooks
```

---

## ⚡ Quick Usage

```js
import { useStateRef } from 'atomhooks';

const [state, setState, getCurrent] = useStateRef(0);
```

---

## 🧪 Example: useStateRef in Action

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

## 🧩 API

### `useStateRef(initialValue)`

**Returns:**
- `state`: Current state value (used for rendering)
- `setState`: Function to update the state (like useState)
- `getCurrent()`: Synchronously get the latest state, even in async callbacks

---

## 💡 Why use `getCurrent()`?

React’s state can become stale inside `setTimeout`, event handlers, or `useEffect` closures.  
`getCurrent()` ensures you always access the latest value.

---

## 📄 License

MIT © [Muhammad Ahmad](https://github.com/mahmadabid)
