import { describe, expect, it } from 'vitest';
// @ts-ignore
import { AnyData } from '../index';

const aString = 'Hello world';
const aBlob = new Blob(['Hello world']);
const anArrayBuffer = await aBlob.arrayBuffer();
const aUint8Array = new Uint8Array(anArrayBuffer);
const aDataView = new DataView(anArrayBuffer);
const aFormData = new FormData();
aFormData.append('hello', 'world');
aFormData.append('foo', 'bar');
const anObject = { hello: 'world', foo: 'bar' };
const aUrlString = 'hello=world&foo=bar';
const aUrlSearchParams = new URLSearchParams(aUrlString);
const aJsonString = JSON.stringify(anObject);
const aJsonBlob = new Blob([aJsonString]);
const aJsonArrayBuffer = await aJsonBlob.arrayBuffer();
const aJsonUint8Array = new Uint8Array(aJsonArrayBuffer);
const aJsonDataView = new DataView(aJsonArrayBuffer);
const aUrlBlob = new Blob([aUrlString]);
const aUrlArrayBuffer = await aUrlBlob.arrayBuffer();
const aUrlUint8Array = new Uint8Array(aUrlArrayBuffer);
const anArray = ['a', 'b', 'c'];
const anArrayString = JSON.stringify(anArray);
const anArrayBlob = new Blob([anArrayString]);
const anArrayArrayBuffer = await anArrayBlob.arrayBuffer();
const anArrayUint8Array = new Uint8Array(anArrayArrayBuffer);

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
      const data = new AnyData(aFormData);
      expect(await data.blob()).toEqual(aJsonBlob);
    });
    it('to ArrayBuffer', async () => {
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
    it('to json', async () => {
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
  describe('URLSearchParams', () => {
    it('to Blob', async () => {
      const data = new AnyData(aUrlSearchParams);
      expect(await data.blob()).toEqual(aUrlBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aUrlSearchParams);
      expect(await data.arrayBuffer()).toEqual(aUrlArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aUrlSearchParams);
      expect(await data.bytes()).toEqual(aUrlUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aUrlSearchParams);
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json (Exception)', async () => {
      const data = new AnyData(aUrlSearchParams);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(aUrlSearchParams);
      expect(await data.text()).toBe(aUrlString);
    });
  });
  describe('null', () => {
    it('to Blob', async () => {
      const data = new AnyData(null);
      expect(await data.blob()).toEqual(new Blob());
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(null);
      expect(await data.arrayBuffer()).toEqual(new ArrayBuffer(0));
    });
    it('to bytes', async () => {
      const data = new AnyData(null);
      expect(await data.bytes()).toEqual(new Uint8Array());
    });
    it('to FormData', async () => {
      const data = new AnyData(null);
      expect(await data.formData()).toEqual(new FormData());
    });
    it('to json', async () => {
      const data = new AnyData(null);
      expect(await data.json()).toEqual(undefined);
    });
    it('to string', async () => {
      const data = new AnyData(null);
      expect(await data.text()).toBe('');
    });
  });
  describe('string', () => {
    it('to Blob', async () => {
      const data = new AnyData(aJsonString);
      expect(await data.blob()).toEqual(new Blob([aJsonString]));
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(aJsonString);
      expect(await data.arrayBuffer()).toEqual(aJsonArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(aJsonString);
      expect(await data.bytes()).toEqual(aJsonUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(aJsonString);
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json', async () => {
      const data = new AnyData(aJsonString);
      expect(await data.json()).toEqual(anObject);
    });
    it('to string', async () => {
      const data = new AnyData('abc');
      expect(await data.text()).toBe('abc');
    });
  });
  describe('Record<string, any>', () => {
    it('to Blob', async () => {
      const data = new AnyData(anObject);
      expect(await data.blob()).toEqual(new Blob([aJsonString]));
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(anObject);
      expect(await data.arrayBuffer()).toEqual(aJsonArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(anObject);
      expect(await data.bytes()).toEqual(aJsonUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(anObject);
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json', async () => {
      const data = new AnyData(anObject);
      expect(await data.json()).toBe(anObject);
    });
    it('to string', async () => {
      const data = new AnyData(anObject);
      expect(await data.text()).toBe(aJsonString);
    });
  });
  describe('Array<any>', () => {
    it('to Blob', async () => {
      const data = new AnyData(anArray);
      expect(await data.blob()).toEqual(anArrayBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(anArray);
      expect(await data.arrayBuffer()).toEqual(anArrayArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(anArray);
      expect(await data.bytes()).toEqual(anArrayUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData([
        ['hello', 'world'],
        ['foo', 'bar'],
      ]);
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
    });
    it('to json', async () => {
      const data = new AnyData(anArray);
      expect(await data.json()).toBe(anArray);
    });
    it('to string', async () => {
      const data = new AnyData(anArray);
      expect(await data.text()).toBe(anArrayString);
    });
  });
  describe('Response', () => {
    it('to Blob', async () => {
      const data = new AnyData(new Response(aBlob));
      expect(await data.blob()).toEqual(aBlob);
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.blob()).toEqual(aBlob);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(new Response(anArrayBuffer));
      expect(await data.arrayBuffer()).toEqual(anArrayArrayBuffer);
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.arrayBuffer()).toEqual(anArrayArrayBuffer);
    });
    it('to bytes', async () => {
      const data = new AnyData(new Response(aUint8Array));
      expect(await data.bytes()).toEqual(aUint8Array);
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.bytes()).toEqual(aUint8Array);
    });
    it('to FormData', async () => {
      const data = new AnyData(new Response(aFormData));
      const formData = await data.formData();
      expect(formData).toEqual(aFormData);
      expect(formData.get('hello')).toEqual('world');
      expect(formData.get('foo')).toBe('bar');
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.formData()).toEqual(aFormData);
    });
    it('to json', async () => {
      const data = new AnyData(new Response(anArrayString));
      expect(await data.json()).toEqual(anArray);
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.json()).toEqual(anArray);
    });
    it('to string', async () => {
      const data = new AnyData(new Response('Hello world'));
      expect(await data.text()).toBe('Hello world');
      // run it twice to make sure bodyUsed is not a problem
      expect(await data.text()).toBe('Hello world');
    });
  });
  describe('Unsupported data types', () => {
    it('to Blob', async () => {
      const data = new AnyData(new Date());
      const thrower = () => data.blob();
      await expect(thrower).rejects.toThrow(/unsupported/i);
    });
    it('to ArrayBuffer', async () => {
      const data = new AnyData(new Date());
      const thrower = () => data.arrayBuffer();
      await expect(thrower).rejects.toThrow(/unsupported/i);
    });
    it('to Uint8Array', async () => {
      const data = new AnyData(new Date());
      const thrower = () => data.bytes();
      await expect(thrower).rejects.toThrow(/unsupported/i);
    });
    it('to FormData', async () => {
      const data = new AnyData(new Date());
      expect(await data.formData()).toEqual(new FormData());
    });
    it('to json', async () => {
      const data = new AnyData(new Date());
      const thrower = () => data.json();
      await expect(thrower).rejects.toThrow(/JSON/i);
    });
    it('to string', async () => {
      const now = new Date();
      const nowString = String(now);
      const data = new AnyData(now);
      expect(await data.text()).toBe(nowString);
    });
  });
});
describe('Cloning', () => {
  it('a Blob', async () => {
    const original = new AnyData(aBlob);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
  });
  it('an ArrayBuffer', async () => {
    const original = new AnyData(anArrayBuffer);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
  });
  it('a TypedArray', async () => {
    const original = new AnyData(aUint8Array);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
  });
  it('a DataView', async () => {
    const original = new AnyData(aDataView);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
  });
  it('FormData', async () => {
    const original = new AnyData(aFormData);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
    expect(clone.data.get('hello')).toEqual('world');
    expect(clone.data.get('foo')).toBe('bar');
  });
  it('URLSearchParams', async () => {
    const original = new AnyData(aUrlSearchParams);
    const clone = await original.clone();
    expect(original.data).toEqual(clone.data);
    expect(original.data).not.toBe(clone.data);
  });
  it('null', async () => {
    const original = new AnyData(null);
    const clone = await original.clone();
    expect(clone.data).toEqual(null);
  });
  it('a string', async () => {
    const original = new AnyData(aString);
    const clone = await original.clone();
    expect(clone.data).toBe(aString);
  });
  it('a Record<string,any>', async () => {
    const record = {
      one: 1,
      two: ['b', 'B'],
      three: { c: 'C' },
    };
    const original = new AnyData(record);
    const clone = await original.clone();
    expect(clone.data).toEqual(record);
    // make sure it's a deep clone
    expect(clone.data).not.toBe(record);
    expect(clone.data.two).not.toBe(record.two);
    expect(clone.data.three).not.toBe(record.three);
  });
  it('an Array<any>', async () => {
    const array = [1, ['b', 'B'], { c: 'C' }];
    const original = new AnyData(array);
    const clone = await original.clone();
    expect(clone.data).toEqual(array);
    // make sure it's a deep clone
    expect(clone.data).not.toBe(array);
    expect(clone.data[1]).not.toBe(array[1]);
    expect(clone.data[2]).not.toBe(array[2]);
  });
  it('a Response', async () => {
    const resp = new Response(aString);
    const original = new AnyData(resp);
    const clone = await original.clone();
    // make sure it's not a reference
    expect(clone.data).not.toBe(resp);
    // make sure we can use body on each
    expect(await resp.text()).toBe(aString);
    expect(await clone.data.text()).toBe(aString);
  });
  it('something unsupported', async () => {
    const now = new Date();
    const original = new AnyData(now);
    const clone = await original.clone();
    expect(clone.data).not.toBe(now);
  });
});
describe('Utility methods', () => {
  it('should update data after set', async () => {
    const data = new AnyData(anObject);
    expect(data.data).toEqual(anObject);
    data.set(aString);
    expect(data.data).toBe(aString);
  });
  it('should know if data type is supported', async () => {
    expect(new AnyData(null).isSupported()).toBe(true);
    expect(new AnyData(new Blob()).isSupported()).toBe(true);
    expect(new AnyData(new ArrayBuffer(0)).isSupported()).toBe(true);
    expect(new AnyData(new Uint8Array()).isSupported()).toBe(true);
    expect(new AnyData(new DataView(new ArrayBuffer(0))).isSupported()).toBe(
      true
    );
    expect(new AnyData(new FormData()).isSupported()).toBe(true);
    expect(new AnyData(new URLSearchParams()).isSupported()).toBe(true);
    expect(new AnyData('foobar').isSupported()).toBe(true);
    expect(new AnyData({ javascript: 'rocks' }).isSupported()).toBe(true);
    expect(new AnyData([{ a: 1 }]).isSupported()).toBe(true);
    expect(new AnyData(new Date()).isSupported()).toBe(false);
    expect(new AnyData(1).isSupported()).toBe(false);
    expect(new AnyData(false).isSupported()).toBe(false);
    expect(new AnyData(1n).isSupported()).toBe(false);
    expect(new AnyData(undefined).isSupported()).toBe(false);
    expect(new AnyData(new WeakMap()).isSupported()).toBe(false);
    expect(new AnyData(new WeakSet()).isSupported()).toBe(false);
  });
  it('should know the data category', async () => {
    expect(new AnyData(new Blob()).getDataCategory()).toBe('bytes');
    expect(new AnyData(new ArrayBuffer(0)).getDataCategory()).toBe('bytes');
    expect(new AnyData(new Uint8Array()).getDataCategory()).toBe('bytes');
    expect(
      new AnyData(new DataView(new ArrayBuffer(0))).getDataCategory()
    ).toBe('bytes');
    expect(new AnyData(new FormData()).getDataCategory()).toBe('text');
    expect(new AnyData(new URLSearchParams()).getDataCategory()).toBe('text');
    expect(new AnyData(null).getDataCategory()).toBe('text');
    expect(new AnyData('').getDataCategory()).toBe('text');
    expect(new AnyData({}).getDataCategory()).toBe('text');
    expect(new AnyData([]).getDataCategory()).toBe('text');
    expect(new AnyData(new Response()).getDataCategory()).toBe('unknown');
    expect(new AnyData(new Date()).getDataCategory()).toBe('unknown');
    expect(new AnyData(true).getDataCategory()).toBe('unknown');
  });
  it('should identify empty objects', async () => {
    expect(new AnyData(null).isEmpty()).toBe(true);
    expect(new AnyData(new Blob()).isEmpty()).toBe(true);
    expect(new AnyData(new ArrayBuffer(0)).isEmpty()).toBe(true);
    expect(new AnyData(new Uint8Array()).isEmpty()).toBe(true);
    expect(new AnyData(new DataView(new ArrayBuffer(0))).isEmpty()).toBe(true);
    expect(new AnyData(new FormData()).isEmpty()).toBe(true);
    expect(new AnyData(new URLSearchParams()).isEmpty()).toBe(true);
    expect(new AnyData('').isEmpty()).toBe(true);
    expect(new AnyData({}).isEmpty()).toBe(false);
    expect(new AnyData([]).isEmpty()).toBe(false);
    // unknown
    expect(new AnyData(new Response()).isEmpty()).toBe(false);
    expect(new AnyData(new Date()).isEmpty()).toBe(false);
    expect(new AnyData(true).isEmpty()).toBe(false);
  });
  it('should identify non-empty objects', async () => {
    expect(new AnyData(aBlob).isEmpty()).toBe(false);
    expect(new AnyData(anArrayBuffer).isEmpty()).toBe(false);
    expect(new AnyData(aUint8Array).isEmpty()).toBe(false);
    expect(new AnyData(aDataView).isEmpty()).toBe(false);
    expect(new AnyData(aFormData).isEmpty()).toBe(false);
    expect(new AnyData(aUrlSearchParams).isEmpty()).toBe(false);
    expect(new AnyData(aString).isEmpty()).toBe(false);
    expect(new AnyData(anObject).isEmpty()).toBe(false);
    expect(new AnyData(anArray).isEmpty()).toBe(false);
  });
});
