import Foo2 from '../../../app/scripts/core/foo2';

console.log("a/TEST.FOO.TS")

describe('Foo 2', () => {
    it('bar', () => {
        expect(Foo2.bar()).toEqual('bar2');
    });
});
