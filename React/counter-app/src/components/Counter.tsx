import { useState } from "react";

function Counter() {
    const [count, setCount] = useState<number>(0);
    const increment = () => {
        setCount(count + 1);
    }
    const decrement = () => {
        setCount(count - 1);
    }

    const reset = () => {
        setCount(0);
    }
    return (
        <div>
            <h1>Counter Component</h1>
            <p>Current Count: {count}</p>
            <input type="button" value="Increment" onClick={increment} />
            <input type="button" value="Decrement" onClick={decrement} />
            <input type="button" value="Reset" onClick={reset} />
        </div>
    );
}
export default Counter;