import { describe, expect, it } from "vitest";
import { customIdent, CustomIdentError } from "./index.js";

describe("basics", () => {
  it("should create a custom ident from a single string", () => {
    const result = customIdent("my", "custom", "ident");
    expect(result).toMatchInlineSnapshot(`"my_custom_ident"`);
  });

  it("should create a custom ident from an array of strings", () => {
    const result = customIdent(["my", "custom", "ident"]);
    expect(result).toMatchInlineSnapshot(`"my_custom_ident"`);
  });

  it("should create a custom ident from an object with truthy values", () => {
    const result = customIdent({ my: true, custom: "1", ident: 3 });
    expect(result).toMatchInlineSnapshot(`"custom_ident_my"`);
  });

  it("should create a custom ident from mixed arguments", () => {
    const result = customIdent("my", ["custom", "ident"], { another: true });
    expect(result).toMatchInlineSnapshot(`"my_custom_ident_another"`);
  });

  it("should create a custom ident from nested arrays", () => {
    const result = customIdent(["my", ["custom", "ident", { another: false }]]);
    expect(result).toMatchInlineSnapshot(`"my_custom_ident"`);
  });

  it("should create a custom ident from an object with falsy values", () => {
    const result = customIdent(["c", { my: false, custom: "", ident: null }]);
    expect(result).toMatchInlineSnapshot(`"c"`);
  });
});

describe("invalid first characters", () => {
  it("should handle invalid first characters (digit)", () => {
    const result = customIdent("1invalid");
    expect(result).toMatchInlineSnapshot(`"c1invalid"`);
  });

  it("should handle invalid first characters (hyphen followed by digit)", () => {
    const result = customIdent("-1invalid");
    expect(result).toMatchInlineSnapshot(`"c-1invalid"`);
  });
});

describe("escaping characters", () => {
  it("should escape invalid characters", () => {
    const result = customIdent("my custom ident!");
    expect(result).toMatchInlineSnapshot(`"my_custom_ident\\21"`);
  });

  it("should handle spaces by replacing them with underscores", () => {
    const result = customIdent("my custom ident");
    expect(result).toMatchInlineSnapshot(`"my_custom_ident"`);
  });

  it("should handle special characters", () => {
    const result = customIdent("my@custom#ident$");
    expect(result).toMatchInlineSnapshot(`"my\\40custom\\23ident\\24"`);
  });

  it("should handle . and ?", () => {
    const result = customIdent("my.custom?ident");
    expect(result).toMatchInlineSnapshot(`"my\\.custom\\?ident"`);
  });
});

it("should throw an error for empty custom ident", () => {
  expect(() => customIdent()).toThrowError(CustomIdentError);
});
