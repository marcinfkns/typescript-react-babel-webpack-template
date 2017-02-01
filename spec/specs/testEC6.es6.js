//based on https://github.com/angus-c/es6-tests

//import "babel-polyfill";

import chai from "chai"
var assert = chai.assert;

describe.skip = function(){}
it.skip = function(){}

//---------------------------------------------------------------

describe('new array methods', () => {
  describe('Array.prototype methods', () => {
    let arr;
    beforeEach(() => {
      arr = ['a', 17, false, '30', 4];
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.fill
    describe('Array.prototype.fill', () => {
      it('replaces all members', () => {
        assert.sameMembers(arr.fill(3), [3, 3, 3, 3, 3]);
      });

      it('replaces the members up to an index', () => {
        assert.sameMembers(arr.fill(5, 2), ['a', 17, 5, 5, 5]);
      });

      it('replaces the members between indices', () => {
        assert.sameMembers(arr.fill(5, 2, 3), ['a', 17, 5, '30', 4]);
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.find
    describe('Array.prototype.find', () => {
      it('finds the item', () => {
        assert.equal(arr.find(Number), 17);
      });

      it('honors the `this` context', () => {
        assert.equal(
          arr.find(function (e) {return this.sqrt(e) == 2}, Math),
          4
        );
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.findindex
    describe('Array.prototype.findIndex', () => {
      it('finds the index', () => {
        assert.equal(arr.findIndex(Number), 1);
      });

      it('honors the `this` context', () => {
        assert.equal(
          arr.findIndex(function (e) {return this.sqrt(e) == 2}, Math),
          4
        );
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.keys
    // See iterator.spec for more thorough iterator tests
    describe('Array.prototype.keys', () => {
      const arr = [7, 8, 9];
      it.skip('returns an iterator', () => {
        assert.isDefined(arr.keys()[[Symbol.iterator]]);
      });

      it('iterates over the keys', () => {
        let arrKeys = arr.keys();
        let i = 0;
        for (let key of arrKeys) {
          assert.isTrue(key == i++);
        }
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.values
    // See iterator.spec for more thorough iterator tests
    describe.skip('Array.prototype.values', () => {
      const arr = [7, 8, 9];
      it('returns an iterator', () => {
        assert.isDefined(arr.values()[[Symbol.iterator]]);
      });

      it('iterates over the values', () => {
        let arrValues = arr.values();
        let i = 0;
        for (let value of arrValues) {
          assert.isTrue(value == arr[i++]);
        }
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.entries
    // See iterator.spec for more thorough iterator tests
    describe('Array.prototype.entries', () => {
      const arr = [7, 8, 9];

      it.skip('returns an iterator', () => {
        assert.isDefined(arr.entries()[[Symbol.iterator]]);
      });

      it('iterates over the key value pairs', () => {
        let arrKeyValuePairs = arr.entries();
        let i = 0;
        for (let pair of arrKeyValuePairs) {
          assert.sameMembers(pair, [i, arr[i]]);
          i++;
        }
      });
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.prototype.copywithin
    describe.skip('Array.prototype.copyWithin', () => {
      it('copies over all members', () => {
        assert.sameMembers(arr.copyWithin([1, 2, 'f', 3, 4]), [1, 3, 'f', 3, 4]);
      });
    });
  });

  describe('Array constructor methods', () => {
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
    describe('Array.from', () => {
      it('converts array-like objects to arrays', () => {
        const arrayLikeObjects = [
          {value: 'mickey mouse', length: 12},
          {value: new Map([[true, 99], [false, window]]), length: 2},
          {value: new Set([1, 'a', 'a', 4]), length: 3},
          {value: (function () {return arguments})([1, 2], 6, 7, /$[0-9]*/), length: 4}
        ]
        arrayLikeObjects.forEach((obj) => {
          let array = Array.from(obj.value);
          assert.isTrue(Array.isArray(array));
          assert.equal(array.length, obj.length);
        });
      });

      it('supports predicates', () => {
        const arr = new Array(5);
        arr[0] = 'x', arr[1] = 'y', arr[3] = 'z';
        assert.sameMembers(Array.from(arr, e => e || '*'), ['x', 'y', '*', 'z', '*']);

        const predicate = (e, i, a) => Array.isArray(e) ? e[0] : e;
        assert.sameMembers(Array.from([1, [2, 3], 4], predicate), [1, 2, 4]);

        const map = new Map([[true, [1, 3, 5]], [false, [2, 4, 6]]]);
        const print = e => `${e[0]}-${e[1].join('')}`;
        assert.sameMembers(Array.from(map, print), ['true-135', 'false-246']);

        assert.sameMembers(Array.from({length: 3}, (e, i) => i), [0, 1, 2]);
        assert.sameMembers(Array.from('cow', e => e.toUpperCase()), ['C', 'O', 'W']);
      });

      it('honors the `this` argument', () => {
        const sqrt = function (e) {return this.sqrt(e)}
        assert.sameMembers(Array.from([1, 4, 9], sqrt, Math), [1, 2, 3]);
      });
    });

    describe('Array.of', () => {
      it('creates a new array using the given arguments', () => {
        const argsData = [
          [1, 2, 3],
          [3],
          ['fox', 'rabbit', 'wolf'],
          [{}, [], {}],
          [undefined]
        ]
        for (let args of argsData) {
          let arr = Array.of(...args);
          assert.equal(arr.length, args.length);
          args.forEach((arg, i) => {
            assert.equal(arr[i], arg);
          });
        }
      });
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-math
describe('new Math features', () => {
  describe('the methods', () => {
    it('has Math.sign', () => {
      assert.equal(Math.sign(3), 1);
      assert.equal(Math.sign(-3), -1);
    });

    it('has Math.trunc', () => {
      assert.equal(Math.trunc(1.5), 1);
      assert.equal(Math.trunc(-1.7), -1);
      assert.equal(Math.trunc(Math.PI), 3);
    });

    it('has Math.cbrt', () => {
      assert.equal(Math.cbrt(8), 2);
      assert.equal(Math.cbrt(-8), -2);
    });

    it('has Math.log2 and Math.log10', () => {
      assert.equal(Math.log2(8), 3);
      assert.equal(Math.log10(100), 2);
    });

    it('has Math.fround', () => {
      assert.notEqual(Math.fround(1.1), 1.1);
      assert.equal(Math.round(Math.fround(1.1)), Math.round(1.1));
    });

    it('has Math.imul', () => {
      assert.notEqual(Math.imul(5, 3.01), 5 * 3.01);
      assert.equal(Math.round(Math.imul(5, 3.01)), Math.round(5 * 3.01));
    });

    it('has Math.clz32', () => {
      assert.equal(Math.clz32(58), 26);
    });

    it('has Math.expm1', () => {
      assert.closeTo(Math.expm1(1), 1.7182, 0.0001);
    });

    it('has Math.hypot', () => {
      assert.equal(Math.hypot(3, 4), 5);
      assert.closeTo(Math.hypot(7, 12), 13.8924, 0.0001);
    });

    it('has the new trig functions', () => {
      assert.closeTo(Math.sinh(1), 1.1752, 0.0001);
      assert.closeTo(Math.cosh(1), 1.5430, 0.0001);
      assert.closeTo(Math.tanh(1), 0.7615, 0.0001);
      assert.closeTo(Math.asinh(1), 0.8813, 0.0001);
      assert.closeTo(Math.acosh(10), 2.9932, 0.0001);
      assert.closeTo(Math.atanh(0.5), 0.5493, 0.0001);
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object-constructor
describe('ES6 Object constructor methods', () => {
  let obj;
  beforeEach(() => {
    obj = {
      a: 47,
      b: {c: 4},
      c: true
    };
  });

  // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
  describe('Object.assign', () => {
    it('extends existing object', () => {
      expect(Object.assign(obj, {d: 4})).toEqual(
          {a: 47, b: {c: 4}, c: true, d: 4});
    });

    it('clobbers existing properties', () => {
      expect(Object.assign(obj, {b: {c: 5}})).toEqual(
          {a: 47, b: {c: 5}, c: true});
    });

    it('accepts multiple sources', () => {
      expect(Object.assign(obj, {b: {c: 5}}, {d: 4})).toEqual(
          {a: 47, b: {c: 5}, c: true, d: 4});
    });
  });

  // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.is
  describe('Object.is', () => {
    it('works like === for regular values', () => {
      assert.isTrue(Object.is(3, 3));
      assert.isFalse(Object.is('3', 3));
    });

    it('treats NaNs as equal', () => {
      assert.isTrue(Object.is(NaN, NaN));
    });

    it('treats 0 and -0 as unequal', () => {
      assert.isFalse(Object.is(0, -0));
    });
  });

  // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.setprototypeof
  describe('Object.setPrototypeOf', () => {
    it('sets prototype of plain object', () => {
      Object.setPrototypeOf(obj, {d: 8});
      expect(Object.getPrototypeOf(obj)).toEqual({d: 8});
      assert.equal(obj.d, 8);
    });

    it('replaces prototype of object with custom prototype', () => {
      Object.setPrototypeOf(obj, {d: 8});
      expect(Object.getPrototypeOf(obj)).toEqual({d: 8});
      Object.setPrototypeOf(obj, {e: 12});
      expect(Object.getPrototypeOf(obj)).toEqual({e: 12});
      assert.equal(obj.e, 12);
      assert.isUndefined(obj.d);
    });
  });

  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.getownpropertysymbols
  describe('Object.getOwnPropertySymbols', () => {
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-arrow-function-definitions
describe('arrow functions', () => {
  let fn;
  describe('braces and return statement', () => {
    it('does not need braces or return for single statement', () => {
      fn = x => x * x;
      assert.equal(fn(4), 16);
    });

    it('needs braces and return for multi statement', () => {
      fn = x => {x++; x * x};
      assert.equal(fn(4), undefined);
      fn = x => {x++; return x * x};
      assert.equal(fn(4), 25);
    });
  });

  describe('param values', () => {
    it('does not need parens for single parameter', () => {
      fn = x => x * x;
      assert.equal(fn(4), 16);
    });

    it('does need parens for no or many params', () => {
      fn = () => 5;
      assert.equal(fn(), 5);
      fn = (a, b) => a + b;
      assert.equal(fn(13, 2), 15);
    });
  });

  describe('`this` value', () => {
    it('observes lexical `this` binding', () => {
      let obj = {
        fn1() {
          assert.equal(obj, this);
          let fn2 = () => {
            assert.equal(obj, this);
            [1, 2, 3].forEach(() => {
              assert.equal(obj, this);
            });
          };
          return fn2();
        }
      }
      obj.fn1();
    });
    it('will not allow call/apply/bind to change `this`', () => {
      let obj = {
        fn1() {
          assert.equal(obj, this);
          let fn2 = () => this;
          assert.equal(fn2.call({}), obj);
          assert.equal(fn2.apply({}), obj);
          assert.equal(fn2.bind({})(), obj);
        }
      }
      obj.fn1();
    });
  });

  describe.skip('an arrow function is not a full function', () => {
    it('has no prototype', () => {
      assert.isUndefined((x => x * x).prototype);
    });

    it('is not a constructor', () => {
      assert.throw(() => new (x => x * x), Error);
    });

    it('is has no `arguments` object', () => {
      (() => assert.isUndefined(arguments))();
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-class-definitions
describe('class', () => {
  class EmptyClass {};
  class BasicClass {
    static s() {return this}
    a() { return this }
    b() {}
  }

  describe('types and properties', () => {
    it('is a constructor', () => {
      assert.equal(typeof EmptyClass, 'function');
      assert.equal(typeof EmptyClass.prototype, 'object');
      assert.equal(EmptyClass.prototype.constructor, EmptyClass);
    });

    it('\'s dynamic methods go on the prototype', () => {
      assert.equal(typeof BasicClass.prototype.a, 'function');
      assert.equal(typeof BasicClass.prototype.b, 'function');
    });

    it('\'s static methods go on the constructor', () => {
      assert.equal(typeof BasicClass.s, 'function');
    });
  });

  describe('instances', () => {
    const ec = new EmptyClass();
    const bc = new BasicClass();
    it('(their) constructor is the class', () => {
      assert.equal(ec.constructor, EmptyClass);
      assert.equal(bc.constructor, BasicClass);
    });
    it('(they) reference class methods in their prototype', () => {
      assert.equal(bc.__proto__.a, BasicClass.prototype.a);
      assert.equal(bc.__proto__.b, BasicClass.prototype.b);
    });

    it('\'s value is `this` when calling prototype methods', () => {
      assert.equal(bc.a(), bc);
    });
  });

  describe('extends', () => {
    let SuperClass, SubClass;
    beforeEach(() => {
      SuperClass = class {
        constructor(n) {
          this.x = n;
        }
        c() {}
        d() {}
        e() {}
      }
      SubClass = class extends SuperClass{
        constructor(n) {
          super(n);
          this.x += n;
        }
        e() {return super.e}
        f() {}
        g() {}
      }
    });

    it('(the subclass) can access methods from the superclass', () => {
      const subClass = new SubClass();
      assert.equal(typeof subClass.__proto__.e, 'function');
      assert.equal(typeof subClass.__proto__.f, 'function');
      assert.equal(typeof subClass.__proto__.g, 'function');
      assert.equal(typeof subClass.__proto__.__proto__.c, 'function');
      assert.equal(typeof subClass.__proto__.__proto__.d, 'function');
      assert.equal(typeof subClass.__proto__.__proto__.e, 'function');
      assert.equal(typeof subClass.c, 'function');
      assert.equal(typeof subClass.d, 'function');
      assert.equal(typeof subClass.e, 'function');
      assert.equal(typeof subClass.f, 'function');
      assert.equal(typeof subClass.g, 'function');
    });

    it('(the subclass) can override methods from the superclass', () => {
      SubClass.prototype.c = function () {};
      const subClass = new SubClass();
      assert.notEqual(subClass.c, subClass.__proto__.__proto__.c);
    });

    it('can dynamically override methods from the superclass', () => {
      const subClass = new SubClass();
      const superC = subClass.c;
      SubClass.prototype.c = function () {};
      assert.notEqual(subClass.c, superC);
    });

    it('uses super to access the superclass method', () => {
      const subClass = new SubClass();
      assert.equal(typeof subClass.e, 'function');
      assert.equal(typeof subClass.e(), 'function');
      assert.notEqual(subClass.e, subClass.e());
    });

    it('(super) calls superclass constructor', () => {
      const subClass = new SubClass(1);
      assert.equal(subClass.x, 2);
    });
  });
  describe('static methods', () => {
    it('(they) can only be invoked by the constructor', () => {
      let bc = new BasicClass();
      assert.isUndefined(bc.s);
      assert.isUndefined(BasicClass.prototype.s);
      assert.isDefined(BasicClass.s);
    });

    it('(their) `this` value is the class', () => {
      assert.equal(BasicClass.s(), BasicClass);
    });

    it('(they) can only see static properties', () => {
      class BasicClass2 {
        static s1() {return sp}
        static s2() {return this.sp}
        static s3() {return BasicClass2.sp}
        static s4() {return this.i()}
        i() {return 7}
      }
      BasicClass2.sp = 4;
      assert.throws(BasicClass2.s1, Error);
      assert.equal(BasicClass2.s2(), 4);
      assert.equal(BasicClass2.s3(), 4);
      assert.throws(BasicClass2.s4, Error);
    });
  });

  describe('dynamism', () => {
    it('can create unique classes from a template', () => {
      const classMaker = () => class {
        a() {}
        b() {}
      };
      const Class1 = classMaker();
      const Class2 = classMaker();
      assert.notEqual(Class1, Class2);
      assert.notEqual(Class1.prototype.a, Class2.prototype.a);
      assert.notEqual(Class1.prototype.b, Class2.prototype.b);
    });

    it('(class) can be created with different super classes', () => {
      const classMaker = base => class extends base {};
      const Class1 = classMaker(class {a() {}});
      const Class2 = classMaker(class {b() {}});
      assert.notEqual(Class1, Class2);
      assert.isDefined(Class1.prototype.a);
      assert.isUndefined(Class1.b);
      assert.isDefined(Class2.prototype.b);
      assert.isUndefined(Class2.a);
    });

    it('(class) can generate instance methods on the fly', () => {
      const Class1 = class {a() {}};
      const class1 = new Class1();
      assert.equal(class1.a, Class1.prototype.a);
      assert.isUndefined(class1.b);
      Class1.prototype.b = () => {};
      assert.equal(class1.b, Class1.prototype.b);
      assert.isDefined(class1.b);
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-function-definitions
describe('defaults', () => {
  const _n = 2;
  const _s = '3';
  const _b = false;
  const _sym = Symbol.for('y');
  const _o = {r: 5};
  const _a = [0, 6, 5];

  it('can assign values of type', () => {
    const fn = (
      a = 2,
      b = '3',
      c = false,
      d = Symbol.for('x'),
      e = {r: 5},
      f = [0, 6, 5]
    ) => {
      assert.equal(a, 2);
      assert.equal(b, '3');
      assert.equal(c, false);
      assert.equal(Symbol.keyFor(d), 'x');
      assert.deepEqual(e, {r: 5});
      assert.sameMembers(f, [0, 6, 5]);
    };
    fn();
  });

  it('can assign via reference', () => {
    const fn = (
      a = _n,
      b = _s,
      c = _b,
      d = _sym,
      e = _o,
      f = _a
    ) => {
      assert.equal(a, 2);
      assert.equal(b, '3');
      assert.equal(c, false);
      assert.equal(Symbol.keyFor(d), 'y');
      assert.deepEqual(e, {r: 5});
      assert.sameMembers(f, [0, 6, 5]);
    };
    fn();
  });

  it('only assigns if argument not past', () => {
    const fn = (
      a = _n,
      b = _s,
      c = _b,
      d = _sym,
      e = _o,
      f = _a
    ) => {
      assert.equal(a, 7);
      assert.equal(b, '8');
      assert.equal(c, true);
      assert.equal(d, 'not a symbol');
      assert.deepEqual(e, {h: 1});
      assert.equal(f, 73);
    };
    fn(7, '8', true, 'not a symbol', {h: 1}, 73);
  });

  it('can be assigned via destructure', () => {
    const fn = (
      [a, b, c, d, {e, f}] = [_n, _s, _b, _sym, {e: _o, f: _a}]
    ) => {
      assert.equal(a, 2);
      assert.equal(b, '3');
      assert.equal(c, false);
      assert.equal(Symbol.keyFor(d), 'y');
      assert.deepEqual(e, {r: 5});
      assert.sameMembers(f, [0, 6, 5]);
    };
    fn();
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-destructuring-assignment
describe('destructuring', () => {
  let array1 = [1, 3, 5, 2, 4];
  let array2 = [{a: 4, b: true}, [1, 2], undefined, false, 'c'];
  describe('arrays', () => {
    it('assigns all values', () => {
      let [a, b, c, d, e] = array1;
      assert.equal(a, 1);
      assert.equal(b, 3);
      assert.equal(c, 5);
      assert.equal(d, 2);
      assert.equal(e, 4);
      let [f, g, h, i, j] = array2;
      assert.deepEqual(f, {a: 4, b: true});
      assert.sameMembers(g, [1, 2]);
      assert.isUndefined(h);
      assert.isFalse(i);
      assert.equal(j, 'c');
    });

    it('assigns to named variables only', () => {
      let [c, d] = array1;
      assert.equal(c, 1);
      assert.equal(d, 3);
      let [,, e, f, g] = array1;
      assert.equal(e, 5);
      assert.equal(f, 2);
      assert.equal(g, 4);
    });

    it('assigns to rest variables', () => {
      let [a, ...rest] = array1;
      assert.equal(a, 1);
      assert.sameMembers(rest, [3, 5, 2, 4]);
      [...rest] = array1;
      assert.sameMembers(rest, [1, 3, 5, 2, 4]);
    });
  });
  describe('objects', () => {
    let obj = {
      a: 1,
      b: [2, 3, 4],
      c: {cc: 4, dd: {eee: 'hello'}},
      d: true
    }

    it('assigns top level keys', () => {
      let {a, b, c, d} = obj;
      assert.equal(a, 1);
      assert.sameMembers(b, [2, 3, 4]);
      assert.deepEqual(c, {cc: 4, dd: {eee: 'hello'}});
      assert.isTrue(d);
    });

    it('assigns selected keys', () => {
      let {a, d} = obj;
      assert.equal(a, 1);
      assert.isTrue(d);
    });

    it('assigns deep nested values', () => {
      let {a: x, c: {dd: {eee: y}}, d: z} = obj;
      assert.equal(x, 1);
      assert.equal(y, 'hello');
      assert.isTrue(z);
    });
  });
  describe('with primitives', () => {
    it('assigns undefined if RHS is primitive', () => {
      let {x, y, z} = 4;
      assert.isUndefined(x);
      assert.isUndefined(y);
      assert.isUndefined(z);
    });
  });
  describe('with defaults', () => {
    it('can use defaults', () => {
      let {a = 1, b = 2, c = 3, d = 4} = {b: 3, d: 1};
      assert.equal(a, 1);
      assert.equal(b, 3);
      assert.equal(c, 3);
      assert.equal(d, 1);
    });
  });
  describe('as', () => {
    it('can reassign', () => {
      let a, b, c;
      let {a: x, b: y, c: z, d} = {a: 2, b: 3, c: 4, d: 1};
      assert.equal(x, 2);
      assert.equal(y, 3);
      assert.equal(z, 4);
      assert.isUndefined(a);
      assert.isUndefined(b);
      assert.isUndefined(c);
      assert.equal(d, 1);
    });
  });
  describe('in arguments', () => {
    it('can be used in arguments', () => {
      let fn = (i, {a: x, c: {dd: {eee: y}}, d: z}) => {
        assert.equal(i, 5);
        assert.equal(x, 1);
        assert.equal(y, 'hello');
        assert.equal(z, true);
      }
      fn(5, {a: 1, c: {cc: 4, dd: {eee: 'hello'}}, d: true});
    })
  });
  describe('in for-of', () => {
    it('can destructure a for-of', () => {
      let arr = [{a: 4, b: 7}, {a: 8, b: 3}, {a: 6, b: 2}];
      let count = 0;
      for (let {a, b} of arr) {
        assert.equal(a, arr[count].a);
        assert.equal(b, arr[count].b);
        count++;
      }
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-objects
describe('enhanced literals', () => {
  describe('shortcuts', () => {
    it('supports all shortcuts', () => {
      const a = 1, b = 2;
      assert.deepEqual({a, b}, {a: 1, b: 2});
    });

    it('supports shortcuts mixed with regular assignments', () => {
      const a = 1;
      assert.deepEqual({a, b: 2}, {a: 1, b: 2});
    });
  });
  describe('computed keys', () => {
    it('supports simple string aggregation', () => {
      assert.deepEqual({['a' + 'b']: 36}, {ab: 36});
      assert.deepEqual({[['a', 'b'].join('')]: 36}, {ab: 36});
    });

    it('supports variable substitution', () => {
      const x = 'ant', y = 'bee';
      assert.deepEqual({[x]: 36, [y]: 79}, {ant: 36, bee: 79});
      assert.deepEqual({[x + y]: 36, [y]: 79}, {antbee: 36, bee: 79});
    });

    it('supports function return values', () => {
      const fn = (a, b) => '_' + a + a + b;
      assert.deepEqual(
        {[fn('x', 'y')]: 36, [fn('boo', 'boo')]: 79},
        {_xxy: 36, _boobooboo: 79}
      );
    });

    it('coerces non-strings', () => {
      assert.deepEqual(
        {[{toString: ()=>'hello'}]: 36, [true]: 79},
        {hello: 36, true: 79}
      );
    });
  });
  describe('class-style method syntax', () => {
    it('supports class-style method syntax', () => {
      const helloer = {
        hi() {
          return 'hello'
        }
      };
      assert.equal(helloer.hi(), 'hello');
    });

    it('can mix old and new method syntax', () => {
      const helloer = {
        hi() {
          return 'hello'
        },
        grin: function () {
          return 'smile'
        }
      };
      assert.equal(helloer.hi(), 'hello');
      assert.equal(helloer.grin(), 'smile');
    });
  });
  describe('prototype assignment', () => {
    it('can assign prototype to instance', () => {
      const thing = {
        __proto__: {
          do() {return 'superDo'}
        }
      };
      assert.isFalse(thing.hasOwnProperty('do'));
      assert.equal(thing.do(), 'superDo');
      assert.isUndefined(thing.constructor.prototype.do);
    });

    it('supports super', () => {
      const thing = {
        do() {
          return 'meDo' + '@' + super.do();
        },
        __proto__: {
          do() {return 'superDo'}
        }
      };
      assert.isTrue(thing.hasOwnProperty('do'));
      assert.equal(thing.do(), 'meDo@superDo');
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generator-objects
describe('generators', () => {
  describe('types', () => {
    it.skip('(GeneratorFunction) is a constructor', () => {
      assert.equal(typeof GeneratorFunction, 'function');
      assert.equal(typeof GeneratorFunction.prototype, 'object');
    });

    it.skip('function* is a function keyword', () => {
      assert.equal(typeof function* () {}, 'function');
    });
  });

  describe('yield', () => {
    it('exits the function', () => {
      let x = 0;
      const g = (function* () {
        while (true) {
          x++;
          yield;
        }
      })();
      assert.deepEqual(g.next(), {value: undefined, done: false});
      assert.equal(x, 1);
    });

    it('exits the function with the given value', () => {
      let x = 0;
      const g = (function* () {
        while (true) {
          x++;
          yield 7;
        }
      })();
      assert.deepEqual(g.next(), {value: 7, done: false});
      assert.equal(x, 1);
    });

    it('maintains lcoal state between calls', () => {
      let x = 0, y;
      const g = (function* () {
        while (true) {
          x++;
          if (x == 1) {
            y = 8;
          }
          yield;
        }
      })();
      assert.deepEqual(g.next(), {value: undefined, done: false});
      assert.equal(x, 1);
      assert.equal(y, 8);
      assert.deepEqual(g.next(), {value: undefined, done: false});
      assert.equal(x, 2);
      assert.equal(y, 8);
    });

    it('yields while valid loop', () => {
      let x = 0;
      const g = (function* () {
        while (x < 2) {
          x++;
          yield;
        }
      })();
      assert.deepEqual(g.next(), {value: undefined, done: false});
      assert.equal(x, 1);
      assert.deepEqual(g.next(), {value: undefined, done: false});
      assert.equal(x, 2);
      assert.deepEqual(g.next(), {value: undefined, done: true});
    });

    it('delegates to another generator', () => {
      function* gf(y = 0) {
        while (true) {
          x -= 10;
          x += y;
          yield;
        }
      }

      let x = 0;
      const g1 = (function* () {
        while (true) {
          x++;
          yield* gf();
          yield;
        }
      })();
      assert.deepEqual(g1.next(), {value: undefined, done: false});
      assert.equal(x, -9);

      x = 0;
      const g2 = (function* () {
        while (true) {
          x++;
          yield* gf(4);
          yield;
        }
      })();
      assert.deepEqual(g2.next(), {value: undefined, done: false});
      assert.equal(x, -5);
    });
  });

  describe('for...of over generators', () => {
    it('iterates over the generator', () => {
      let x = 0;
      const g = function* () {
        while (true) {
          x++;
          yield x;
        }
      };

      let tally = 0;
      for (let val of g()) {
        if (val > 5) {
          break;
        }
        tally += val;
      }
      assert.equal(tally, 1 + 2 + 3 + 4 + 5);
    });
  });
});

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-operations-on-iterator-objects
describe('iterators', () => {
  const arrayLikeIterables = [
    [1, 2, 3],
    'abc'
  ];
  const mapLikeIterables = [
    [1, 2, 3].keys(),
    [1, 2, 3].entries(),
    new Map([[1, 'one'], [2, 'two']]),
    new Set([1, 2, 2, 4])/*,
    document.body */
  ];
  const allIterables = arrayLikeIterables.concat(mapLikeIterables);

  describe('Symbol.iterator', () => {
    const s = Symbol.iterator;

    it.skip('is a symbol', () => {
      assert.equal(typeof s, 'symbol');
    });

    it('(allIterables) have a `Symbol.iterator` method', () => {
      allIterables.forEach((iterable) => {
        assert.equal(typeof iterable[Symbol.iterator](), 'object');
      });
      (function () {
        assert.equal(typeof arguments[Symbol.iterator](), 'object');
      })(1, 2, 3);
    });
  });

  describe('next()', () => {
    let iterator, next, count;

    it('works with for arrayLikeIterables', () => {
      arrayLikeIterables.forEach((iterable) => {
        iterator = iterable[Symbol.iterator]();
        count = 0;
        while ((next = iterator.next().value) != null) {
          assert(next, iterable[count++]);
          count++;
        }
      });
    });

    it('works with for mapLikeIterables', () => {
      mapLikeIterables.forEach((iterable) => {
        let toArray = [...iterable];
        iterator = iterable[Symbol.iterator]();
        count = 0;
        while ((next = iterator.next().value) != null) {
          assert(next, toArray[count++]);
          count++;
        }
      });
    });

    it('returns done when no more items', () => {
      allIterables.forEach((iterable) => {
        iterator = iterable[Symbol.iterator]();
        while (next = iterator.next(), next.value != null);
        assert.deepEqual(next, {value: undefined, done: true});
      });
    });
  });

  describe('for-of', () => {
    let count;
    it('works for arrayLikeIterables', () => {
      arrayLikeIterables.forEach((iterable) => {
        count = 0;
        for (let x of iterable) {
          assert.equal(x, iterable[count++]);
        }
      });
    });

    it('works for mapLikeIterables', () => {
      mapLikeIterables.forEach((iterable) => {
        let toArray = [...iterable];
        count = 0;
        for (let x of iterable) {
          if (typeof x == 'object') {
            assert.sameMembers(x, toArray[count++]);
          } else {
            assert.equal(x, toArray[count++]);
          }
        }
      });
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations
describe('let and const', () => {
  describe('scoping', () => {
    it('(they) are scoped once per block', () => {
      let a = 3;
      const b = 13;
      {
        let a = 4;
        const b = 9;
        assert.equal(a, 4);
        assert.equal(b, 9);
      }
      assert.equal(a, 3);
      assert.equal(b, 13);
    });

    it('(they) are not available in outer blocks', () => {
      {
        let a = 4;
        const b = 9;
        assert.equal(a, 4);
        assert.equal(b, 9);
      }
      assert.throws(() => a, Error);
      assert.throws(() => b, Error);
    });

    it('(they) are available in inner blocks', () => {
      let a = 3;
      const b = 13;
      {
        assert.equal(a, 3);
        assert.equal(b, 13);
      }
    });

    it.skip('(let) is not hoisted', () => {
      var fn = () => {
        a = 3;
        let a;
      }
      assert.throws(fn, Error);
    });
  });

  describe('const and immutability', () => {
    it('is mutable', () => {
      const x = {a: 4};
      x.a = 7;
      x.b = 9;
      assert.equal(x.a, 7);
      assert.equal(x.b, 9);
    });

    // it('is not reassignable', () => {
    //   const x = {a: 4};
    //   expect(() => {x = {a: 7}}).to.throw(Error);
    //   expect(() => {x = 'a cake'}).to.throw(Error);
    // });
  });
});

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-map-objects
describe('maps', () => {
  describe('types', () => {
    it('(Map) is a constructor', () => {
      assert.equal(typeof Map, 'function');
      assert.isDefined(Map.prototype);
    });

    it('(map instance) is an object', () => {
      assert.equal(typeof new Map(), 'object');
    });
  });

  describe('constructor parameter', () => {
    it('accepts null or nothing', () => {
      assert.isDefined(new Map(null));
      assert.isDefined(new Map());
    });

    it('accepts any key-value iterable', () => {
      const keyValueIterables = [
        [['a', 1], ['b', 2]],
        new Map([['a', 1], ['b', 2]]),
        new Set([['a', 1], ['b', 2]])
      ];
      keyValueIterables.forEach((iterable) => {
        assert.isDefined(new Map(iterable));
      });
    });

    it('accepts any types as keys or values', () => {
      const keyValueIterables = [
        [['a', 1], ['b', 2]],
        [[1, 'a'], [2, 'b']],
        [[{}, []], [{}, []]],
        [[[], {}], [[], {}]],
        [[true, 1], [false, 0]],
        [[new Map([['2', 5]]), Symbol(4)], [new Map([['7', 8]]), Symbol(2)]],
        [[Symbol(4), new Map([['2', 5]])], [Symbol(2), new Map([['7', 8]])]]
      ];
      keyValueIterables.forEach((iterable, c) => {
        const map = new Map(iterable);
        assert.isDefined(map);
        [0, 1].forEach((i) => {
          assert.equal(
            map.get(keyValueIterables[c][i][0]),
            keyValueIterables[c][i][1]
          );
        });
      });
    });
  });

  describe('`set` method', () => {
    it('can be updated using `set`', () => {
      const keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      const values = [1, 'a', false, Symbol(), new Date(), {}, []];
      const map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
      keys.forEach((key, i) => {
        assert.equal(map.get(keys[i]), values[i]);
      });
    });
  });

  describe('`has` method', () => {
    it('checks if key is present', () => {
      const keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      const values = [1, 'a', false, Symbol(), new Date(), {}, []];
      const map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
      keys.forEach((key, i) => {
        assert.isTrue(map.has(keys[i]));
      });
    });
  });

  describe('map.keys()', () => {
    let map, keys, values;
    beforeEach(() => {
      keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      values = [1, 'a', false, Symbol(), new Date(), {}, []];
      map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
    });

    it('defines `keys`', () => {
      assert.equal(typeof map.keys, 'function');
    });

    it('(`map.keys`) is an iterator', () => {
      const keysIt = map.keys();
      assert.isDefined(keysIt.next);
      keys.forEach((key) => {
        assert.equal(keysIt.next().value, key);
      });
    });
  });

  describe('map.values()', () => {
    let map, keys, values;
    beforeEach(() => {
      keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      values = [1, 'a', false, Symbol(), new Date(), {}, []];
      map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
    });

    it('defines `values`', () => {
      assert.equal(typeof map.values, 'function');
    });

    it('(`map.values`) is an iterator', () => {
      const valuesIt = map.values();
      assert.isDefined(valuesIt.next);
      values.forEach((value) => {
        assert.equal(valuesIt.next().value, value);
      });
    });
  });

  describe('map.entries()', () => {
    let map, keys, values;
    beforeEach(() => {
      keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      values = [1, 'a', false, Symbol(), new Date(), {}, []];
      map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
    });

    it('defines `entries`', () => {
      assert.equal(typeof map.entries, 'function');
    });

    it('(`map.entries`) is an iterator', () => {
      const entriesIt = map.entries();
      assert.isDefined(entriesIt.next);
      keys.forEach((key, i) => {
        assert.sameMembers(entriesIt.next().value, [key, values[i]]);
      });
    });
  });

  describe('map.forEach', () => {
    let map, keys, values;
    beforeEach(() => {
      keys = [{}, [], 1, 'a', false, Symbol(), new Date()];
      values = [1, 'a', false, Symbol(), new Date(), {}, []];
      map = new Map();
      keys.forEach((key, i) => {
        map.set(key, values[i]);
      });
    });

    it('defines `forEach`', () => {
      assert.equal(typeof map.forEach, 'function');
    });

    it('(`map.forEach`) loops through the entries', () => {
      let count = 0;
      map.forEach((value, key, mapp) => {
        assert.equal(value, values[count]);
        assert.equal(key, keys[count]);
        assert.equal(mapp, map);
        count++;
      });
    });
  });

  describe('map.size', () => {
    it('(`map.size`) returns the number of map entries', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      assert.equal(map.size, 2);
      map.set('c', 3);
      assert.equal(map.size, 3);
    });
  });

  describe('map.delete()', () => {
    it('defines `delete`', () => {
      assert.equal(typeof new Map().delete, 'function');
    });

    it('(`map.delete`) deletes the specified key', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      assert.equal(map.size, 2);
      assert.isTrue(map.has('a'));
      map.delete('a');
      assert.equal(map.size, 1);
      assert.isFalse(map.has('a'));
    });
  });

  describe('map.clear()', () => {
    it('defines `clear`', () => {
      assert.equal(typeof new Map().clear, 'function');
    });

    it('(`map.clear`) empties the map', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      assert.equal(map.size, 2);
      map.clear();
      assert.equal(map.size, 0);
    });
  });
});
describe('new number features', () => {
  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-additional-syntax-numeric-literals
  describe('base n literals', () => {
    it('supports binary literals', () => {
      assert.equal(0b10101, 21);
    });

    it('supports octal literals', () => {
      assert.equal(0o1234567, 342391);
    });
  });
  describe('new static functions', () => {
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite
    it('has Number.isFinite', () => {
      assert.equal(Number.isFinite(Number.Infinity), false);
      assert.equal(Number.isFinite(0), true);
      assert.equal(Number.isFinite('a'), false);
      assert.equal(Number.isFinite(77), true);
      // compare with global fn...
      assert.equal(isFinite('35'), true);
      assert.equal(Number.isFinite('35'), false);
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isnan
    it('has Number.isNaN', () => {
      assert.equal(Number.isNaN(12), false);
      assert.equal(Number.isNaN('x'), false);
      assert.equal(Number.isNaN(NaN), true);
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger
    it('has Number.isInteger', () => {
      // assert.isFalse(Number.isInteger(0.5));
      assert.isTrue(Number.isInteger(1));
      assert.isFalse(Number.isInteger('q'));
      assert.isFalse(Number.isInteger(NaN));
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.issafeinteger
    it('has Number.isSafeInteger', () => {
      const safe1 = Math.pow(2, 53) - 1;
      const unsafe1 = Math.pow(2, 53);
      const safe2 = 1 - Math.pow(2, 53);
      const unsafe2 = -Math.pow(2, 53);
      assert.isTrue(Number.isSafeInteger(safe1));
      assert.isFalse(Number.isSafeInteger(unsafe1));
      assert.isTrue(Number.isSafeInteger(safe2));
      assert.isFalse(Number.isSafeInteger(unsafe2));
      assert.isTrue(Number.isSafeInteger(7));
      assert.isFalse(Number.isSafeInteger(7.1));
      assert.isTrue(Number.isSafeInteger(0));
      assert.isFalse(Number.isSafeInteger(1 / 4));
    });
  });
  describe('new static values', () => {
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.epsilon
    it('defines Number.EPSILON', () => {
      // EPSILON is approx 2.2204460492503130808472633361816 x 10‍−‍16.
      assert.isDefined(Number.EPSILON);
      assert.isFalse((0.3 - (0.2 + 0.1)) === 0);
      assert.isTrue((0.3 - (0.2 + 0.1)) < Number.EPSILON);
      assert.isTrue((0.3 - (0.2 + 0.1)) > -Number.EPSILON);
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer
    it('defines Number.MAX_SAFE_INTEGER', () => {
      assert.isDefined(Number.MAX_SAFE_INTEGER);
      assert.equal(Number.MAX_SAFE_INTEGER, Math.pow(2, 53) - 1);
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.min_safe_integer
    it('defines Number.MIN_SAFE_INTEGER', () => {
      assert.isDefined(Number.MIN_SAFE_INTEGER);
      assert.equal(Number.MIN_SAFE_INTEGER, 1 - Math.pow(2, 53));
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects
describe('Promises', () => {
  function getPromise(success) {
    return new Promise((resolve, reject) => {
      setTimeout(
        success ? resolve('success') : reject('failure'),
        (Math.random() + 1) * 1000
      );
    });
  }

  describe('data types', () => {
    it('is a constructor', () => {
      assert.equal(typeof Promise, 'function');
      assert.equal(typeof Promise.prototype, 'object');
      assert.isTrue(new Promise((res, rej) => {}) instanceof Promise);
      assert.equal(typeof new Promise((res, rej) => {}), 'object');
    });

    it('requires a function argument', () => {
      assert.throws(() => new Promise(), Error);
      assert.doesNotThrow(() => new Promise((res, rej) => {}));
      assert.throws(() => new Promise({}), Error);
    });
  });

  describe('timing', () => {
    it('is async', (done) => {
      let buffer = [];
      new Promise(
        (resolve) => {
          resolve();
          buffer.push('hello');
        }
      ).then(() => {
        buffer.push('goodbye');
        assert.equal(buffer[0], 'hello');
        assert.equal(buffer[1], 'goodbye');
        done();
      });
      assert.equal(buffer[0], 'hello');
      assert.equal(buffer[1], undefined);
    });
  });

  describe('resolve and reject', () => {
    it('calls resolve on success', (done) => {
      getPromise(true).then((msg) => {
        assert.equal(msg, 'success');
        done();
      });
    });

    it('calls reject on failure', (done) => {
      getPromise(false).then(null, (msg) => {
        assert.equal(msg, 'failure');
        done();
      });
    });

    it('enters catch block on failure', (done) => {
      getPromise(false).then().catch(function (err) {
        assert.equal(err, 'failure');
        done();
      })
    });
  });

  describe('early fulfillment', () => {
    let succeeded, failed;

    beforeEach(() => {
      succeeded = false;
      failed = false;
    });

    function getPromise(success) {
      return new Promise((resolve, reject) => {
        success ? succeeded = true : failed = true;
        success ? resolve('success') : reject('failure');
      });
    }

    it('fulfills succesful promise before `then`', () => {
      getPromise(true);
      assert.isTrue(succeeded);
      assert.isFalse(failed);
    });

    it('rejects failed promise before `then`', () => {
      getPromise(false);
      assert.isFalse(succeeded);
      assert.isTrue(failed);
    });

    it('resolves succesful promise after it\'s been settled', (done) => {
      const p = getPromise(true);
      assert.isTrue(succeeded);
      p.then((msg) => {
        assert.equal(msg, 'success');
        done();
      });
    });

    it('rejects failed promise after it\'s been settled', (done) => {
      const p = getPromise(false);
      assert.isTrue(failed);
      p.then(null, (msg) => {
        assert.equal(msg, 'failure');
        done();
      });
    });

    it('enters catch block after failed promise has been settled', (done) => {
      const p = getPromise(false);
      assert.isTrue(failed);
      p.then().catch(function (err) {
        assert.equal(err, 'failure');
        done();
      })
    });
  });

  describe('chained `thens`', () => {
    it('(resolve) returns a thennable', () => {
      let countCall = 0;
      function resolve() {
        countCall++;
      }

      getPromise(true).then(resolve()).then(resolve()).then(resolve());
      assert.equal(countCall, 3);
    });
  });

  describe('Promise.all', () => {
    let r;
    Promise.all(['a', 'b', 'c']).then((arr) => {
      r = arr.map(t=>t + '1')
      assert.sameMembers(r, ['a1', 'b1', 'c1']);
    });
    assert.isUndefined(r);
  });

  describe('Promise.race', () => {
    const p1 = new Promise(function (resolve, reject) {
      setTimeout(() => resolve('p1 resolved'), 300);
    });
    const p2 = new Promise(function (resolve, reject) {
      setTimeout(() => resolve('p2 resolved'), 100);
    });
    Promise.race([p1, p2]).then(data => {
      assert.equal(data, 'p2 resolved');
    });
  });
});

describe('rest and spread', () => {
  describe('rest', () => {
    it('makes an array', () => {
      ((...args) => {
        assert.isTrue(Array.isArray(args));
      })(1, 2, 3);
    });

    it('includes all arguments', () => {
      ((...args) => {
        assert.sameMembers(args, ['one', 2, false]);
      })('one', 2, false);
      ((...args) => {
        assert.deepEqual(args[0], {a: {b:4}});
      })({a: {b:4}});
    });

    it('returns an empty array if no arguments', () => {
      ((...args) => {
        assert.sameMembers(args, []);
      })();
    });

    it('is only composed of the params not assigned to named args', () => {
      ((a, b, ...args) => {
        assert.sameMembers(args, [3, 4, 5]);
      })(1, 2, 3, 4, 5);
    });

    it('is empty if all param are assigned to named args', () => {
      ((a, b, ...args) => {
        assert.sameMembers(args, []);
      })(1, 2);
    });

    // it('must fall after named args', () => {
    //   assert.throws((a, b, ...args, c) => {}, Error);
    // });

//    it('can destructure', () => {
//      ((a, b, ...[c, d]) => {
//        assert.equal(c, 3);
//        assert.equal(d, 4);
//      })(1, 2, 3, 4);
//      ((a, b, ...[c, d]) => {
//        assert.equal(c, 3);
//        assert.isUndefined(d);
//      })(1, 2, 3);
//      ((a, b, ...[c, d]) => {
//        assert.equal(c, 3);
//        assert.equal(d, 4);
//      })(1, 2, 3, 4, 5, 6);
//    });

    it('can be used to destructure within an array', () => {
      ((a, b, ...c) => {
        assert.sameMembers(c, [3, 4]);
      })(1, 2, 3, 4);
    });
  });

  describe('spread', () => {
    // it('cannot exist standalone', () => {
    //   expect((a)=>{...a}).toThrow(Error);
    // });

    it('creates as many items as array had members', () => {
      assert.equal([...[1, 2, 3]].length, 3);
    });

    it('generates same items as array', () => {
      assert.sameMembers([...[1, 2, 3]], [1, 2, 3]);
    });

    it('generates no members from an empty array', () => {
      assert.equal([...[]].length, 0);
      assert.sameMembers([...[]], []);
    });

    it('need not come last in an array', () => {
      assert.equal([1, ...[2, 3, 4], 5].length, 5);
      assert.sameMembers([1, ...[2, 3, 4], 5], [1, 2, 3, 4, 5]);
    });

    it('can be used to make arguments', () => {
      let arr = [1, 2, 3];
      arr.push(...[4, 5, 6]);
      assert.sameMembers(arr, [1, 2, 3, 4, 5, 6]);
    });

    it('can be used to spread iterables', () => {
    });
  });
});

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-set-objects
describe('sets', () => {
  describe('types', () => {
    it('(Set) is a constructor', () => {
      assert.equal(typeof Set, 'function');
      assert.isDefined(Set.prototype);
    });

    it('(set instance) is an object', () => {
      assert.equal(typeof new Set(), 'object');
    });
  });
  describe('constructor parameter', () => {
    it('accepts null or nothing', () => {
      assert.isDefined(new Set(null));
      assert.isDefined(new Set());
    });

    it('accepts any iterable', () => {
      const iterables = [
        [1, 3, 4, 3, 6],
        'abcdeffghijklmnopqrtuvwxyz',
        new Map([['a', 1], ['b', 2], ['a', 1], ['c', 5]]),
        new Set([1, 3, 4, 3, 6]),
        [1, 2, 3].keys(),
        [1, 2, 3].entries()
      ];
      iterables.forEach((iterable) => {
        assert.isDefined(new Set(iterable));
      });
    });

    it('accepts any value types', () => {
      const iterables = [
        [1, 2, 3, 4, 8, 8],
        ['a', 1, 'b', 2, 'b'],
        [{}, [], {}, [], [], [], {}],
        [true, 1, false, false, 0],
        [Symbol(4), Symbol(4), Symbol()]
      ];
      iterables.forEach((iterable) => {
        const set = new Set(iterable);
        assert.isDefined(set);
        iterable.forEach((value) => {
          assert.isTrue(set.has(value));
        });
      });
    });
  });

  describe('set.add', () => {
    it('is a method', () => {
      const set = new Set();
      assert.isDefined(set.add);
      assert.equal(typeof set.add, 'function');
    });

    it('adds values to a set', () => {
      const set = new Set();
      const values = [1, 5, 5, 5, 4, 3, 2, 6, 4, 3, 6, 3, 3];
      values.forEach(value => {
        set.add(value);
      });
      values.forEach(value => {
        assert.isTrue(set.has(value));
      });
      assert.equal(set.size, 6);
    });
  });

  describe('`size` and de-duping', () => {
    it('defines `size`', () => {
      const set = new Set([1, 3, 2, 2]);
      assert.isDefined(set.size);
      assert.equal(typeof set.size, 'number');
    });

    it('removes duplicate values', () => {
      const obj = {}, arr = [];
      const sym1 = Symbol(), sym2 = Symbol();
      const iterables = [
        {
          value: [1, 2, 3, 4, 8, 8],
          unique: 5
        },
        {
          value: 'abcdeffghijklmnopqrstuvwxyz',
          unique: 26
        },
        {
          value: [obj, arr, arr, arr, obj],
          unique: 2
        },
        {
          value: [true, 1, false, false, 0],
          unique: 4
        },
        {
          value: [sym1, sym1, sym2],
          unique: 2
        }
      ];
      iterables.forEach((iterable) => {
        const set = new Set(iterable.value);
        assert.equal(set.size, iterable.unique);
      });
    });
  });

  describe('forEach', () => {
    const set = new Set([1, 3, 2, 2]);
    const asArray = [...set];
    let count = 0;

    it('is a valid function', () => {
      assert.isDefined(set.forEach);
      assert.equal(typeof set.forEach, 'function');
    });

    it('loops over each member', () => {
      set.forEach((value1, value2, theSet) => {
        assert.equal(value1, asArray[count]);
        assert.equal(value2, asArray[count]);
        assert.equal(value1, value2);
        assert.equal(theSet, set);
        count++;
      });
    });
  });
  describe('keys, values and entries', () => {
    const set = new Set([1, 3, 2, 2]);
    const asArray = [...set];

    it('(they) are valid functions', () => {
      assert.isDefined(set.keys);
      assert.isDefined(set.values);
      assert.isDefined(set.entries);
      assert.equal(typeof set.keys, 'function');
      assert.equal(typeof set.values, 'function');
      assert.equal(typeof set.entries, 'function');
    });

    it('(keys and values) both iterate over the members', () => {
      const keysIt = set.keys();
      const valuesIt = set.values();
      let next, count = 0;
      assert.isDefined(keysIt.next);
      assert.isDefined(valuesIt.next);
      while (next = keysIt.next(), !next.done) {
        assert.equal(next.value, asArray[count++]);
      }
    });

    it('(entires) is a matching key-value pair', () => {
      const entriesIt = set.entries();
      let next, count = 0;
      assert.isDefined(entriesIt.next);
      while (next = entriesIt.next(), !next.done) {
        let member = asArray[count++];
        assert.sameMembers(next.value, [member, member]);
      }
    });
  });
  describe('set.delete()', () => {
    it('defines `delete`', () => {
      assert.equal(typeof new Set().delete, 'function');
    });

    it('(`set.delete`) deletes the specified key', () => {
      const set = new Set([1, 5, 5, 6, 8]);
      assert.equal(set.size, 4);
      assert.isTrue(set.has(5));
      set.delete(5);
      assert.equal(set.size, 3);
      assert.isFalse(set.has(5));
    });
  });
  describe('set.clear()', () => {
    it('defines `clear`', () => {
      assert.equal(typeof new Set().clear, 'function');
    });

    it('(`set.clear`) empties the set', () => {
      const set = new Set([1, 5, 5, 6, 8]);
      assert.equal(set.size, 4);
      set.clear();
      assert.equal(set.size, 0);
    });
  });
});
describe('new string features', () => {
  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-source-text
  describe('new unicode features', () => {
    it('supports new escape syntax', () => {
      // surrogate pair and real unicode for a fish
      assert.equal('\uD83D\uDC20', '\u{1F420}');
    });

    xit('supports codePointAt', () => {
      assert.equal('abc'.codePointAt(1).toString(16), '62');
      assert.equal('\uD83D\uDC20'.codePointAt(0).toString(16), '1f420');
    });
  });

  describe('new introspect features', () => {
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype.startswith
    it('supports startsWith', () => {
      assert.isTrue('panda'.startsWith('p'));
      assert.isTrue('panda'.startsWith('panda'));
      assert.isFalse('panda'.startsWith('pandas'));
      assert.isFalse('panda'.startsWith('q'));
      assert.isTrue('\uD83D\uDC20'.startsWith('\u{1F420}'));
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype.endswith
    it('supports endsWith', () => {
      assert.isTrue('panda'.endsWith('a'));
      assert.isTrue('panda'.endsWith('panda'));
      assert.isFalse('panda'.endsWith('pandas'));
      assert.isFalse('panda'.endsWith('q'));
      assert.isTrue('\uD83D\uDC20'.endsWith('\u{1F420}'));
    });

    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype.includes
    it.skip('supports includes', () => {
      assert.isTrue('panda'.includes('p'));
      assert.isTrue('panda'.includes('n'));
      assert.isTrue('panda'.includes('a'));
      assert.isTrue('panda'.includes('panda'));
      assert.isFalse('panda'.includes('pandas'));
      assert.isFalse('panda'.includes('q'));
      assert.isTrue('\uD83D\uDC20'.includes('\u{1F420}'));
    });
  });

  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-string.prototype.repeat
  describe('repeat', () => {
    it('supports repeat', () => {
      assert.equal('panda'.repeat(3), 'pandapandapanda');
      assert.equal('\uD83D\uDC20'.repeat(2), '\u{1F420}\u{1F420}');
    });
  });
});// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-symbol-objects
describe('Symbols', () => {
  describe('data type', () => {
    it('has typeof \'symbol\''), () => {
      assert.equal(typeof Symbol('x'), 'symbol');
    }

    it.skip('has an arity of 1', () => {
      assert.equal(Symbol.length, 1);
    });

    it('does not allow `new` with the constructor', () => {
      assert.throws(() => {new Symbol()}, Error);
    });
  });

  describe('uniqueness', () => {
    it('is unique without description', () => {
      assert.isTrue(Symbol() !== Symbol());
      assert.isTrue(Symbol() != Symbol());
    });

    it('is unique with same description', () => {
      assert.isTrue(Symbol('x') !== Symbol('x'));
      assert.isTrue(Symbol('x') != Symbol('x'));
    });
  });

  describe('description property', () => {
    it('is added to the GlobalSymbolRegistry', () => {
      var s = Symbol.for('x');
      assert.equal(Symbol.keyFor(s), 'x');
    });
  });

  describe('as object key', () => {
    it('can be used as an object key', () => {
      let a = Symbol('a')
      let obj = {
        a: 3
      };
      obj[a] = 4;
      assert.equal(obj.a, 3);
      assert.equal(obj[a], 4);
    });

    it('can be used as an object literal key', () => {
      let a = Symbol('a')
      let obj = {
        a: 3,
        [a]: 4
      };
      assert.equal(obj.a, 3);
      assert.equal(obj[a], 4);
    });

    it('is an ownPropertySymbol', () => {
      let a = Symbol('a')
      let obj = {
        a: 3,
        [a]: 4
      };
      assert.include(Object.getOwnPropertySymbols(obj), a);
      assert.notInclude(Object.keys(obj), a);
      assert.notInclude(Object.getOwnPropertyNames(obj), a);
    });
  });

  describe('other qualities', () => {
    it('is iterable', () => {
    });

    it('is matchable', () => {
    });

    it('is replaceable', () => {
    });
  });

  describe('well known symbols', () => {
  });
});

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-static-semantics-tv-s-and-trv-s
describe('template strings', () => {
  describe('basic strings', () => {
    it('generates a string', () => {
      assert.equal(typeof `hello`, 'string');
      assert.equal(`hello`, 'hello');
    });

    it('can be multiline', () => {
      assert.equal(typeof `hello
how are you`, 'string');
      assert.equal(`hello
how are you`, 'hello\n' +
      'how are you');
    });
  });
  describe('interpolation', () => {
    it('can insert primitive variables', () => {
      const a = 3;
      const b = 'fifty';
      const c = true;
      assert.equal(`the ${c} price is ${a} dollars and ${b} cents`,
       'the true price is 3 dollars and fifty cents');
    });

    it('can insert object variables', () => {
      const a = {toString: () => 'an object'};
      const b = [1, 2, 3];
      b.toString = () => 'an array'
      assert.equal(`${a} and ${b}`,
       'an object and an array');
    });

    it('can insert expressions', () => {
      assert.equal(`${2**2} and ${((a, b)=>3 + a/b)(6, 2)}`,
       '4 and 6');
    });
  });
  describe('tag functions', () => {
    const a = 3;
    const b = {x: 4, y: a};

    it('(its) first arg is an array of the strings literals ', () => {
      assert.isTrue(Array.isArray(((strs)=>strs)`hello`));
      assert.equal(((strs)=>strs.length)`hello`, 1);
      assert.equal(((strs)=>strs[0])`hello`, 'hello');
      assert.equal(((strs)=>strs.length)`hello ${a}`, 2);
      assert.equal(((strs)=>strs[0])`hello ${a}`, 'hello ');
      assert.equal(((strs)=>strs[1])`hello ${a}`, '');
      assert.equal(((strs)=>strs.length)`hello ${a} goodbye`, 2);
      assert.equal(((strs)=>strs[0])`hello ${a} goodbye`, 'hello ');
      assert.equal(((strs)=>strs[1])`hello ${a} goodbye`, ' goodbye');
    });

    it('(its) first arg has a `raw` property', () => {
      assert.isTrue(Array.isArray(((strs)=>strs.raw)`hello`));
      assert.equal(((strs)=>strs.raw.length)`hello`, 1);
      assert.equal(((strs)=>strs.raw[0])`hello`, `hello`);
      assert.equal(((strs)=>strs.raw.length)`hello ${a}`, 2);
      assert.equal(((strs)=>strs.raw[0])`hello ${a}`, 'hello ');
      assert.equal(((strs)=>strs.raw[1])`hello ${a}`, '');
      assert.equal(((strs)=>strs.raw.length)`hel
lo`, 1);
      assert.equal(((strs)=>strs.raw[0])`hel
lo`, 'hel\nlo');
    });

    it('(its) remaining args are the interpolated values ', () => {
      assert.equal(((strs, ...values)=>values.length)`hello`, 0);
      assert.equal(((strs, ...values)=>values.length)`hello ${a}`, 1);
      assert.equal(((strs, ...values)=>values[0])`hello ${a}`, 3);
      assert.equal(((strs, ...values)=>values.length)`hello ${a} goodbye ${b}`, 2);
      assert.equal(((strs, ...values)=>values[0])`hello ${a} goodbye ${b}`, 3);
      assert.deepEqual(((strs, ...values)=>values[1])`hello ${a} goodbye ${b}`, {x: 4, y: a});
    });
  });
});
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-weakmap-objects
describe('weak maps', () => {
  describe('types', () => {
    it('(WeakMap) is a constructor', () => {
      assert.equal(typeof WeakMap, 'function');
      assert.isDefined(WeakMap.prototype);
    });

    it('(weak map instance) is an object', () => {
      assert.equal(typeof new WeakMap(), 'object');
    });
  });
  describe('constructor parameter', () => {
    it('accepts null or nothing', () => {
      assert.isDefined(new WeakMap(null));
      assert.isDefined(new WeakMap());
    });

    it('accepts any key-value iterable', () => {
      const keyValueIterables = [
        [[{}, 1], [[], 2]],
        new Map([[{}, 1], [[], 2]]),
        new Set([[{}, 1], [[], 2]])
      ];
      keyValueIterables.forEach((iterable) => {
        assert.isDefined(new WeakMap(iterable));
      });
    });

    it('accepts any type of values', () => {
      const keyValueIterables = [
        [[{}, 1], [[], 2]],
        [[{}, 'a'], [[], 'b']],
        [[{}, []], [[], []]],
        [[{}, {}], [[], {}]],
        [[{}, 1], [[], 0]],
        [[{}, Symbol(4)], [[], Symbol(2)]],
        [[{}, new Map([['2', 5]])], [[], new Map([['7', 8]])]]
      ];
      keyValueIterables.forEach((iterable, c) => {
        const weakMap = new WeakMap(iterable);
        assert.isDefined(weakMap);
        [0, 1].forEach((i) => {
          assert.equal(
            weakMap.get(keyValueIterables[c][i][0]),
            keyValueIterables[c][i][1]
          );
        });
      });
    });

    it('accepts any type of object as key', () => {
      const keyValueIterables = [
        [[{}, 1], [new Date(), 1]],
        [[[], 1], [{}, 1]],
        [[()=>{}, 1], [[], 1]],
        [[new Map(), 1], [()=>{}, 1]],
        [[new Set(), 1], [new Map(), 1]],
        [[new WeakMap(), 1], [new Set(), 1]],
        [[new Date(), 1], [new WeakMap(), 1]]
      ];

      keyValueIterables.forEach((iterable, c) => {
        const weakMap = new WeakMap(iterable);
        assert.isDefined(weakMap);
        [0, 1].forEach((i) => {
          assert.equal(
            weakMap.get(keyValueIterables[c][i][0]),
            keyValueIterables[c][i][1]
          );
        });
      });
    });

    it('does not accept primitives as keys', () => {
      const keyValueIterables = [
        [[1, 1], [2, 1]],
        [['a', 1], ['b', 1]],
        [[true, 1], [false, 1]],
      ];

      keyValueIterables.forEach((iterable, c) => {
        assert.throws(()=>{const weakMap = new WeakMap(iterable)}, Error);
      });
    });
  });

  describe('`set` method', () => {
    it('can be updated using `set`', () => {
      const keys = [{}, [], ()=>{}, new Map(), new Set(), new WeakMap(), new Date()];
      const values = [1, 'a', false, Symbol(), new Date(), {}, []];
      const weakMap = new WeakMap();
      keys.forEach((key, i) => {
        weakMap.set(key, values[i]);
      });
      keys.forEach((key, i) => {
        assert.equal(weakMap.get(keys[i]), values[i]);
      });
    });
  });

  describe('`has` method', () => {
    it('checks if key is present', () => {
      const keys = [{}, [], ()=>{}, new Map(), new Set(), new WeakMap(), new Date()];
      const values = [1, 'a', false, Symbol(), new Date(), {}, []];
      const weakMap = new WeakMap();
      keys.forEach((key, i) => {
        weakMap.set(key, values[i]);
      });
      keys.forEach((key, i) => {
        assert.isTrue(weakMap.has(keys[i]));
      });
    });
  });

  describe('weakMap.delete()', () => {
    it('defines `delete`', () => {
      assert.equal(typeof new WeakMap().delete, 'function');
    });

    it('(`weakMap.delete`) deletes the specified key', () => {
      const key1 = {};
      const key2 = {};
      const weakMap = new WeakMap([[key1, 1], [key2, 2]]);
      assert.isTrue(weakMap.has(key1));
      weakMap.delete(key1);
      assert.isFalse(weakMap.has(key1));
    });
  });

  describe('transient keys', () => {
    it('(its) keys are GCed when they have no other refs', () => {
      // untestable
    });
  });
});// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-weakset-objects
describe('weak sets', () => {
  describe('types', () => {
    it('(WeakSet) is a constructor', () => {
      assert.equal(typeof WeakSet, 'function');
      assert.isDefined(WeakSet.prototype);
    });

    it('(weak set instance) is an object', () => {
      assert.equal(typeof new WeakSet(), 'object');
    });
  });

  describe('constructor parameter', () => {
    it('accepts null or nothing', () => {
      assert.isDefined(new WeakSet(null));
      assert.isDefined(new WeakSet());
    });

    it('accepts any non-primitive iterable type', () => {
      const iterables = [
        [[], {}, () => {}],
        new Set([[], {}, () => {}]),
        [[], {}, () => {}].entries()
      ];

      iterables.forEach((iterable) => {
        assert.isDefined(new WeakSet(iterable));
      });
    });

    it('accepts any non-primitive value types', () => {
      const iterables = [
        [[], {}, () => {}],
        [new Map(), new Set(), new WeakMap(), new WeakSet()]
      ];

      iterables.forEach((iterable) => {
        const set = new WeakSet(iterable);
        assert.isDefined(set);
        iterable.forEach((value) => {
          assert.isTrue(set.has(value));
        });
      });
    });

    it('does not accept primitive value types', () => {
      assert.throws(
        () => { new WeakSet([1, false, 'a'])},
        Error
      );
    });
  });

  describe('weakset.add', () => {
    it('is a method', () => {
      const weakset = new WeakSet();
      assert.isDefined(weakset.add);
      assert.equal(typeof weakset.add, 'function');
    });

    it('adds values to a weakset', () => {
      const weakset = new WeakSet();
      const values = [{}, [], () => {}, [], {}];
      values.forEach(value => {
        weakset.add(value);
      });
      values.forEach(value => {
        assert.isTrue(weakset.has(value));
      });
    });
  });

  describe('weakset.delete()', () => {
    it('defines `delete`', () => {
      assert.equal(typeof new WeakSet().delete, 'function');
    });

    it('(`weakset.delete`) deletes the specified key', () => {
      const obj = {}, arr = [], fn = () => {};
      const values = [obj, arr, fn];
      const weakset = new WeakSet(values);
      assert.isTrue(weakset.has(obj));
      weakset.delete(obj);
      assert.isFalse(weakset.has(obj));
    });
  });

  describe('de-duping', () => {
    it('removes duplicate values', () => {
      const obj = {}, arr = [], fn = () => {};
      const values = [obj, obj, arr, fn, obj, fn];
      const weakset = new WeakSet(values);
      // only test is deletion since we can't iterate weak collection values
      weakset.delete(fn);
      assert.isFalse(weakset.has(fn));
    });
  });

  describe('transient keys', () => {
    it('(its) keys are GCed when they have no other refs', () => {
      // untestable
    });
  });
});
