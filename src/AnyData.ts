import { isPlainObject } from 'is-plain-object';
import { TypedArray } from 'type-fest';

export type SupportedData =
  // The following are supported by the Response object
  | Blob
  | ArrayBuffer
  | TypedArray
  | DataView
  | FormData
  | URLSearchParams
  | null
  | string
  // others we want to support
  | Record<string, any>
  | Array<any>
  | Response;

export type DataCategory = 'bytes' | 'text' | 'unknown';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export default class AnyData {
  data: SupportedData;
  constructor(data?: SupportedData) {
    this.data = data;
  }
  set(data: SupportedData) {
    this.data = data;
  }
  isSupported(): boolean {
    return (
      this.data === null ||
      this.data instanceof Blob ||
      this.data instanceof ArrayBuffer ||
      isTypedArray(this.data) ||
      this.data instanceof DataView ||
      this.data instanceof FormData ||
      this.data instanceof URLSearchParams ||
      typeof this.data === 'string' ||
      isPlainObject(this.data) ||
      Array.isArray(this.data)
    );
  }
  getDataCategory(): DataCategory {
    if (
      this.data instanceof Blob ||
      this.data instanceof ArrayBuffer ||
      isTypedArray(this.data) ||
      this.data instanceof DataView
    ) {
      return 'bytes';
    }
    if (
      this.data === null ||
      typeof this.data === 'string' ||
      this.data instanceof FormData ||
      this.data instanceof URLSearchParams ||
      isPlainObject(this.data) ||
      Array.isArray(this.data)
    ) {
      return 'text';
    }
    return 'unknown';
  }
  isEmpty(): boolean {
    return (
      this.data === null ||
      this.data === '' ||
      (isTypedArray(this.data) && this.data.length === 0) ||
      (this.data instanceof ArrayBuffer && this.data.byteLength === 0) ||
      (this.data instanceof DataView && this.data.byteLength === 0) ||
      (this.data instanceof Blob && this.data.size === 0) ||
      (this.data instanceof URLSearchParams && this.data.size === 0) ||
      (this.data instanceof FormData &&
        Array.from(this.data.keys()).length === 0)
    );
    // consider others non-empty, even [] and {}
  }
  async clone(): Promise<AnyData> {
    if (this.data instanceof Response) {
      return new AnyData(this.data.clone());
    }
    if (this.data === null || typeof this.data === 'string') {
      return new AnyData(this.data);
    }
    if (this.data instanceof FormData) {
      const formData = new FormData();
      for (const [k, v] of this.data) {
        formData.append(k, v);
      }
      return new AnyData(formData);
    }
    if (this.data instanceof URLSearchParams) {
      const params = new URLSearchParams();
      for (const [k, v] of this.data) {
        params.append(k, v);
      }
      return new AnyData(params);
    }
    // Blob, ArrayBuffer, DataView, string, Record<string, any>, Array<any>
    return new AnyData(structuredClone(this.data));
  }
  async blob(): Promise<Blob> {
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
    if (typeof this.data === 'string') {
      return new Blob([Buffer.from(this.data, 'utf8')]);
    }
    if (
      this.data instanceof ArrayBuffer ||
      this.data instanceof DataView ||
      isTypedArray(this.data)
    ) {
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
    throw new Error('Unable to convert unsupported data type to Blob');
  }
  async arrayBuffer(): Promise<ArrayBuffer> {
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
    if (typeof this.data === 'string') {
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
    throw new Error('Unable to convert unsupported data type to ArrayBuffer');
  }
  async bytes(): Promise<TypedArray> {
    if (this.data instanceof Response) {
      /* v8 ignore next 7 */
      // @ts-expect-error  Bun/Deno supports but Node doesn't
      if (typeof this.data.bytes === 'function') {
        // @ts-expect-error  Bun/Deno supports but Node doesn't
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
    if (typeof this.data === 'string') {
      return textEncoder.encode(this.data);
    }
    if (this.data instanceof FormData) {
      return textEncoder.encode(await this.text());
    }
    if (this.data instanceof ArrayBuffer) {
      return new Uint8Array(this.data);
    }
    if (this.data instanceof DataView) {
      return new AnyData(new Blob([this.data])).bytes();
    }
    if (isTypedArray(this.data)) {
      return this.data;
    }
    /* v8 ignore next 8 */
    if (this.data instanceof Blob) {
      // @ts-expect-error  Bun supports but Node doesn't
      if (typeof this.data.bytes === 'function') {
        // @ts-expect-error  Bun supports but Node doesn't
        return this.data.bytes();
      }
      return new Uint8Array(await this.arrayBuffer());
    }
    if (isPlainObject(this.data) || Array.isArray(this.data)) {
      return textEncoder.encode(JSON.stringify(this.data));
    }
    throw new Error('Unable to convert unsupported data type to a Uint8Array');
  }
  async formData(): Promise<FormData> {
    if (this.data === null) {
      return new FormData();
    }
    if (this.data instanceof Response) {
      const formData = await this.data.formData();
      // response body has been used up, so update data
      this.data = formData;
      return formData;
    }
    if (this.data instanceof FormData) {
      return this.data;
    }
    if (this.data instanceof URLSearchParams) {
      const formData = new FormData();
      for (const [k, v] of this.data) {
        formData.append(k, v);
      }
      return formData;
    }
    if (this.data instanceof Array) {
      const formData = new FormData();
      for (const pair of this.data) {
        formData.append(String(pair[0]), String(pair[1]));
      }
      return formData;
    }
    // String, Record<string, any>
    const formData = new FormData();
    try {
      const json = await this.json();
      for (const [k, v] of Object.entries(json)) {
        formData.append(k, String(v));
      }
      /* v8 ignore next 3 */
    } catch (e) {
      // ignore
    }
    return formData;
  }
  async json(): Promise<any> {
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
      return undefined;
    }
    // allow JSON.parse to throw
    return JSON.parse(text);
  }
  async text(): Promise<string> {
    if (this.data instanceof Response) {
      const string = await this.data.text();
      this.data = string;
      return string;
    }
    if (this.data === null) {
      return '';
    }
    if (this.data instanceof Blob) {
      return this.data.text();
    }
    if (typeof this.data === 'string') {
      return this.data;
    }
    if (this.data instanceof ArrayBuffer) {
      return textDecoder.decode(this.data);
    }
    if (isTypedArray(this.data) || this.data instanceof DataView) {
      return textDecoder.decode(this.data);
    }
    if (this.data instanceof FormData) {
      // use a response object here so it contains boundary information and such
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
}

function isTypedArray(value: any): value is TypedArray {
  return (
    (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) &&
    !(value instanceof DataView)
  );
}
