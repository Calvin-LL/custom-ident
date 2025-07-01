# custom-ident

[![NPM Version](https://img.shields.io/npm/v/custom-ident.svg?style=flat)](https://www.npmjs.com/package/custom-ident)
[![NPM License](https://img.shields.io/npm/l/custom-ident.svg?style=flat)](https://github.com/Calvin-LL/custom-ident/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/custom-ident.svg?style=flat)](https://www.npmjs.com/package/custom-ident)

Generate css [`<custom-ident>`](https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)s

## Install

```bash
npm install custom-ident
```

## Usage

### Basic

```js
import { customIdent } from "custom-ident";

const ident = customIdent(["foo", "bar", "baz@"]);
console.log(ident); // 'foo_bar_baz\\40'
```

### Non-string values

```js
import { customIdent } from "custom-ident";

const ident = customIdent([
  undefined,
  null,
  true,
  false,
  3,
  { test: "hi", oof: 0 },
]);
console.log(ident); // 'undefined_null_true_false_3_test'
```
