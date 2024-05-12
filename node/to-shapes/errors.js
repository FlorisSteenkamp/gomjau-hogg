const ErrorSeed = () => ({
    code: 'ErrorSeed',
    type: 'Seed Shape',
    message: 'The seed shape must be one of 3, 4, 6, 8 or 12, directly followed by a `-` to indicate the start of the next shape group.',
});
const ErrorInvalidShape = () => ({
    code: 'ErrorShape',
    type: 'Invalid Shape',
    message: 'Shapes must only be one of 3, 4, 6, 8, or 12.',
});
const ErrorTransformAngleZero = (transform) => ({
    code: 'ErrorTransformAngle',
    type: 'Transform Angle',
    message: `The angle of the "${transform}" transform must be greater than 0.`,
});
const ErrorTransformNoChange = () => ({
    code: 'ErrorTransformNoChange',
    type: 'Repeated Transform',
    message: 'The covered area did not increase when the tile was repeated. ' +
        'This is likely caused by one or more incorrect transforms.'
});
const ErrorTransformNoIntersectionPoint = (transform) => ({
    code: 'ErrorTransformNoIntersectionPoint',
    type: 'Transform Intersection Point',
    message: `No intersection point found for the "${transform}" transform.`,
});
export { ErrorSeed, ErrorInvalidShape, ErrorTransformAngleZero, ErrorTransformNoChange, ErrorTransformNoIntersectionPoint };
//# sourceMappingURL=errors.js.map