import "./style.css";
import React, {useState} from "react";
import LeftSidebar from "./LeftSidebar.jsx";
import DisplayTree, { buildBITTreeRootedAt0, buildBITTreeRootedAtN, buildTreeStructure } from "../DisplayTree.jsx";
import InputBar from "../InputBar.jsx";
import NextButton from "../NextButton.jsx";

import greenIcon from './assets/Next_Green.png';
import greyIcon from './assets/Next_Grey.png';


export default function App() {
    const [imgSrc, setImgSrc] = useState(greyIcon);
    const [isStepMode, setIsStepMode] = useState(false);
    // const rawTree = buildBITTreeRootedAtN(N);
    // const TreeData = buildTreeStructure(N + 1, rawTree);
    const [TreeData, setTreeData] = useState(null);
    const [N, setN] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    return (
        <div className="h-screen p-4 bg-gray-100">
            <div className="grid grid-cols-[200px_1fr_150px] grid-rows-[50px_1fr_auto] gap-2 h-full">

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
                    containerWidth={dimensions.width}
                    containerHeight={dimensions.height}
                />
                

                {/* Next Button */}
                <div className="col-start-3 row-start-3 row-span-2 center" >
                    <NextButton imgSrc={imgSrc} isActive={isStepMode} />
                </div>
            </div>
        </div>
    );
}
