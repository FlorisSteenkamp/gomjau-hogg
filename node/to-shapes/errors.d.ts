declare const ErrorSeed: () => {
    code: string;
    type: string;
    message: string;
};
declare const ErrorInvalidShape: () => {
    code: string;
    type: string;
    message: string;
};
declare const ErrorTransformAngleZero: (transform: string) => {
    code: string;
    type: string;
    message: string;
};
declare const ErrorTransformNoChange: () => {
    code: string;
    type: string;
    message: string;
};
declare const ErrorTransformNoIntersectionPoint: (transform: string) => {
    code: string;
    type: string;
    message: string;
};
export { ErrorSeed, ErrorInvalidShape, ErrorTransformAngleZero, ErrorTransformNoChange, ErrorTransformNoIntersectionPoint };
