import { getStreamAsArrayBuffer } from 'get-stream';
import { isPlainObject } from 'is-plain-object';
import { TypedArray } from 'type-fest';

export type SupportedData =
  | Blob
  | ArrayBuffer
  | TypedArray
  | DataView
  | FormData
  | ReadableStream
  | URLSearchParams
  | Record<string, any>
  | Array<any>
  | Response
  | null
  | string;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export default class AnyData {
  data: SupportedData;
  constructor(data?: SupportedData) {
    this.data = data;
  }
  async clone(): Promise<AnyData> {
    if (this.data instanceof Response) {
      return new AnyData(this.data.clone());
    }
    if (this.data === null || typeof this.data === 'string') {
      return new AnyData(this.data);
    }
    return new AnyData(structuredClone(this.data));
  }
  async arrayBuffer(): Promise<ArrayBuffer> {
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
    if (this.data instanceof FormData) {
      return (await this.blob()).arrayBuffer();
    }
    if (this.data instanceof ReadableStream) {
      return getStreamAsArrayBuffer(this.data);
    }
  }
  async blob(): Promise<Blob> {
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
      const text = await this.text();
      return new Blob([text]);
    }
    if (this.data instanceof ReadableStream) {
      return new Blob([await getStreamAsArrayBuffer(this.data)]);
    }
  }
  async bytes(): Promise<TypedArray> {
    if (this.data instanceof Blob) {
      // @ts-expect-error  Bun supports but Node doesn't
      if (typeof this.data.bytes === 'function') {
        // @ts-expect-error  Bun supports but Node doesn't
        return this.data.bytes();
      }
      return new Uint8Array(await this.arrayBuffer());
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
  }
  async formData(): Promise<FormData> {
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
    const formData = new FormData();
    try {
      const json = await this.json();
      for (const [k, v] of Object.entries(json)) {
        formData.append(k, String(v));
      }
    } catch (e) {
      // ignore
    }
    return formData;
  }
  async json(): Promise<any> {
    if (this.data instanceof FormData) {
      return Object.fromEntries(this.data);
    }
    const text = await this.text();
    if (!text) {
      return undefined;
    }
    // allow JSON.parse to throw
    return JSON.parse(text);
  }
  async text(): Promise<string> {
    if (this.data instanceof Blob) {
      return this.data.text();
    }
    if (this.data instanceof ReadableStream) {
      // return getStreamAsString(this.data);
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
  }
  // async stream() {
  //   if (this.data instanceof ReadableStream) {
  //     return this.data;
  //   }
  //   if (this.data instanceof Buffer || isTypedArray(this.data)) {
  //     // @ts-expect-error  TypeScript can't know that this.data is a Buffer or TypedArray
  //     return getStream(this.data);
  //   }
  // }
  async toResponse(init: ResponseInit): Promise<Response> {
    if (this.data instanceof Response) {
      return this.data;
    }
    if (this.data instanceof Array || isPlainObject(this.data)) {
      return new Response(JSON.stringify(this.data), init);
    }
    // @ts-expect-error  TypeScript can't know that this.data is not a valid body
    return new Response(this.data, init);
  }
}

function isTypedArray(value: any): value is TypedArray {
  return (
    (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) &&
    !(value instanceof DataView)
  );
}
