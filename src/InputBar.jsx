import React, { useState } from 'react';
import { buildBITTreeRootedAtN, buildTreeStructure, skewCoordinates } from './DisplayTree.jsx';
import Buttons from "./Buttons.jsx";
import Toggle from "./Toggle.jsx";
import UpdateChanges from './UpdateChanges.jsx';

import greenIcon from './assets/Next_Green.png';
import greyIcon from './assets/Next_Grey.png';

import { get_N, construct, query, update } from './BIT.js';

function convertChanges(changes) {
    const convertedChanges = changes.map((change) => {
        const [index, value] = change;
        return { index, value };
    });
    return convertedChanges;
}

const handleConstruct = async (
    inputStr, 
    setTreeData, 
    setN, 
    containerWidth, 
    containerHeight,
    isStepMode, 
    setPendingChanges,
    setCurrentChangeIndex,
    setIsWaitingForNextClick,
    setCurrentOperation
) => {

    setCurrentOperation("construct");

    console.log("handle construct");
    const result = construct(inputStr);
    console.log("inputStr", inputStr);
    console.log("result", result);

    if (result === null) return;

    const changes = convertChanges(result);
    console.log("changes", changes);
  
    const n = get_N();
    setN(n);
  
    const rawTree = buildBITTreeRootedAtN(n);
    console.log("rawTree", rawTree);
    const initialTree = buildTreeStructure(n + 1, rawTree, n + 1);
    console.log("initialTree", initialTree);
    const skewedTree = skewCoordinates(initialTree, n + 1, containerWidth, containerHeight);
    console.log("skewedTree", skewedTree);
    
    // Pass step mode parameters
    const updated = UpdateChanges(
        skewedTree, 
        changes, 
        setTreeData,
        isStepMode,
        setPendingChanges,
        setCurrentChangeIndex,
        setIsWaitingForNextClick
    );
    
    setTreeData(updated);
};

const handleQuery = async (
    inputStr, 
    treeData, 
    setTreeData,
    isStepMode, 
    setPendingChanges,
    setCurrentChangeIndex,
    setIsWaitingForNextClick,
    setQueryResult,
    setCurrentOperation
) => {
    setCurrentOperation("query");

    console.log("handle query");
    console.log("inputStr", inputStr);
    const result = query(inputStr);
    console.log("changes", result);
    if (result === null) return;

    const changes = convertChanges(result);
    console.log("changes", changes);

    setQueryResult(0);

    const updated = UpdateChanges(
        treeData, 
        changes, 
        setTreeData,
        isStepMode,
        setPendingChanges,
        setCurrentChangeIndex,
        setIsWaitingForNextClick,
        true,
        setQueryResult
    );
    console.log("updated", updated);
    setTreeData(updated);
};

const handleUpdate = async (
    inputStr, 
    treeData, 
    setTreeData,
    isStepMode, 
    setPendingChanges,
    setCurrentChangeIndex,
    setIsWaitingForNextClick,
    setCurrentOperation
) => {
    setCurrentOperation("update");
    console.log("handle modify");
    console.log("inputStr", inputStr);
    const result = update(inputStr);
    console.log("changes", result);
    if (result === null) return;

    const changes = convertChanges(result);
    console.log("changes", changes);

    const updated = UpdateChanges(
        treeData, 
        changes, 
        setTreeData,
        isStepMode,
        setPendingChanges,
        setCurrentChangeIndex,
        setIsWaitingForNextClick
    );
    console.log("updated", updated);
    setTreeData(updated);
};

export default function InputBar({ 
    treeData, 
    setTreeData, 
    setN, 
    imgSrc, 
    setImgSrc, 
    setIsStepMode,
    isStepMode,
    setPendingChanges,
    setCurrentChangeIndex,
    setIsWaitingForNextClick,
    containerWidth, 
    containerHeight,
    setQueryResult,
    setCurrentOperation
}) {
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
                    onConstruct={() => handleConstruct(
                        inputStr, 
                        setTreeData, 
                        setN, 
                        containerWidth, 
                        containerHeight,
                        isStepMode,
                        setPendingChanges,
                        setCurrentChangeIndex,
                        setIsWaitingForNextClick,
                        setCurrentOperation
                    )}
                    onQuery={() => handleQuery(
                        inputStr, 
                        treeData, 
                        setTreeData,
                        isStepMode,
                        setPendingChanges,
                        setCurrentChangeIndex,
                        setIsWaitingForNextClick,
                        setQueryResult,
                        setCurrentOperation
                    )}
                    onUpdate={() => handleUpdate(
                        inputStr, 
                        treeData, 
                        setTreeData,
                        isStepMode,
                        setPendingChanges,
                        setCurrentChangeIndex,
                        setIsWaitingForNextClick,
                        setCurrentOperation
                    )}
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