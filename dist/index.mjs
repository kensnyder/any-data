// node_modules/is-plain-object/dist/is-plain-object.mjs
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
  var ctor, prot;
  if (isObject(o) === false) return false;
  ctor = o.constructor;
  if (ctor === void 0) return true;
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (prot.hasOwnProperty("isPrototypeOf") === false) {
    return false;
  }
  return true;
}

// src/AnyData.ts
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var AnyData = class _AnyData {
  data;
  constructor(data) {
    this.data = data;
  }
  set(data) {
    this.data = data;
  }
  isSupported() {
    return this.data === null || this.data instanceof Blob || this.data instanceof ArrayBuffer || isTypedArray(this.data) || this.data instanceof DataView || this.data instanceof FormData || this.data instanceof URLSearchParams || typeof this.data === "string" || isPlainObject(this.data) || Array.isArray(this.data);
  }
  getDataCategory() {
    if (this.data instanceof Blob || this.data instanceof ArrayBuffer || isTypedArray(this.data) || this.data instanceof DataView) {
      return "bytes";
    }
    if (this.data === null || typeof this.data === "string" || this.data instanceof FormData || this.data instanceof URLSearchParams || isPlainObject(this.data) || Array.isArray(this.data)) {
      return "text";
    }
    return "unknown";
  }
  isEmpty() {
    return this.data === null || this.data === "" || isTypedArray(this.data) && this.data.length === 0 || this.data instanceof ArrayBuffer && this.data.byteLength === 0 || this.data instanceof DataView && this.data.byteLength === 0 || this.data instanceof Blob && this.data.size === 0 || this.data instanceof URLSearchParams && this.data.size === 0 || this.data instanceof FormData && Array.from(this.data.keys()).length === 0;
  }
  async clone() {
    if (this.data instanceof Response) {
      return new _AnyData(this.data.clone());
    }
    if (this.data === null || typeof this.data === "string") {
      return new _AnyData(this.data);
    }
    if (this.data instanceof FormData) {
      const formData = new FormData();
      for (const [k, v] of this.data) {
        formData.append(k, v);
      }
      return new _AnyData(formData);
    }
    if (this.data instanceof URLSearchParams) {
      const params = new URLSearchParams();
      for (const [k, v] of this.data) {
        params.append(k, v);
      }
      return new _AnyData(params);
    }
    return new _AnyData(structuredClone(this.data));
  }
  async blob() {
    if (this.data instanceof Response) {
      const blob = await this.data.blob();
      this.data = blob;
      return blob;
    }
    if (this.data === null) {
      return new Blob();
    }
    if (this.data instanceof Blob) {
      return this.data;
    }
    if (typeof this.data === "string") {
      return new Blob([Buffer.from(this.data, "utf8")]);
    }
    if (this.data instanceof ArrayBuffer || this.data instanceof DataView || isTypedArray(this.data)) {
      return new Blob([this.data]);
    }
    if (this.data instanceof FormData) {
      return new Blob([JSON.stringify(await this.json())]);
    }
    if (this.data instanceof URLSearchParams) {
      return new Blob([await this.text()]);
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return new Blob([JSON.stringify(this.data)]);
    }
    throw new Error("Unable to convert unsupported data type to Blob");
  }
  async arrayBuffer() {
    if (this.data instanceof Response) {
      const buffer = await this.data.arrayBuffer();
      this.data = buffer;
      return buffer;
    }
    if (this.data === null) {
      return new ArrayBuffer(0);
    }
    if (this.data instanceof Blob) {
      return this.data.arrayBuffer();
    }
    if (this.data instanceof ArrayBuffer) {
      return this.data;
    }
    if (typeof this.data === "string") {
      return textEncoder.encode(this.data).buffer;
    }
    if (isTypedArray(this.data) || this.data instanceof DataView) {
      return this.data.buffer;
    }
    if (this.data instanceof FormData || this.data instanceof URLSearchParams) {
      return (await this.blob()).arrayBuffer();
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return textEncoder.encode(JSON.stringify(this.data)).buffer;
    }
    throw new Error("Unable to convert unsupported data type to ArrayBuffer");
  }
  async bytes() {
    if (this.data instanceof Response) {
      if (typeof this.data.bytes === "function") {
        const arr = await this.data.bytes();
        this.data = arr;
        return arr;
      }
      const array = new Uint8Array(await this.data.arrayBuffer());
      this.data = array;
      return array;
    }
    if (this.data === null) {
      return new Uint8Array();
    }
    if (this.data instanceof URLSearchParams) {
      return textEncoder.encode(String(this.data));
    }
    if (typeof this.data === "string") {
      return textEncoder.encode(this.data);
    }
    if (this.data instanceof FormData) {
      return textEncoder.encode(await this.text());
    }
    if (this.data instanceof ArrayBuffer) {
      return new Uint8Array(this.data);
    }
    if (this.data instanceof DataView) {
      return new _AnyData(new Blob([this.data])).bytes();
    }
    if (isTypedArray(this.data)) {
      return this.data;
    }
    if (this.data instanceof Blob) {
      if (typeof this.data.bytes === "function") {
        return this.data.bytes();
      }
      return new Uint8Array(await this.arrayBuffer());
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return textEncoder.encode(JSON.stringify(this.data));
    }
    throw new Error("Unable to convert unsupported data type to a Uint8Array");
  }
  async formData() {
    if (this.data === null) {
      return new FormData();
    }
    if (this.data instanceof Response) {
      const formData2 = await this.data.formData();
      this.data = formData2;
      return formData2;
    }
    if (this.data instanceof FormData) {
      return this.data;
    }
    if (this.data instanceof URLSearchParams) {
      const formData2 = new FormData();
      for (const [k, v] of this.data) {
        formData2.append(k, v);
      }
      return formData2;
    }
    if (this.data instanceof Array) {
      const formData2 = new FormData();
      for (const pair of this.data) {
        formData2.append(String(pair[0]), String(pair[1]));
      }
      return formData2;
    }
    const formData = new FormData();
    try {
      const json = await this.json();
      for (const [k, v] of Object.entries(json)) {
        formData.append(k, String(v));
      }
    } catch (e) {
    }
    return formData;
  }
  async json() {
    if (this.data instanceof Response) {
      const json = await this.data.json();
      this.data = json;
      return json;
    }
    if (this.data instanceof FormData || this.data instanceof URLSearchParams) {
      return Object.fromEntries(this.data);
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return this.data;
    }
    const text = await this.text();
    if (!text) {
      return void 0;
    }
    return JSON.parse(text);
  }
  async text() {
    if (this.data instanceof Response) {
      const string = await this.data.text();
      this.data = string;
      return string;
    }
    if (this.data === null) {
      return "";
    }
    if (this.data instanceof Blob) {
      return this.data.text();
    }
    if (typeof this.data === "string") {
      return this.data;
    }
    if (this.data instanceof ArrayBuffer) {
      return textDecoder.decode(this.data);
    }
    if (isTypedArray(this.data) || this.data instanceof DataView) {
      return textDecoder.decode(this.data);
    }
    if (this.data instanceof FormData) {
      const tmp = new Response(this.data);
      return tmp.text();
    }
    if (this.data instanceof URLSearchParams) {
      return this.data.toString();
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return JSON.stringify(this.data);
    }
    return String(this.data);
  }
};
function isTypedArray(value) {
  return (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) && !(value instanceof DataView);
}
export {
  AnyData
};
/*! Bundled license information:

is-plain-object/dist/is-plain-object.mjs:
  (*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
