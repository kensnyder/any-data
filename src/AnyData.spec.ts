import { describe, expect, it } from 'vitest';
import AnyData from './AnyData';

const aString = 'Hello world';
const aBuffer = Buffer.from('Hello world', 'utf8');
const aBlob = new Blob(['Hello world']);
const anArrayBuffer = await aBlob.arrayBuffer();
const aUint8Array = new Uint8Array(anArrayBuffer);
const aDataView = new DataView(anArrayBuffer);
const aFormData = new FormData();
aFormData.append('hello', 'world');
aFormData.append('foo', 'bar');
const anObject = { hello: 'world', foo: 'bar' };
const aReadableStream = aBlob.stream();
const aUrlString = 'hello=world&foo=bar';
const aUrlSearchParams = new URLSearchParams(aUrlString);
const aJsonString = JSON.stringify(anObject);
const aJsonBuffer = Buffer.from(aJsonString, 'utf8');
const aJsonBlob = new Blob([aJsonString]);
const aJsonArrayBuffer = await aJsonBlob.arrayBuffer();
const aJsonUint8Array = new Uint8Array(aJsonArrayBuffer);
const aJsonDataView = new DataView(aJsonArrayBuffer);

describe('Conversion', () => {
  describe('string', () => {
    it('to Blob', async () => {
      const data = new AnyData(aString);
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aString);
      expect(await data.arrayBuffer()).toEqual(anArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aString);
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonString);
      expect(await data.formData()).toEqual(aFormData);
    });
    it('to json', async () => {
      const data = new AnyData(JSON.stringify(anObject));
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aString);
      expect(await data.text()).toBe(aString);
    });
  });
  describe('Blob', () => {
    it('to Blob', async () => {
      const data = new AnyData(aBlob);
      expect(await data.blob()).toBe(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aBlob);
      expect(await data.arrayBuffer()).toEqual(anArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aBlob);
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonBlob);
      expect(await data.formData()).toEqual(aFormData);
    });
    it('to json', async () => {
      const data = new AnyData(aJsonBlob);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aBlob);
      expect(await data.text()).toBe(aString);
    });
  });
  describe('ArrayBuffer', () => {
    it('to Blob', async () => {
      const data = new AnyData(anArrayBuffer);
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(anArrayBuffer);
      expect(await data.arrayBuffer()).toEqual(anArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(anArrayBuffer);
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonArrayBuffer);
      expect(await data.formData()).toEqual(aFormData);
    });
    it('to json', async () => {
      const data = new AnyData(aJsonArrayBuffer);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(anArrayBuffer);
      expect(await data.text()).toBe(aString);
    });
  });
  describe('TypedArray', () => {
    it('to Blob', async () => {
      const data = new AnyData(aUint8Array);
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aUint8Array);
      expect(await data.arrayBuffer()).toEqual(anArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aUint8Array);
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonUint8Array);
      const formData = await data.formData();
      expect(formData.get('hello')).toBe('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json', async () => {
      const arr = new TextEncoder().encode(aJsonString);
      const data = new AnyData(arr);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aUint8Array);
      expect(await data.text()).toBe(aString);
    });
  });
  describe('DataView', () => {
    it('to Blob', async () => {
      const data = new AnyData(aDataView);
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aDataView);
      expect(await data.arrayBuffer()).toEqual(anArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aDataView);
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonDataView);
      const formData = await data.formData();
      expect(formData.get('hello')).toBe('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json', async () => {
      const data = new AnyData(aJsonDataView);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aDataView);
      expect(await data.text()).toBe(aString);
    });
  });
  describe('FormData', () => {
    it('to Blob', async () => {
      aFormData.append('hello', 'world');
      const data = new AnyData(aDataView);
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const aBlob = new Blob(['Hello world']);
      const anArrayBuffer = await aBlob.arrayBuffer();

      const data = new AnyData(aFormData);
      const bytes = await data.arrayBuffer();
      // starts with --- (this is kind of redundant to the data.text() text)
      const arr = await new Blob(['---']).arrayBuffer();
      expect(bytes.slice(0, 3)).toEqual(arr);
    });
    it('to bytes', async () => {
      const data = new AnyData(aFormData);
      const bytes = await data.bytes();
      // starts with --- (this is kind of redundant to the data.text() text)
      expect(bytes.slice(0, 3)).toEqual(new Uint8Array([45, 45, 45]));
    });
    it('to FormData', async () => {
      const data = new AnyData(aFormData);
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json (Exception)', async () => {
      const data = new AnyData(aFormData);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aFormData);
      const text = await data.text();
      expect(text).toMatch(/^---/);
      expect(text).toContain('Content-Disposition: form-data;');
      expect(text).toContain('name="hello"\r\n\r\nworld');
      expect(text).toContain('name="foo"\r\n\r\nbar');
    });
  });
  describe('ReadableStream', () => {
    it('to Blob', async () => {
      aFormData.append('hello', 'world');
      const data = new AnyData(aDataView);
      expect(await data.blob()).toEqual(aBlob);
    });
    // it('to ArrayBuffer', async () => {
    //   const aBlob = new Blob(['Hello world']);
    //   const anArrayBuffer = await aBlob.arrayBuffer();
    //
    //   const data = new AnyData(aFormData);
    //   const bytes = await data.arrayBuffer();
    //   // starts with --- (this is kind of redundant to the data.text() text)
    //   const arr = await new Blob(['---']).arrayBuffer();
    //   expect(bytes.slice(0, 3)).toEqual(arr);
    // });
    // it('to bytes', async () => {
    //   const data = new AnyData(aFormData);
    //   const bytes = await data.bytes();
    //   // starts with --- (this is kind of redundant to the data.text() text)
    //   expect(bytes.slice(0, 3)).toEqual(new Uint8Array([45, 45, 45]));
    // });
    // it('to FormData', async () => {
    //   const data = new AnyData(aFormData);
    //   const formData = await data.formData();
    //   expect(formData).toEqual(aFormData);
    //   expect(formData.get('hello')).toEqual('world');
    //   expect(formData.get('foo')).toBe('bar');
    // });
    // it('to json (Exception)', async () => {
    //   const thrower = () => {
    //     const data = new AnyData(aFormData);
    //     return data.json();
    //   };
    //   expect(thrower).toThrow();
    // });
    // it('to string', async () => {
    //   const data = new AnyData(aFormData);
    //   const text = await data.text();
    //   expect(text).toStartWith('---');
    //   expect(text).toContain('Content-Disposition: form-data;');
    //   expect(text).toContain('name="hello"\r\n\r\nworld');
    //   expect(text).toContain('name="foo"\r\n\r\nbar');
    // });
  });
});
