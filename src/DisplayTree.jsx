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
		return `(${i.toString(2)}\u2082)`;
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
				x={0}
				y={30}
				textAnchor="middle"
				fontSize="12"
				fill="red"
			>
				{cur.name}
			</text>
			<text
				x={0}
				y={40}
				textAnchor="middle"
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
export default function DisplayTree( {treeData, n, dimensions, setDimensions} ) {
	const containerRef = useRef(null);

	// console.log("DisplayTree", dimensions);

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
		{dimensions.width > 0 && dimensions.height > 0 && (
			<BIT_SVG
				treeData={treeData}
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

function findRootNodes(tree, n) {
	const allNodes = new Set(Object.keys(tree).map(Number));
	const childNodes = new Set(Object.values(tree).flat());
	console.log("allNodes", allNodes);
	console.log("childNodes", childNodes);
	const rootNodes = [...allNodes].filter(
		(node) => !childNodes.has(node) && (node !== n + 1) && (node !== 0)
	);
	return rootNodes;
}  

export function buildBITTreeRootedAtN(n) {
	const tree = {};

	// Initialize empty array for each node
	for (let x = 0; x <= n + 1; x++) tree[x] = [];
	console.log("tree", tree);

	for (let y = 1; y <= n; y++) {
		const x = y + lowbit(y);
		if (x <= n) {
			tree[x].push(y); // y is a child of x
		}
	}
	console.log("n", n);
	console.log("tree", tree);

	// find root nodes
	const rootNodes = findRootNodes(tree, n);
	console.log("rootNodes", rootNodes);
	for (let i = 0; i < rootNodes.length; i++) {
		tree[n + 1].push(rootNodes[i]);
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

export function buildTreeStructure(root, tree, n) {
	return {
		name: root,
		value: (root === n)? 'R': 0,
		x: 0,
		y: 0,
		color: "#ffffff",
		children: tree[root].map(child => buildTreeStructure(child, tree))
	};
}

export function skewCoordinates(node, n, containerWidth, containerHeight) {
	function computeMaxDepth(node, depth = 0) {
		if (!node.children || node.children.length === 0) return depth;
		return Math.max(...node.children.map(c => computeMaxDepth(c, depth + 1)));
	}
	const maxIndex = n;
  	const maxDepth = computeMaxDepth(node);

	const scalex = containerWidth / (maxIndex + 2);
	const scaley = containerHeight / (maxDepth + 1);

	// console.log("tree in skewCoordinates", node);
	const skewedTree = assignSkewedCoordinates(node, 0, scalex, scaley);
	// console.log("skewedTree in skewCoordinates", skewedTree);
	return skewedTree;
}

// Assign coordinates to the nodes in a skewed manner
function assignSkewedCoordinates(root, depth = 0, scalex = 50, scaley = 80, initialx = 0, initialy = 30) {
	const node = { ...root };
	const nodeName = node.name;
	node.x = initialx + nodeName * scalex;
	node.y = initialy + depth * scaley;

	if (node.children) {
        node.children = node.children.map(child =>
            assignSkewedCoordinates(child, depth + 1, scalex, scaley, initialx, initialy)
        );
    }
	// console.log("node: ", root);

	return node;
}
