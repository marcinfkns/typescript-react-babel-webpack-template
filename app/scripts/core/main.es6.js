import Foo from "./foo";
import Foo2 from "./foo2";
import Hello from "./Hello";
import HelloWorld from "./HelloWorld";

console.log(Foo.bar());
document.body.innerHTML += `<div><u>ES6 Foo says</u>: ${Foo.bar()}</div>`

console.log(Foo2.bar());
document.body.innerHTML += `<div><u>TypeScript Foo2 says</u>: ${Foo2.bar()}</div>`
