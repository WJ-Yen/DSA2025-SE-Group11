import React, { useRef, useState, useEffect } from 'react';

function renderEdges(node) {
	const lines = [];

	function traverse(cur) {
	if (!cur.children) return;
	for (const child of cur.children) {
		lines.push(
		<line
			key={`${cur.name}-${child.name}-${cur.x}-${cur.y}`}
			x1={cur.x}
			y1={cur.y}
			x2={child.x}
			y2={child.y}
			stroke="#555"
		/>
		);
		traverse(child);
	}
	}

	traverse(node);
	return lines;
}

function renderNodes(node) {	
	const nodes = [];

	function formatIndexWithBinary(i) {
		return `${i} (${i.toString(2)}\u2082)`;
	}

	function traverse(cur) {
		nodes.push(
			<g key={`${cur.name}-${cur.x}-${cur.y}`} transform={`translate(${cur.x}, ${cur.y})`}>
			<circle r={18} fill={cur.color} stroke="#000" />

						{/* Value in the center of the circle */}
						<text
				x={0}
				y={5}
				textAnchor="middle"
				fontSize="12"
				fill="black"
			>
				{cur.value ?? 0}
			</text>

			{/* Index (name) outside the circle */}
			<text
				x={-20}
				y={30}
				fontSize="12"
				fill="red"
			>
				{formatIndexWithBinary(cur.name)}
			</text>
			</g>
		);

		if (cur.children) {
			for (const child of cur.children) {
			traverse(child);
			}
		}
	}

	traverse(node);
	return nodes;
}

// Render the BIT tree
export default function DisplayTree({treeData, n, dimensions, setDimensions, currentOperation}) {
    const containerRef = useRef(null);
    
    // Track both trees
    const [rootedAtNTree, setRootedAtNTree] = useState(null);
    const [rootedAt0Tree, setRootedAt0Tree] = useState(null);
    
    // Track node values separately so they can be shared between trees
    const [nodeValues, setNodeValues] = useState({});

    // When treeData changes, update the appropriate tree and extract values
    useEffect(() => {
        if (!treeData) return;
        
        // Extract values from the incoming tree
        const extractValues = (node) => {
            const values = {};
            const traverse = (n) => {
                if (n) {
                    values[n.name] = n.value;
                    if (n.children) {
                        n.children.forEach(traverse);
                    }
                }
            };
            traverse(treeData);
            return values;
        };
        
        // Update node values with any new values
        const newValues = extractValues(treeData);
        setNodeValues(prev => ({...prev, ...newValues}));
        
        // Store the current tree based on operation type
        if (currentOperation === 'query') {
            setRootedAt0Tree(treeData);
        } else {
            setRootedAtNTree(treeData);
        }
    }, [treeData, currentOperation]);
    
    // When switching operations, rebuild the appropriate tree with current values
    useEffect(() => {
        const rebuildTreeWithValues = (tree) => {
            if (!tree) return null;
            
            // Helper function to clone tree with updated values
            const updateTreeValues = (node) => {
                const newNode = {...node};
                
                // Use stored value if available
                if (nodeValues[node.name] !== undefined) {
                    newNode.value = nodeValues[node.name];
                }
                
                if (node.children) {
                    newNode.children = node.children.map(updateTreeValues);
                }
                
                return newNode;
            };
            
            return updateTreeValues(tree);
        };
        
        // Determine which tree to display and rebuild it with current values
        if (currentOperation === 'query') {
            if (rootedAt0Tree) {
                const updatedTree = rebuildTreeWithValues(rootedAt0Tree);
                setRootedAt0Tree(updatedTree);
            }
        } else {
            if (rootedAtNTree) {
                const updatedTree = rebuildTreeWithValues(rootedAtNTree);
                setRootedAtNTree(updatedTree);
            }
        }
    }, [currentOperation, nodeValues]);

    // Determine which tree to display
    const displayTree = currentOperation === 'query' ? rootedAt0Tree : rootedAtNTree;

    // Rest of your component remains the same
    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            {dimensions.width > 0 && dimensions.height > 0 && displayTree && (
                <BIT_SVG
                    treeData={displayTree}
                    n={n}
                    containerWidth={dimensions.width}
                    containerHeight={dimensions.height}
                />
            )}
        </div>
    );
}

