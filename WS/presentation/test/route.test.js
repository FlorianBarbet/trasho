const route = require("../route.js");

test('init should be success in all case', () => {
  expect(route.init("ABCD")).toBe(0);
});

/**
Use this documentation to find the good way to test :

https://jestjs.io/docs/en/using-matchers

your file test had to be writing like [classToTest].test.js

*/
