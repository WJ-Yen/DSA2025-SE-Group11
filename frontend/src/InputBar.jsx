import React, { useState } from 'react';
import { buildBITTreeRootedAtN, buildTreeStructure, skewCoordinates } from './DisplayTree.jsx';
import Buttons from "./Buttons.jsx";
import Toggle from "./Toggle.jsx";
import UpdateChanges from './UpdateChanges.jsx';

import greenIcon from './assets/Next_Green.png';
import greyIcon from './assets/Next_Grey.png';

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
    console.log("inputStr", inputStr);

    const changes = [
        { index: 1, value: 1 },
        { index: 2, value: 2 },
        { index: 3, value: 3 },
        { index: 4, value: 4 },
        { index: 5, value: 5 },
        { index: 6, value: 6 },
        { index: 7, value: 7 }
    ];
  
    const n = 7;
    setN(n);
  
    const rawTree = buildBITTreeRootedAtN(n);
    const initialTree = buildTreeStructure(n + 1, rawTree, n + 1);
    const skewedTree = skewCoordinates(initialTree, n + 1, containerWidth, containerHeight);
    
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

    setQueryResult(0);

    const changes = [
        { index: 1, value: 5 },
        { index: 2, value: 3 },
        { index: 3, value: -3 }
    ];

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

    const changes = [
        { index: 1, value: 5 },
        { index: 2, value: 3 }
    ];

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