// Draw the BIT tree in SVG
function BIT_SVG({ treeData, n, containerWidth, containerHeight }) {
	if (treeData === null) {
		return;
	}

	return (
		<svg width={containerWidth} height={containerHeight}>
			{renderEdges(treeData)}
			{renderNodes(treeData)}
		</svg>
	);
}


// functions to build the tree structure
function lowbit(x) {
	return x & -x;
}

function findRootNodes(tree) {
	const allNodes = new Set(Object.keys(tree).map(Number));
	const childNodes = new Set(Object.values(tree).flat());
	const rootNodes = [...allNodes].filter(
		(node) => tree[node].length > 0 && !childNodes.has(node)
	);
	return rootNodes;
}  

export function buildBITTreeRootedAtN(n) {
	const tree = {};

	// Initialize empty array for each node
	for (let x = 0; x <= n + 1; x++) tree[x] = [];

	for (let y = 1; y <= n; y++) {
		const x = y + lowbit(y);
		if (x <= n + 1) {
			tree[x].push(y); // y is a child of x
		}
	}

	// find root nodes
	const rootNodes = findRootNodes(tree);
	for (let i = 1; i < rootNodes.length; i++) {
		tree[rootNodes[i]].push(rootNodes[i - 1]);
	}

	return tree;
}

export function buildBITTreeRootedAt0(n) {
	const tree = {};

	// Initialize empty array for each node
	for (let x = 0; x <= n; x++) tree[x] = [];

	for (let y = 1; y <= n; y++) {
		const x = y - lowbit(y);
		if (x >= 0) {
			tree[x].push(y); // y is a child of x
		}
	}

	return tree;
}

export function buildTreeStructure(root, tree, n = null) {
    return {
        name: root,
        value: (n !== null && root === n) ? 'R' : 0,
        x: 0,
        y: 0,
        color: "#ffffff",
        children: tree[root] ? tree[root].map(child => buildTreeStructure(child, tree, n)) : []
    };
}

export function skewCoordinates(node, n, containerWidth, containerHeight, currentOperation = 'construct') {
	function computeMaxDepth(node, depth = 0) {
		if (!node.children || node.children.length === 0) return depth;
		return Math.max(...node.children.map(c => computeMaxDepth(c, depth + 1)));
	}
	const maxIndex = n;
  	const maxDepth = computeMaxDepth(node);

	const scalex = containerWidth / (maxIndex + 2);
	const scaley = containerHeight / (maxDepth + 1);

	console.log("containerWidth", containerWidth);
	console.log("containerHeight", containerHeight);
	console.log("maxIndex", maxIndex);
	console.log("maxDepth", maxDepth);
	console.log("scalex", scalex);
	console.log("scaley", scaley);

	// console.log("tree in skewCoordinates", node);
	const skewedTree = assignSkewedCoordinates(node, 0, scalex, scaley, 0, 30, currentOperation);
	// console.log("skewedTree in skewCoordinates", skewedTree);
	return skewedTree;
}

function assignSkewedCoordinates(node, depth, scalex, scaley, minX = 0, offsetY = 30, currentOperation = 'construct') {
    // Clone the node to avoid modifying the original
    const newNode = { ...node };
    
    // Calculate x based on node name, scaling and operation type
    if (currentOperation === 'query') {
        // For query tree (rooted at 0), position nodes based on their name
        newNode.x = (parseInt(newNode.name) + 1) * scalex;
    } else {
        // For construction/update tree (rooted at n+1), position nodes based on their name
        newNode.x = (parseInt(newNode.name)) * scalex;
    }
    
    // Calculate y based on depth
    newNode.y = depth * scaley + offsetY;
    
    // Recursively process children
    if (newNode.children && newNode.children.length > 0) {
        newNode.children = newNode.children.map(child => 
            assignSkewedCoordinates(child, depth + 1, scalex, scaley, minX, offsetY, currentOperation)
        );
    }
    
    return newNode;
}