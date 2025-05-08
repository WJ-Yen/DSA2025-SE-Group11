import React, { useState } from 'react';
import { buildBITTreeRootedAtN, buildTreeStructure, skewCoordinates } from './v1_nonext/DisplayTree.jsx';
import Buttons from "./v1_nonext/Buttons.jsx";
import Toggle from "./Toggle.jsx";
import UpdateChanges from './UpdateChanges.jsx';

import greenIcon from './assets/Next_Green.png';
import greyIcon from './assets/Next_Grey.png';

const handleConstruct = async (inputStr, setTreeData, setN, containerWidth, containerHeight) => {
    console.log("handle construct");

    // const res = await fetch('/api/buildBIT', {
    //     method: 'POST',
    //     body: JSON.stringify({ values: inputStr }),
    //     headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await res.json();
    // const changes = data.changes;
    const changes = [
        { index: 1, value: 1 },
        { index: 2, value: 2 },
        { index: 3, value: 3 },
        { index: 4, value: 4 },
        { index: 5, value: 5 },
        { index: 6, value: 6 },
        { index: 7, value: 7 }
    ];
  
    // const n = getN;
    const n = 7;
    setN(n);
  
    const rawTree = buildBITTreeRootedAtN(n);
    const initialTree = buildTreeStructure(n + 1, rawTree, n + 1);
    const skewedTree = skewCoordinates(initialTree, n + 1, containerWidth, containerHeight);
    const updated = UpdateChanges(skewedTree, changes, setTreeData);
    setTreeData(updated);

    // console.log("rawTree", rawTree);
    // console.log("initialTree", initialTree);
    // console.log("skewedTree", skewedTree);
    // console.log("updated", updated);
};
  
// Button 2: Query BIT
const handleQuery = async (inputStr, treeData, setTreeData) => {
    console.log("handle query");
    // const res = await fetch('/api/queryBIT', {
    //     method: 'POST',
    //     body: JSON.stringify({ values: inputStr }),
    //     headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await res.json();
    // const changes = data.changes;
    const changes = [
        { index: 1, value: 5 },
        { index: 2, value: 3 }
    ];

    const updated = UpdateChanges(treeData, changes, setTreeData);
    console.log("updated", updated);
    setTreeData(updated);
};

// Button 3: Modify BIT
const handleUpdate = async (inputStr, treeData, setTreeData) => {
    console.log("handle modify");
    // const res = await fetch('/api/modifyBIT', {
    //     method: 'POST',
    //     body: JSON.stringify({ values: inputStr }),
    //     headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await res.json();
    // const changes = data.changes;
    const changes = [
        { index: 1, value: 5 },
        { index: 2, value: 3 }
    ];

    const updated = UpdateChanges(treeData, changes, setTreeData);
    console.log("updated", updated);
    setTreeData(updated);
};

export default function InputBar({ treeData, setTreeData, setN, imgSrc, setImgSrc, setIsStepMode, containerWidth, containerHeight }) {
    const [inputStr, setInputStr] = useState('');

    return (
        <div className="p-2 flex flex-col gap-2">
        <input
            name="input-of-array"
            className="w-full p-2 border border-gray-400 rounded"
            placeholder="Enter inputs (comma-separated)"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
        />
        <div className="flex gap-2">
            <Buttons 
                onConstruct={() => handleConstruct(inputStr, setTreeData, setN, containerWidth, containerHeight)}
                onQuery={() => handleQuery(inputStr, treeData, setTreeData)}
                onUpdate={() => handleUpdate(inputStr, treeData, setTreeData)}
            />
            
            <Toggle
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                greenIcon={greenIcon}
                greyIcon={greyIcon}
                setIsStepMode={setIsStepMode}
            />
        </div>
        </div>
    );
}