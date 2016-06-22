const expect = require('chai').expect;
const babel = require('babel-core');
const plugin = require('../lib/plugin');

function transpile(source) {
    return babel.transform(source, {
        plugins: [plugin]
    }).code;
}


function createTracker(source) {
    const sourceLines = source.split('\n');
    const calls = [];
    return {
        __track__(line) {
            calls.push(sourceLines[line-1].trim());
        },

        getCalls() {
            return calls;
        }
    }

}

describe('Transpiler', function () {
    it('creates self-tracking code', function () {
        const source =
           `const a = 1;
            if(a === 0) {
                console.log('This should be omitted...');
            } else {
                for(i=0;i<5;i++) {
                    console.log(i);
                }
                console.log("That's about it.");
            }
        `;
        const tracker = createTracker(source);
        const __track__ = tracker.__track__;
        const modifiedSource = transpile(source);
        eval(modifiedSource);
        expect(tracker.getCalls()).to.eql([
            'const a = 1;',
            'if(a === 0) {',
            'for(i=0;i<5;i++) {',
            'console.log(i);',
            'console.log(i);',
            'console.log(i);',
            'console.log(i);',
            'console.log(i);',
            'console.log("That\'s about it.");'
        ]);
    });
});