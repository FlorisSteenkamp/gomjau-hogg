
export default function(wallaby) {
    return {
        files: [
            'package.json',
            'src/**/*.ts',
        ],
        tests: [
            '__tests__/**/*.spec.ts',
            '__tests__/**/*.ts'
        ],

        autoDetect: true,

        // workers: { restart: true }
    };
};
