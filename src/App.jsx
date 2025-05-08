import "./style.css";
import React, {useState} from "react";
import LeftSidebar from "./LeftSidebar.jsx";
import DisplayTree, { buildBITTreeRootedAt0, buildBITTreeRootedAtN, buildTreeStructure } from "./DisplayTree.jsx";
import InputBar from "./InputBar.jsx";
import NextButton from "./NextButton.jsx";
import { updateNodeValue, resetNodeColor } from "./UpdateChanges.jsx";

import greenIcon from './assets/Next_Green.png';
import greyIcon from './assets/Next_Grey.png';


export default function App() {
    const [imgSrc, setImgSrc] = useState(greyIcon);
    const [isStepMode, setIsStepMode] = useState(false);
    const [TreeData, setTreeData] = useState(null);
    const [N, setN] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [pendingChanges, setPendingChanges] = useState([]);
    const [currentChangeIndex, setCurrentChangeIndex] = useState(0);
    const [isWaitingForNextClick, setIsWaitingForNextClick] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [currentOperation, setCurrentOperation] = useState(null);
    
    const handleNextStep = () => {
        if (!isStepMode || !isWaitingForNextClick || pendingChanges.length === 0) return;

        const currentChange = pendingChanges[currentChangeIndex];
        const newTree = structuredClone(TreeData);

        const isQuery = currentOperation === 'query';
        console.log("Current operation:", currentOperation);

        if (currentChangeIndex % 2 === 0) {
            // Pass isQuery and setQueryResult to updateNodeValue
            console.log("Updating node:", currentChange.index, "to", currentChange.value);
            console.log("isQuery:", isQuery);
            updateNodeValue(newTree, currentChange.index, currentChange.value, isQuery, setQueryResult);
        } else {
            resetNodeColor(newTree, currentChange.index);
        }

        setTreeData(newTree);

        const nextIndex = currentChangeIndex + 1;
        setCurrentChangeIndex(nextIndex);

        if (nextIndex >= pendingChanges.length) {
            setPendingChanges([]);
            setCurrentChangeIndex(0);
            setIsWaitingForNextClick(false);
        }
    };

    return (
        <div className="h-screen p-4 bg-gray-100 relative">
            <div className="grid grid-cols-[300px_1fr_150px] grid-rows-[50px_1fr_auto] gap-2 h-full">

                {/* Left Sidebar */}
                <LeftSidebar />

                {/* Top Title */}
                <div className="col-span-2 \'p-2 text-[1.6em] font-bold text-center">Binary Indexed Tree (BIT)</div>

                {/* Tree Display */}
                <div className="col-span-2 p-4">
                    {(container) => {
                        if (container) {
                            const rect = container.getBoundingClientRect();
                            setDimensions({ width: rect.width, height: rect.height });
                        }
                    }}
                    <DisplayTree treeData={TreeData} n={N} dimensions={dimensions} setDimensions={setDimensions} />
                </div>

                {/* Input Bar */}
                <InputBar 
                    treeData={TreeData} 
                    setTreeData={setTreeData} 
                    setN={setN} 
                    imgSrc={imgSrc} 
                    setImgSrc={setImgSrc} 
                    setIsStepMode={setIsStepMode} 
                    isStepMode={isStepMode}
                    setPendingChanges={setPendingChanges}
                    setCurrentChangeIndex={setCurrentChangeIndex}
                    setIsWaitingForNextClick={setIsWaitingForNextClick}
                    containerWidth={dimensions.width}
                    containerHeight={dimensions.height}
                    setQueryResult={setQueryResult}
                    setCurrentOperation={setCurrentOperation}
                />

                {/* Next Button */}
                <div className="col-start-3 row-start-3 row-span-2 center">
                    <NextButton 
                        imgSrc={imgSrc} 
                        isActive={isStepMode && isWaitingForNextClick} 
                        onClick={handleNextStep}
                    />
                </div>
            </div>

            {/* Query Result Block */}
            <div className="absolute bottom-10 left-10 p-4 bg-gray-200 rounded-md shadow-md">
                <h3 className="text-lg font-bold">Query Result</h3>
                <p className="text-base">{queryResult || "No query performed yet."}</p>
            </div>
        </div>
    );
}
