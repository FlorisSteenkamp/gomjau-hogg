function getShapeEdges(ps) {
    return ps.map((p, i) => [p, ps[(i + 1) % ps.length]]);
}
export { getShapeEdges };
//# sourceMappingURL=get-shape-edges.js.map