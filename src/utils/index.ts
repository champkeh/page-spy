export function getRandomId() {
  return Math.random().toString(36).slice(2);
}
export function getObjectKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

/* c8 ignore start */
export function getContentType(data?: BodyInit | null) {
  if (data instanceof Blob) {
    return data.type;
  }
  if (data instanceof FormData) {
    return 'multipart/form-data';
  }
  if (data instanceof URLSearchParams) {
    return 'application/x-www-form-urlencoded;charset=UTF-8';
  }
  return 'text/plain;charset=UTF-8';
}
/* c8 ignore stop */

export function toStringTag(value: any) {
  return Object.prototype.toString.call(value);
}

export function hasOwnProperty(target: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function getPrototypeName(value: any) {
  return toStringTag(value).replace(/\[object (.*)\]/, '$1');
}
export function isString(value: any) {
  return toStringTag(value) === '[object String]';
}

export function isNumber(value: any) {
  return toStringTag(value) === '[object Number]';
}

export function isArray(value: any) {
  return toStringTag(value) === '[object Array]';
}

export function isArrayLike(value: any) {
  return value instanceof NodeList || value instanceof HTMLCollection;
}

export function isObjectLike(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isBigInt(value: any) {
  return toStringTag(value) === '[object BigInt]';
}

export function isPlainObject(value: any) {
  if (!isObjectLike(value) || toStringTag(value) !== '[object Object]') {
    return false;
  }
  return true;
  // let proto = value;
  // while (Object.getPrototypeOf(proto) !== null) {
  //   proto = Object.getPrototypeOf(proto);
  // }
  // return Object.getPrototypeOf(value) === proto;
}

export function isPrototype(data: any) {
  if (
    isObjectLike(data) &&
    hasOwnProperty(data, 'constructor') &&
    typeof data.constructor === 'function'
  ) {
    return true;
  }
  return false;
}

export function isBlob(data: any) {
  return toStringTag(data) === '[object Blob]';
}

export function isArrayBuffer(data: any) {
  return toStringTag(data) === '[object ArrayBuffer]';
}

interface PrimitiveResult {
  ok: boolean;
  value: any;
}

const stringify = (value: string) => `${value}`;
const primitive = (value: any) => ({
  ok: true,
  value,
});

export function makePrimitiveValue(value: any): PrimitiveResult {
  if (value === undefined) {
    return primitive(stringify(value));
  }
  if (value === null) {
    return primitive(value);
  }
  if (isNumber(value)) {
    if (value === -Infinity || value === Infinity || Number.isNaN(value)) {
      return primitive(stringify(value));
    }
  }
  if (isBigInt(value)) {
    return primitive(`${value}n`);
  }
  if (typeof value === 'symbol' || typeof value === 'function') {
    return primitive(stringify(value.toString()));
  }
  if (value instanceof Error) {
    return primitive(stringify(value.stack!));
  }
  if (value === Object.prototype) {
    return {
      value: null,
      ok: false,
    };
  }
  if (!(value instanceof Object || typeof value === 'object')) {
    return primitive(value);
  }
  return {
    value,
    ok: false,
  };
}

/**
 * convert `symbol / error / undefined / function` type data to readable string content
 */
export function stringifyData(data: any): any {
  const { ok, value } = makePrimitiveValue(data);
  /* c8 ignore next 3 */
  if (ok) {
    return value;
  }
  return JSON.stringify(data, (key, val) => makePrimitiveValue(val).value, 2);
}

export function getValueType(value: any) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (isBigInt(value)) return 'bigint';
  if (value instanceof Object) {
    if (value instanceof Error) return 'error';
    if (value instanceof Function) return 'function';
    return 'object';
  }
  return typeof value;
}
