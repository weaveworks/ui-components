// Cleans up a value to be used as an element ID.
// Encodes invalid characters to be valid in XHTML and makes it
// so that it can be reversed by decodeIdAttribute.
export function encodeIdAttribute(id) {
  return id.replace(/[<>&;]/gm, m => `__u${m.charCodeAt(0)}__`);
}
