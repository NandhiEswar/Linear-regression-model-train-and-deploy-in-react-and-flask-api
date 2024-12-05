import React, { useState, useMemo } from 'react';

function ExpensiveComputationExample() {
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);

  // Expensive computation
  const expensiveValue = useMemo(() => {
    console.log('Calculating...');
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
      result += i;
    }
    return result;
  }, [count]);

  return (
    <div>
      <h1>Expensive Value: {expensiveValue}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <p>Count: {count}</p>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      <p>Toggle State: {toggle.toString()}</p>
    </div>
  );
}

export default ExpensiveComputationExample;