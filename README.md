# any-data

[![NPM Link](https://img.shields.io/npm/v/any-data?v=1.0.0)](https://npmjs.com/package/any-data)
[![Dependencies](https://badgen.net/static/dependencies/0/green?v=1.0.0)](https://www.npmjs.com/package/any-data?activeTab=dependencies)
[![Build Status](https://ci.appveyor.com/api/any-datas/status/***?svg=true&v=1.0.2)](https://ci.appveyor.com/any-data/kensnyder/any-data)
[![Code Coverage](https://codecov.io/gh/kensnyder/any-data/branch/main/graph/badge.svg?token=***&v=1.0.2)](https://codecov.io/gh/kensnyder/any-data)
[![ISC License](https://img.shields.io/npm/l/any-data.svg?v=1.0.2)](https://opensource.org/licenses/ISC)

Convert data of any type to text, json, formData, TypedArray, Blob, or ArrayBuffer

```bash
npm install any-data
```

## Table of contents

1. [Features](#features)
   1. [Changelog](https://github.com/kensnyder/any-data/blob/master/CHANGELOG.md)
   1. [Roadmap](https://github.com/kensnyder/any-data/blob/master/ROADMAP.md)
2. [Example usage](#example-usage)
   1. [](#)
   1. [](#)
   1. [](#)
3. [API](#action-functions)
   1. [](#)
   1. [](#)
   1. [](#)
4. [Supported data types](#supported-data-types)
5. [Community](#community)
   1. [Contributing](#contributing)
   2. [ISC license](#isc-license)

## Example usage

## API

## Supported data types

| type / method       | text() | json()        | formData()    | bytes() | blob()  | arrayBuffer() | clone()   |
| ------------------- | ------ | ------------- | ------------- | ------- | ------- | ------------- | --------- |
| null                | `""`   | `undefined`   | (empty)       | (empty) | (empty) | (empty)       | null      |
| string              | itself | If valid JSON | If valid      | Yes     | Yes     | Yes           | itself    |
| Record<string, any> | JSON   | itself        | Yes           | JSON    | JSON    | JSON          | deep copy |
| Array<any>          | JSON   | itself        | as entries    | JSON    | JSON    | JSON          | deep copy |
| Response            | text() | json()        | formData()    | bytes() | blob()  | arrayBuffer() | clone()   |
| Blob                | Yes    | If valid JSON | If valid JSON | Yes     | itself  | Yes           | deep copy |
| ArrayBuffer         | Yes    | If valid JSON | If valid JSON | Yes     | Yes     | Yes           | deep copy |
| TypedArray          | Yes    | If valid JSON | If valid JSON | Yes     | Yes     | Yes           | deep copy |
| DataView            | Yes    | If valid JSON | If valid JSON | Yes     | Yes     | Yes           | deep copy |
| FormData            | Yes\*  | Error         | itself        | Yes     | Yes     | Yes           | deep copy |
| ReadableStream      | Yes    | If valid JSON | If valid JSON | Yes     | Yes     | Yes           | deep copy |
| URLSearchParams     | URL    | entries       | Yes           | URL     | URL     | URL           | deep copy |

\* Note: all FormData is serialized to text with multi-part form boundary markers

## Community
