/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export var $EOF = 0;
export var $TAB = 9;
export var $LF = 10;
export var $VTAB = 11;
export var $FF = 12;
export var $CR = 13;
export var $SPACE = 32;
export var $BANG = 33;
export var $DQ = 34;
export var $HASH = 35;
export var $$ = 36;
export var $PERCENT = 37;
export var $AMPERSAND = 38;
export var $SQ = 39;
export var $LPAREN = 40;
export var $RPAREN = 41;
export var $STAR = 42;
export var $PLUS = 43;
export var $COMMA = 44;
export var $MINUS = 45;
export var $PERIOD = 46;
export var $SLASH = 47;
export var $COLON = 58;
export var $SEMICOLON = 59;
export var $LT = 60;
export var $EQ = 61;
export var $GT = 62;
export var $QUESTION = 63;
export var $0 = 48;
export var $9 = 57;
export var $A = 65;
export var $E = 69;
export var $F = 70;
export var $X = 88;
export var $Z = 90;
export var $LBRACKET = 91;
export var $BACKSLASH = 92;
export var $RBRACKET = 93;
export var $CARET = 94;
export var $_ = 95;
export var $a = 97;
export var $e = 101;
export var $f = 102;
export var $n = 110;
export var $r = 114;
export var $t = 116;
export var $u = 117;
export var $v = 118;
export var $x = 120;
export var $z = 122;
export var $LBRACE = 123;
export var $BAR = 124;
export var $RBRACE = 125;
export var $NBSP = 160;
export var $PIPE = 124;
export var $TILDA = 126;
export var $AT = 64;
export var $BT = 96;
export function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
export function isDigit(code) {
    return $0 <= code && code <= $9;
}
export function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
export function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY2hhcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsTUFBTSxDQUFDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUN4QixNQUFNLENBQUMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLENBQUMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUN4QixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDM0IsTUFBTSxDQUFDLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxDQUFDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLENBQUMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDeEIsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLENBQUMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLENBQUMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sQ0FBQyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxDQUFDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUU1QixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFFckIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDckIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBRXJCLE1BQU0sQ0FBQyxJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDNUIsTUFBTSxDQUFDLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzVCLE1BQU0sQ0FBQyxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUVyQixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxJQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDdEIsTUFBTSxDQUFDLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBRXRCLE1BQU0sQ0FBQyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDM0IsTUFBTSxDQUFDLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUN4QixNQUFNLENBQUMsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFFekIsTUFBTSxDQUFDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN6QixNQUFNLENBQUMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxDQUFDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLHVCQUF1QixJQUFZO0lBQ3ZDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRUQsTUFBTSxrQkFBa0IsSUFBWTtJQUNsQyxPQUFPLEVBQUUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNsQyxDQUFDO0FBRUQsTUFBTSx3QkFBd0IsSUFBWTtJQUN4QyxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7QUFDOUQsQ0FBQztBQUVELE1BQU0sMEJBQTBCLElBQVk7SUFDMUMsT0FBTyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgY29uc3QgJEVPRiA9IDA7XG5leHBvcnQgY29uc3QgJFRBQiA9IDk7XG5leHBvcnQgY29uc3QgJExGID0gMTA7XG5leHBvcnQgY29uc3QgJFZUQUIgPSAxMTtcbmV4cG9ydCBjb25zdCAkRkYgPSAxMjtcbmV4cG9ydCBjb25zdCAkQ1IgPSAxMztcbmV4cG9ydCBjb25zdCAkU1BBQ0UgPSAzMjtcbmV4cG9ydCBjb25zdCAkQkFORyA9IDMzO1xuZXhwb3J0IGNvbnN0ICREUSA9IDM0O1xuZXhwb3J0IGNvbnN0ICRIQVNIID0gMzU7XG5leHBvcnQgY29uc3QgJCQgPSAzNjtcbmV4cG9ydCBjb25zdCAkUEVSQ0VOVCA9IDM3O1xuZXhwb3J0IGNvbnN0ICRBTVBFUlNBTkQgPSAzODtcbmV4cG9ydCBjb25zdCAkU1EgPSAzOTtcbmV4cG9ydCBjb25zdCAkTFBBUkVOID0gNDA7XG5leHBvcnQgY29uc3QgJFJQQVJFTiA9IDQxO1xuZXhwb3J0IGNvbnN0ICRTVEFSID0gNDI7XG5leHBvcnQgY29uc3QgJFBMVVMgPSA0MztcbmV4cG9ydCBjb25zdCAkQ09NTUEgPSA0NDtcbmV4cG9ydCBjb25zdCAkTUlOVVMgPSA0NTtcbmV4cG9ydCBjb25zdCAkUEVSSU9EID0gNDY7XG5leHBvcnQgY29uc3QgJFNMQVNIID0gNDc7XG5leHBvcnQgY29uc3QgJENPTE9OID0gNTg7XG5leHBvcnQgY29uc3QgJFNFTUlDT0xPTiA9IDU5O1xuZXhwb3J0IGNvbnN0ICRMVCA9IDYwO1xuZXhwb3J0IGNvbnN0ICRFUSA9IDYxO1xuZXhwb3J0IGNvbnN0ICRHVCA9IDYyO1xuZXhwb3J0IGNvbnN0ICRRVUVTVElPTiA9IDYzO1xuXG5leHBvcnQgY29uc3QgJDAgPSA0ODtcbmV4cG9ydCBjb25zdCAkOSA9IDU3O1xuXG5leHBvcnQgY29uc3QgJEEgPSA2NTtcbmV4cG9ydCBjb25zdCAkRSA9IDY5O1xuZXhwb3J0IGNvbnN0ICRGID0gNzA7XG5leHBvcnQgY29uc3QgJFggPSA4ODtcbmV4cG9ydCBjb25zdCAkWiA9IDkwO1xuXG5leHBvcnQgY29uc3QgJExCUkFDS0VUID0gOTE7XG5leHBvcnQgY29uc3QgJEJBQ0tTTEFTSCA9IDkyO1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0tFVCA9IDkzO1xuZXhwb3J0IGNvbnN0ICRDQVJFVCA9IDk0O1xuZXhwb3J0IGNvbnN0ICRfID0gOTU7XG5cbmV4cG9ydCBjb25zdCAkYSA9IDk3O1xuZXhwb3J0IGNvbnN0ICRlID0gMTAxO1xuZXhwb3J0IGNvbnN0ICRmID0gMTAyO1xuZXhwb3J0IGNvbnN0ICRuID0gMTEwO1xuZXhwb3J0IGNvbnN0ICRyID0gMTE0O1xuZXhwb3J0IGNvbnN0ICR0ID0gMTE2O1xuZXhwb3J0IGNvbnN0ICR1ID0gMTE3O1xuZXhwb3J0IGNvbnN0ICR2ID0gMTE4O1xuZXhwb3J0IGNvbnN0ICR4ID0gMTIwO1xuZXhwb3J0IGNvbnN0ICR6ID0gMTIyO1xuXG5leHBvcnQgY29uc3QgJExCUkFDRSA9IDEyMztcbmV4cG9ydCBjb25zdCAkQkFSID0gMTI0O1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0UgPSAxMjU7XG5leHBvcnQgY29uc3QgJE5CU1AgPSAxNjA7XG5cbmV4cG9ydCBjb25zdCAkUElQRSA9IDEyNDtcbmV4cG9ydCBjb25zdCAkVElMREEgPSAxMjY7XG5leHBvcnQgY29uc3QgJEFUID0gNjQ7XG5cbmV4cG9ydCBjb25zdCAkQlQgPSA5NjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChjb2RlID49ICRUQUIgJiYgY29kZSA8PSAkU1BBQ0UpIHx8IChjb2RlID09ICROQlNQKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAkMCA8PSBjb2RlICYmIGNvZGUgPD0gJDk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FzY2lpTGV0dGVyKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA+PSAkYSAmJiBjb2RlIDw9ICR6IHx8IGNvZGUgPj0gJEEgJiYgY29kZSA8PSAkWjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXNjaWlIZXhEaWdpdChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPj0gJGEgJiYgY29kZSA8PSAkZiB8fCBjb2RlID49ICRBICYmIGNvZGUgPD0gJEYgfHwgaXNEaWdpdChjb2RlKTtcbn1cbiJdfQ==