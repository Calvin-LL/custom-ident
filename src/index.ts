type Value = string | number | undefined | boolean;
type RecordValue = Record<string, any>;
type ArrayValue = Array<Value> | ReadonlyArray<Value>;
type Arguments = Array<ArrayValue | RecordValue | Value>;

export class CustomIdentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomIdentError";
  }
}

/**
 * Turns a list of values into a CSS <custom-ident>.
 * Escapes invalid characters.
 *
 * @warning Spaces are mapped to `_`s.
 *
 * @example
 * ```ts
 * import { customIdent } from "custom-ident";
 *
 * const ident = customIdent("foo", "bar", "baz@");
 * console.log(ident); // 'foo_bar_baz\\40'
 *
 * const ident = customIdent([
 *   undefined,
 *   null,
 *   true,
 *   false,
 *   3,
 *   { test: "hi", oof: 0 },
 * ]);
 * console.log(ident); // 'undefined_null_true_false_3_test'
 * ```
 *
 * @param args - The values to be concatenated into a custom-ident.
 * @returns A string representing the custom-ident.
 */
export function customIdent(...args: Arguments): string {
  let result = customIdentWithPotentiallyInvalidFirstChar(...args);

  // > the first character must not be a decimal digit,
  // > nor a hyphen (-) followed by a decimal digit.

  if (/^[0-9]/.test(result) || /^-([0-9])/.test(result)) {
    result = "c" + result;
  }

  if (result.length === 0) {
    throw new CustomIdentError("customIdent must not be empty");
  }

  return result;
}

function customIdentWithPotentiallyInvalidFirstChar(
  ...args: Arguments
): string {
  let parts = [];

  for (const arg of args) {
    if (Array.isArray(arg)) {
      parts.push(customIdentWithPotentiallyInvalidFirstChar(...arg));
    } else if (typeof arg === "object" && arg !== null) {
      const part = Object.entries(arg)
        .toSorted(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0))
        .filter(([, value]) => value)
        .map(([key]) => escapeValue(key))
        .filter((key) => key.length > 0)
        .join("_");

      if (part.length > 0) {
        parts.push(part);
      }
    } else {
      const part = escapeValue(arg);

      if (part.length > 0) {
        parts.push(part);
      }
    }
  }

  return parts.join("_");
}

function escapeValue(value: Value): string {
  const valueString = String(value);
  const chars = valueString.split("");
  let result = "";

  for (const char of chars) {
    if (isValidCustomIdentCharacter(char)) {
      result += char;
    } else if (char === " ") {
      result += "_";
    } else if ([".", "?"].includes(char)) {
      result += `\\${char}`;
    } else {
      result += `\\${char.charCodeAt(0).toString(16)}`;
    }
  }

  return result;
}

function isValidCustomIdentCharacter(char: string): boolean {
  return /^[a-zA-Z0-9-_]/.test(char);
}
