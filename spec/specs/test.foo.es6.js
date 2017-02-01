import Foo from '../../app/scripts/core/foo';

console.log("TEST.FOO.ES6.JS")

describe('Foo', () => {
    it('bar', () => {
        expect(Foo.bar()).toEqual('bar');
    });
});
