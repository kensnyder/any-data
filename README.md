# any-data

[![NPM Link](https://img.shields.io/npm/v/any-data?v=1.0.1)](https://npmjs.com/package/any-data)
[![Build Status](https://github.com/github/docs/actions/workflows/workflow.yml/badge.svg)](https://github.com/kensnyder/any-data/actions)
[![Code Coverage](https://codecov.io/gh/kensnyder/any-data/branch/main/graph/badge.svg?v=1.0.1)](https://codecov.io/gh/kensnyder/any-data)
[![Gzipped Size](https://badgen.net/bundlephobia/minzip/any-data/?label=minzipped+size&v=1.0.1)](https://bundlephobia.com/package/any-data@1.0.1)
[![Dependency details](https://badgen.net/bundlephobia/dependency-count/any-data?v=1.0.1)](https://www.npmjs.com/package/any-data?activeTab=dependencies)
[![Tree shakeable](https://badgen.net/bundlephobia/tree-shaking/any-data?v=1.0.1)](https://www.npmjs.com/package/any-data)
[![ISC License](https://img.shields.io/npm/l/any-data.svg?v=1.0.1)](https://opensource.org/licenses/ISC)

Convert data of any type to text, json, formData, TypedArray, Blob, or
ArrayBuffer

```bash
npm install any-data
```

## Motivation

I needed a tool for dealing with the wide variety of data types that can be
passed to `new Response()`. So `AnyData` allows lazy data conversion for response
bodies to simplify http server middleware such as calculating etags and Brotli
compression.

Note that `AnyData` does not support `ReadableStream` even though `Response`
does.

## Table of contents

1. [Example usage](#example-usage)
1. [API](#api)
1. [Supported data types](#supported-data-types)
1. Changes
   1. [Changelog](https://github.com/kensnyder/any-data/blob/master/CHANGELOG.md)
   1. [Roadmap](https://github.com/kensnyder/any-data/blob/master/ROADMAP.md)
1. [Community](#community)
   1. [Contributing](#contributing)
   1. [ISC license](#isc-license)

## Example usage

```ts
new AnyData('hello world').bytes(); // UTF-8 encoded in Uint8Array
new AnyData(myArrayBuffer).bytes(); // Array buffer as Uint8Array
new AnyData(myBlob).arrayBuffer(); // Blob as ArrayBuffer
```

## API

```ts
const hello = new AnyData('hello world');

// getting data
await hello.text(); // get data as text
await hello.json(); // get data as an object; will throw if data isn't valid JSON
await hello.arrayBuffer(); // get data as ArrayBuffer
await hello.blob(); // get data as Blob
await hello.bytes(); // get data as Uint8Array
await hello.formData(); // get data as FormData object

// setting data to something new
hello.set('foo bar');

// utility methods
hello.clone(); // returns a new AnyData object with a DEEP clone of the underlying data
hello.isEmpty(); // true if data is empty
hello.isSupported(); // true if data type is supported
hello.getDataCategory(); // Either bytes, text, or unknown
```

## Supported data types

| data type / method  | text() | json()        | formData()    | bytes() | blob()  | arrayBuffer() | clone()   |
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
| FormData **†**      | Yes    | Error         | itself        | Yes     | Yes     | Yes           | deep copy |
| ReadableStream      | Yes    | If valid JSON | If valid JSON | Yes     | Yes     | Yes           | deep copy |
| URLSearchParams     | URL    | entries       | Yes           | URL     | URL     | URL           | deep copy |

**†** Note: all FormData is serialized to text with multi-part form boundary
markers

## Community

### Contributing

Please open a ticket or PR on GitHub. All contributions are subject to the
[Code of Conduct](./CONTRIBUTING.md).

### ISC License

[ISC License](./LICENSE)
