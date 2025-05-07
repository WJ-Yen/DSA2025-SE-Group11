function Buttons({ onConstruct, onQuery, onUpdate }) {
    return (
        <div className="flex flex-1 p-2 gap-2">
            <button className="flex-1 button1" onClick={onConstruct}>Construct</button>
            <button className="flex-1 button1" onClick={onQuery}>Query</button>
            <button className="flex-1 button1" onClick={onUpdate}>Update</button>
        </div>
    );
}


export default Buttons;