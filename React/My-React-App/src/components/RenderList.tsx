import { useState } from "react";
function RenderList() {
    const originalItems = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
    const [inputValue, setInputValue] = useState("");

    const filteredItems = originalItems.filter((item) => 
        item.toLowerCase().includes(inputValue.toLowerCase())
    );
    const render = (
        <>
            <h1>Search an Item</h1>

            <input className="border" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

            <h2>Available Items</h2>
            <ul>
                {filteredItems.map((item) => {
                    return <li key={item}>{item}</li>;
                })}
            </ul>
        </>
    );
    return render;
}
export default RenderList;