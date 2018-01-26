# redchain

A library for manipulating state, but in a immutable way

First parameter is the initial state value.
Second parameter is the reducer function which has to return the new state, or return the unchanged current state

The reducer will be called by the dispatch trigger, when value changed all listeners will be called.

```js
import redchain from 'redchain';

const store = redchain(0, (previousState, action: number) => previousState + action);

console.log(store.state); // 0

store.dispatch(2);

console.log(store.state); // 2

```