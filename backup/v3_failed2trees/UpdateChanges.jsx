// Add these functions at the top level so they can be imported by App.jsx
export function updateNodeValue(node, targetIndex, newValue) {
    if (parseInt(node.name) === targetIndex) {
        node.value = newValue;
        node.color = "#ff0000"; // highlight the updated node
        return true; // found and updated
    }

    if (node.children) {
        for (const child of node.children) {
            if (updateNodeValue(child, targetIndex, newValue)) {
                return true; // short-circuit if found
            }
        }
    }
  
    return false; // not found
}

export function resetNodeColor(node, targetIndex) {
    if (parseInt(node.name) === targetIndex) {
        node.color = "#ffffff";
        return true;
    }
  
    if (node.children) {
        for (const child of node.children) {
            if (resetNodeColor(child, targetIndex)) {
                return true;
            }
        }
    }
    
    return false;
}

export default function UpdateChanges(
    tree, 
    changes, 
    setTreeData,
    isStepMode = false,
    setPendingChanges = null,
    setCurrentChangeIndex = null,
    setIsWaitingForNextClick = null
) {
    const newTree = structuredClone(tree); // Make a deep copy
    
    // If in step mode, prepare changes for step-by-step processing
    if (isStepMode && setPendingChanges && changes.length > 0) {
        // Create a list of actions (both colorize and resets)
        const actionList = [];
        
        // For each change, we need two actions: colorize and reset
        changes.forEach(change => {
            // First action: Update value and change color to red
            actionList.push({
                type: 'update',
                index: change.index,
                value: change.value
            });
            
            // Second action: Reset color to white
            actionList.push({
                type: 'reset',
                index: change.index
            });
        });
        
        // Set the pending changes
        setPendingChanges(actionList);
        setCurrentChangeIndex(0);
        setIsWaitingForNextClick(true);
        
        // Apply just the first change (make it visible)
        if (actionList.length > 0) {
            updateNodeValue(newTree, actionList[0].index, actionList[0].value);
        }
        
        // Return the tree with just the first change applied
        return newTree;
    }
    
    // Normal (non-step) mode
    if (setTreeData && typeof setTreeData === 'function') {
        setTimeout(() => {
            // First update immediately to start showing changes
            applyFirstUpdate(newTree, changes, setTreeData);
            
            // Then schedule the rest of the updates with pauses in between
            scheduleUpdates(newTree, changes, setTreeData);
        }, 500);
    } else {
        // If no setTreeData function is provided, just apply all updates immediately
        applyUpdates(newTree, changes);
    }
    
    return newTree;
}

// Apply just the first update immediately
function applyFirstUpdate(tree, changes, setTreeData) {
    if (changes.length === 0) return;
    
    const firstChange = changes[0];
    updateNodeValue(tree, firstChange.index, firstChange.value);
    
    // Update UI immediately with the first change
    setTreeData({...tree});
}

// Schedule the remaining updates with pauses
function scheduleUpdates(tree, changes, setTreeData) {
    // Skip the first change since it was already applied    
    if (changes.length === 0) return;
    
    let currentIndex = 0;
    
    // Function to apply a single update
    const applyNextUpdate = () => {
        const change = changes[currentIndex];
        updateNodeValue(tree, change.index, change.value);
        
        // Update UI with current state
        setTreeData({...tree});
        
        // Schedule color reset
        setTimeout(() => {
            resetNodeColor(tree, change.index);
            setTreeData({...tree});
            
            // Move to next change
            currentIndex++;
            
            // If more changes exist, schedule the next one
            if (currentIndex < changes.length) {
                setTimeout(applyNextUpdate, 500); // Wait between changes
            }
        }, 500); // Wait 1 second before resetting color
    };
    
    // Start the chain of updates
    setTimeout(applyNextUpdate, 0); // Wait 1 second after first change
}

// Original synchronous function (still used for non-animated updates)
function applyUpdates(tree, changes) {
    for (const change of changes) {
        const nodeIndex = change.index;
        const value = change.value;
        updateNodeValue(tree, nodeIndex, value);
    }
}