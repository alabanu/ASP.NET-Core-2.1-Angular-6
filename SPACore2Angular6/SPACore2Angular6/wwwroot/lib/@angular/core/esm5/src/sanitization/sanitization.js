/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getCurrentSanitizer } from '../render3/instructions';
import { stringify } from '../render3/util';
import { _sanitizeHtml as _sanitizeHtml } from './html_sanitizer';
import { SecurityContext } from './security';
import { _sanitizeStyle as _sanitizeStyle } from './style_sanitizer';
import { _sanitizeUrl as _sanitizeUrl } from './url_sanitizer';
var BRAND = '__SANITIZER_TRUSTED_BRAND__';
/**
 * An `html` sanitizer which converts untrusted `html` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `html` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustHtml}.
 *
 * @param unsafeHtml untrusted `html`, typically from the user.
 * @returns `html` string which is safe to display to user, because all of the dangerous javascript
 * and urls have been removed.
 */
export function sanitizeHtml(unsafeHtml) {
    var s = getCurrentSanitizer();
    if (s) {
        return s.sanitize(SecurityContext.HTML, unsafeHtml) || '';
    }
    if (unsafeHtml instanceof String && unsafeHtml[BRAND] === 'Html') {
        return unsafeHtml.toString();
    }
    return _sanitizeHtml(document, stringify(unsafeHtml));
}
/**
 * A `style` sanitizer which converts untrusted `style` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `style` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustStyle}.
 *
 * @param unsafeStyle untrusted `style`, typically from the user.
 * @returns `style` string which is safe to bind to the `style` properties, because all of the
 * dangerous javascript and urls have been removed.
 */
export function sanitizeStyle(unsafeStyle) {
    var s = getCurrentSanitizer();
    if (s) {
        return s.sanitize(SecurityContext.STYLE, unsafeStyle) || '';
    }
    if (unsafeStyle instanceof String && unsafeStyle[BRAND] === 'Style') {
        return unsafeStyle.toString();
    }
    return _sanitizeStyle(stringify(unsafeStyle));
}
/**
 * A `url` sanitizer which converts untrusted `url` **string** into trusted string by removing
 * dangerous
 * content.
 *
 * This method parses the `url` and locates potentially dangerous content (such as javascript) and
 * removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustUrl}.
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * all of the dangerous javascript has been removed.
 */
export function sanitizeUrl(unsafeUrl) {
    var s = getCurrentSanitizer();
    if (s) {
        return s.sanitize(SecurityContext.URL, unsafeUrl) || '';
    }
    if (unsafeUrl instanceof String && unsafeUrl[BRAND] === 'Url') {
        return unsafeUrl.toString();
    }
    return _sanitizeUrl(stringify(unsafeUrl));
}
/**
 * A `url` sanitizer which only lets trusted `url`s through.
 *
 * This passes only `url`s marked trusted by calling {@link bypassSanitizationTrustResourceUrl}.
 *
 * @param unsafeResourceUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * only trusted `url`s have been allowed to pass.
 */
export function sanitizeResourceUrl(unsafeResourceUrl) {
    var s = getCurrentSanitizer();
    if (s) {
        return s.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || '';
    }
    if (unsafeResourceUrl instanceof String &&
        unsafeResourceUrl[BRAND] === 'ResourceUrl') {
        return unsafeResourceUrl.toString();
    }
    throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
}
/**
 * A `script` sanitizer which only lets trusted javascript through.
 *
 * This passes only `script`s marked trusted by calling {@link bypassSanitizationTrustScript}.
 *
 * @param unsafeScript untrusted `script`, typically from the user.
 * @returns `url` string which is safe to bind to the `<script>` element such as `<img src>`,
 * because only trusted `scripts`s have been allowed to pass.
 */
export function sanitizeScript(unsafeScript) {
    var s = getCurrentSanitizer();
    if (s) {
        return s.sanitize(SecurityContext.SCRIPT, unsafeScript) || '';
    }
    if (unsafeScript instanceof String && unsafeScript[BRAND] === 'Script') {
        return unsafeScript.toString();
    }
    throw new Error('unsafe value used in a script context');
}
/**
 * Mark `html` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link htmlSanitizer} to be trusted implicitly.
 *
 * @param trustedHtml `html` string which needs to be implicitly trusted.
 * @returns a `html` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustHtml(trustedHtml) {
    return bypassSanitizationTrustString(trustedHtml, 'Html');
}
/**
 * Mark `style` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link styleSanitizer} to be trusted implicitly.
 *
 * @param trustedStyle `style` string which needs to be implicitly trusted.
 * @returns a `style` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustStyle(trustedStyle) {
    return bypassSanitizationTrustString(trustedStyle, 'Style');
}
/**
 * Mark `script` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link scriptSanitizer} to be trusted implicitly.
 *
 * @param trustedScript `script` string which needs to be implicitly trusted.
 * @returns a `script` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustScript(trustedScript) {
    return bypassSanitizationTrustString(trustedScript, 'Script');
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link urlSanitizer} to be trusted implicitly.
 *
 * @param trustedUrl `url` string which needs to be implicitly trusted.
 * @returns a `url` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustUrl(trustedUrl) {
    return bypassSanitizationTrustString(trustedUrl, 'Url');
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link resourceUrlSanitizer} to be trusted implicitly.
 *
 * @param trustedResourceUrl `url` string which needs to be implicitly trusted.
 * @returns a `url` `String` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustResourceUrl(trustedResourceUrl) {
    return bypassSanitizationTrustString(trustedResourceUrl, 'ResourceUrl');
}
function bypassSanitizationTrustString(trustedString, mode) {
    var trusted = new String(trustedString);
    trusted[BRAND] = mode;
    return trusted;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3Nhbml0aXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFMUMsT0FBTyxFQUFDLGFBQWEsSUFBSSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxjQUFjLElBQUksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFDLFlBQVksSUFBSSxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3RCxJQUFNLEtBQUssR0FBRyw2QkFBNkIsQ0FBQztBQXFENUM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSx1QkFBdUIsVUFBZTtJQUMxQyxJQUFNLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxDQUFDO0lBQ2hDLElBQUksQ0FBQyxFQUFFO1FBQ0wsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzNEO0lBQ0QsSUFBSSxVQUFVLFlBQVksTUFBTSxJQUFLLFVBQWdDLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO1FBQ3ZGLE9BQU8sVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzlCO0lBQ0QsT0FBTyxhQUFhLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLHdC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O0lBRTNFLE9BQU8sNkJBQTZCLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQVNELHVDQUNJLGFBQXFCLEVBQ3JCLElBQXlEO0lBQzNELElBQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBa0IsQ0FBQztJQUMzRCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2V0Q3VycmVudFNhbml0aXplcn0gZnJvbSAnLi4vcmVuZGVyMy9pbnN0cnVjdGlvbnMnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4uL3JlbmRlcjMvdXRpbCc7XG5cbmltcG9ydCB7X3Nhbml0aXplSHRtbCBhcyBfc2FuaXRpemVIdG1sfSBmcm9tICcuL2h0bWxfc2FuaXRpemVyJztcbmltcG9ydCB7U2VjdXJpdHlDb250ZXh0fSBmcm9tICcuL3NlY3VyaXR5JztcbmltcG9ydCB7X3Nhbml0aXplU3R5bGUgYXMgX3Nhbml0aXplU3R5bGV9IGZyb20gJy4vc3R5bGVfc2FuaXRpemVyJztcbmltcG9ydCB7X3Nhbml0aXplVXJsIGFzIF9zYW5pdGl6ZVVybH0gZnJvbSAnLi91cmxfc2FuaXRpemVyJztcblxuY29uc3QgQlJBTkQgPSAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJztcblxuLyoqXG4gKiBBIGJyYW5kZWQgdHJ1c3RlZCBzdHJpbmcgdXNlZCB3aXRoIHNhbml0aXphdGlvbi5cbiAqXG4gKiBTZWU6IHtAbGluayBUcnVzdGVkSHRtbFN0cmluZ30sIHtAbGluayBUcnVzdGVkUmVzb3VyY2VVcmxTdHJpbmd9LCB7QGxpbmsgVHJ1c3RlZFNjcmlwdFN0cmluZ30sXG4gKiB7QGxpbmsgVHJ1c3RlZFN0eWxlU3RyaW5nfSwge0BsaW5rIFRydXN0ZWRVcmxTdHJpbmd9XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1c3RlZFN0cmluZyBleHRlbmRzIFN0cmluZyB7XG4gICdfX1NBTklUSVpFUl9UUlVTVEVEX0JSQU5EX18nOiAnSHRtbCd8J1N0eWxlJ3wnU2NyaXB0J3wnVXJsJ3wnUmVzb3VyY2VVcmwnO1xufVxuXG4vKipcbiAqIEEgYnJhbmRlZCB0cnVzdGVkIHN0cmluZyB1c2VkIHdpdGggc2FuaXRpemF0aW9uIG9mIGBodG1sYCBzdHJpbmdzLlxuICpcbiAqIFNlZToge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0SHRtbH0gYW5kIHtAbGluayBodG1sU2FuaXRpemVyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcnVzdGVkSHRtbFN0cmluZyBleHRlbmRzIFRydXN0ZWRTdHJpbmcgeyAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJzogJ0h0bWwnOyB9XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24gb2YgYHN0eWxlYCBzdHJpbmdzLlxuICpcbiAqIFNlZToge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3R5bGV9IGFuZCB7QGxpbmsgc3R5bGVTYW5pdGl6ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRTdHlsZVN0cmluZyBleHRlbmRzIFRydXN0ZWRTdHJpbmcge1xuICAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJzogJ1N0eWxlJztcbn1cblxuLyoqXG4gKiBBIGJyYW5kZWQgdHJ1c3RlZCBzdHJpbmcgdXNlZCB3aXRoIHNhbml0aXphdGlvbiBvZiBgdXJsYCBzdHJpbmdzLlxuICpcbiAqIFNlZToge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U2NyaXB0fSBhbmQge0BsaW5rIHNjcmlwdFNhbml0aXplcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1c3RlZFNjcmlwdFN0cmluZyBleHRlbmRzIFRydXN0ZWRTdHJpbmcge1xuICAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJzogJ1NjcmlwdCc7XG59XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24gb2YgYHVybGAgc3RyaW5ncy5cbiAqXG4gKiBTZWU6IHtAbGluayBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFVybH0gYW5kIHtAbGluayB1cmxTYW5pdGl6ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRVcmxTdHJpbmcgZXh0ZW5kcyBUcnVzdGVkU3RyaW5nIHsgJ19fU0FOSVRJWkVSX1RSVVNURURfQlJBTkRfXyc6ICdVcmwnOyB9XG5cbi8qKlxuICogQSBicmFuZGVkIHRydXN0ZWQgc3RyaW5nIHVzZWQgd2l0aCBzYW5pdGl6YXRpb24gb2YgYHJlc291cmNlVXJsYCBzdHJpbmdzLlxuICpcbiAqIFNlZToge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0UmVzb3VyY2VVcmx9IGFuZCB7QGxpbmsgcmVzb3VyY2VVcmxTYW5pdGl6ZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRydXN0ZWRSZXNvdXJjZVVybFN0cmluZyBleHRlbmRzIFRydXN0ZWRTdHJpbmcge1xuICAnX19TQU5JVElaRVJfVFJVU1RFRF9CUkFORF9fJzogJ1Jlc291cmNlVXJsJztcbn1cblxuLyoqXG4gKiBBbiBgaHRtbGAgc2FuaXRpemVyIHdoaWNoIGNvbnZlcnRzIHVudHJ1c3RlZCBgaHRtbGAgKipzdHJpbmcqKiBpbnRvIHRydXN0ZWQgc3RyaW5nIGJ5IHJlbW92aW5nXG4gKiBkYW5nZXJvdXMgY29udGVudC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBwYXJzZXMgdGhlIGBodG1sYCBhbmQgbG9jYXRlcyBwb3RlbnRpYWxseSBkYW5nZXJvdXMgY29udGVudCAoc3VjaCBhcyB1cmxzIGFuZFxuICogamF2YXNjcmlwdCkgYW5kIHJlbW92ZXMgaXQuXG4gKlxuICogSXQgaXMgcG9zc2libGUgdG8gbWFyayBhIHN0cmluZyBhcyB0cnVzdGVkIGJ5IGNhbGxpbmcge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0SHRtbH0uXG4gKlxuICogQHBhcmFtIHVuc2FmZUh0bWwgdW50cnVzdGVkIGBodG1sYCwgdHlwaWNhbGx5IGZyb20gdGhlIHVzZXIuXG4gKiBAcmV0dXJucyBgaHRtbGAgc3RyaW5nIHdoaWNoIGlzIHNhZmUgdG8gZGlzcGxheSB0byB1c2VyLCBiZWNhdXNlIGFsbCBvZiB0aGUgZGFuZ2Vyb3VzIGphdmFzY3JpcHRcbiAqIGFuZCB1cmxzIGhhdmUgYmVlbiByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWw6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSBnZXRDdXJyZW50U2FuaXRpemVyKCk7XG4gIGlmIChzKSB7XG4gICAgcmV0dXJuIHMuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHVuc2FmZUh0bWwpIHx8ICcnO1xuICB9XG4gIGlmICh1bnNhZmVIdG1sIGluc3RhbmNlb2YgU3RyaW5nICYmICh1bnNhZmVIdG1sIGFzIFRydXN0ZWRIdG1sU3RyaW5nKVtCUkFORF0gPT09ICdIdG1sJykge1xuICAgIHJldHVybiB1bnNhZmVIdG1sLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIF9zYW5pdGl6ZUh0bWwoZG9jdW1lbnQsIHN0cmluZ2lmeSh1bnNhZmVIdG1sKSk7XG59XG5cbi8qKlxuICogQSBgc3R5bGVgIHNhbml0aXplciB3aGljaCBjb252ZXJ0cyB1bnRydXN0ZWQgYHN0eWxlYCAqKnN0cmluZyoqIGludG8gdHJ1c3RlZCBzdHJpbmcgYnkgcmVtb3ZpbmdcbiAqIGRhbmdlcm91cyBjb250ZW50LlxuICpcbiAqIFRoaXMgbWV0aG9kIHBhcnNlcyB0aGUgYHN0eWxlYCBhbmQgbG9jYXRlcyBwb3RlbnRpYWxseSBkYW5nZXJvdXMgY29udGVudCAoc3VjaCBhcyB1cmxzIGFuZFxuICogamF2YXNjcmlwdCkgYW5kIHJlbW92ZXMgaXQuXG4gKlxuICogSXQgaXMgcG9zc2libGUgdG8gbWFyayBhIHN0cmluZyBhcyB0cnVzdGVkIGJ5IGNhbGxpbmcge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3R5bGV9LlxuICpcbiAqIEBwYXJhbSB1bnNhZmVTdHlsZSB1bnRydXN0ZWQgYHN0eWxlYCwgdHlwaWNhbGx5IGZyb20gdGhlIHVzZXIuXG4gKiBAcmV0dXJucyBgc3R5bGVgIHN0cmluZyB3aGljaCBpcyBzYWZlIHRvIGJpbmQgdG8gdGhlIGBzdHlsZWAgcHJvcGVydGllcywgYmVjYXVzZSBhbGwgb2YgdGhlXG4gKiBkYW5nZXJvdXMgamF2YXNjcmlwdCBhbmQgdXJscyBoYXZlIGJlZW4gcmVtb3ZlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3R5bGUodW5zYWZlU3R5bGU6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IHMgPSBnZXRDdXJyZW50U2FuaXRpemVyKCk7XG4gIGlmIChzKSB7XG4gICAgcmV0dXJuIHMuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlNUWUxFLCB1bnNhZmVTdHlsZSkgfHwgJyc7XG4gIH1cbiAgaWYgKHVuc2FmZVN0eWxlIGluc3RhbmNlb2YgU3RyaW5nICYmICh1bnNhZmVTdHlsZSBhcyBUcnVzdGVkU3R5bGVTdHJpbmcpW0JSQU5EXSA9PT0gJ1N0eWxlJykge1xuICAgIHJldHVybiB1bnNhZmVTdHlsZS50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiBfc2FuaXRpemVTdHlsZShzdHJpbmdpZnkodW5zYWZlU3R5bGUpKTtcbn1cblxuLyoqXG4gKiBBIGB1cmxgIHNhbml0aXplciB3aGljaCBjb252ZXJ0cyB1bnRydXN0ZWQgYHVybGAgKipzdHJpbmcqKiBpbnRvIHRydXN0ZWQgc3RyaW5nIGJ5IHJlbW92aW5nXG4gKiBkYW5nZXJvdXNcbiAqIGNvbnRlbnQuXG4gKlxuICogVGhpcyBtZXRob2QgcGFyc2VzIHRoZSBgdXJsYCBhbmQgbG9jYXRlcyBwb3RlbnRpYWxseSBkYW5nZXJvdXMgY29udGVudCAoc3VjaCBhcyBqYXZhc2NyaXB0KSBhbmRcbiAqIHJlbW92ZXMgaXQuXG4gKlxuICogSXQgaXMgcG9zc2libGUgdG8gbWFyayBhIHN0cmluZyBhcyB0cnVzdGVkIGJ5IGNhbGxpbmcge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0VXJsfS5cbiAqXG4gKiBAcGFyYW0gdW5zYWZlVXJsIHVudHJ1c3RlZCBgdXJsYCwgdHlwaWNhbGx5IGZyb20gdGhlIHVzZXIuXG4gKiBAcmV0dXJucyBgdXJsYCBzdHJpbmcgd2hpY2ggaXMgc2FmZSB0byBiaW5kIHRvIHRoZSBgc3JjYCBwcm9wZXJ0aWVzIHN1Y2ggYXMgYDxpbWcgc3JjPmAsIGJlY2F1c2VcbiAqIGFsbCBvZiB0aGUgZGFuZ2Vyb3VzIGphdmFzY3JpcHQgaGFzIGJlZW4gcmVtb3ZlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplVXJsKHVuc2FmZVVybDogYW55KTogc3RyaW5nIHtcbiAgY29uc3QgcyA9IGdldEN1cnJlbnRTYW5pdGl6ZXIoKTtcbiAgaWYgKHMpIHtcbiAgICByZXR1cm4gcy5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuVVJMLCB1bnNhZmVVcmwpIHx8ICcnO1xuICB9XG4gIGlmICh1bnNhZmVVcmwgaW5zdGFuY2VvZiBTdHJpbmcgJiYgKHVuc2FmZVVybCBhcyBUcnVzdGVkVXJsU3RyaW5nKVtCUkFORF0gPT09ICdVcmwnKSB7XG4gICAgcmV0dXJuIHVuc2FmZVVybC50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiBfc2FuaXRpemVVcmwoc3RyaW5naWZ5KHVuc2FmZVVybCkpO1xufVxuXG4vKipcbiAqIEEgYHVybGAgc2FuaXRpemVyIHdoaWNoIG9ubHkgbGV0cyB0cnVzdGVkIGB1cmxgcyB0aHJvdWdoLlxuICpcbiAqIFRoaXMgcGFzc2VzIG9ubHkgYHVybGBzIG1hcmtlZCB0cnVzdGVkIGJ5IGNhbGxpbmcge0BsaW5rIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0UmVzb3VyY2VVcmx9LlxuICpcbiAqIEBwYXJhbSB1bnNhZmVSZXNvdXJjZVVybCB1bnRydXN0ZWQgYHVybGAsIHR5cGljYWxseSBmcm9tIHRoZSB1c2VyLlxuICogQHJldHVybnMgYHVybGAgc3RyaW5nIHdoaWNoIGlzIHNhZmUgdG8gYmluZCB0byB0aGUgYHNyY2AgcHJvcGVydGllcyBzdWNoIGFzIGA8aW1nIHNyYz5gLCBiZWNhdXNlXG4gKiBvbmx5IHRydXN0ZWQgYHVybGBzIGhhdmUgYmVlbiBhbGxvd2VkIHRvIHBhc3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVJlc291cmNlVXJsKHVuc2FmZVJlc291cmNlVXJsOiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBzID0gZ2V0Q3VycmVudFNhbml0aXplcigpO1xuICBpZiAocykge1xuICAgIHJldHVybiBzLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5SRVNPVVJDRV9VUkwsIHVuc2FmZVJlc291cmNlVXJsKSB8fCAnJztcbiAgfVxuICBpZiAodW5zYWZlUmVzb3VyY2VVcmwgaW5zdGFuY2VvZiBTdHJpbmcgJiZcbiAgICAgICh1bnNhZmVSZXNvdXJjZVVybCBhcyBUcnVzdGVkUmVzb3VyY2VVcmxTdHJpbmcpW0JSQU5EXSA9PT0gJ1Jlc291cmNlVXJsJykge1xuICAgIHJldHVybiB1bnNhZmVSZXNvdXJjZVVybC50b1N0cmluZygpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndW5zYWZlIHZhbHVlIHVzZWQgaW4gYSByZXNvdXJjZSBVUkwgY29udGV4dCAoc2VlIGh0dHA6Ly9nLmNvL25nL3NlY3VyaXR5I3hzcyknKTtcbn1cblxuLyoqXG4gKiBBIGBzY3JpcHRgIHNhbml0aXplciB3aGljaCBvbmx5IGxldHMgdHJ1c3RlZCBqYXZhc2NyaXB0IHRocm91Z2guXG4gKlxuICogVGhpcyBwYXNzZXMgb25seSBgc2NyaXB0YHMgbWFya2VkIHRydXN0ZWQgYnkgY2FsbGluZyB7QGxpbmsgYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTY3JpcHR9LlxuICpcbiAqIEBwYXJhbSB1bnNhZmVTY3JpcHQgdW50cnVzdGVkIGBzY3JpcHRgLCB0eXBpY2FsbHkgZnJvbSB0aGUgdXNlci5cbiAqIEByZXR1cm5zIGB1cmxgIHN0cmluZyB3aGljaCBpcyBzYWZlIHRvIGJpbmQgdG8gdGhlIGA8c2NyaXB0PmAgZWxlbWVudCBzdWNoIGFzIGA8aW1nIHNyYz5gLFxuICogYmVjYXVzZSBvbmx5IHRydXN0ZWQgYHNjcmlwdHNgcyBoYXZlIGJlZW4gYWxsb3dlZCB0byBwYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTY3JpcHQodW5zYWZlU2NyaXB0OiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBzID0gZ2V0Q3VycmVudFNhbml0aXplcigpO1xuICBpZiAocykge1xuICAgIHJldHVybiBzLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5TQ1JJUFQsIHVuc2FmZVNjcmlwdCkgfHwgJyc7XG4gIH1cbiAgaWYgKHVuc2FmZVNjcmlwdCBpbnN0YW5jZW9mIFN0cmluZyAmJiAodW5zYWZlU2NyaXB0IGFzIFRydXN0ZWRTY3JpcHRTdHJpbmcpW0JSQU5EXSA9PT0gJ1NjcmlwdCcpIHtcbiAgICByZXR1cm4gdW5zYWZlU2NyaXB0LnRvU3RyaW5nKCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd1bnNhZmUgdmFsdWUgdXNlZCBpbiBhIHNjcmlwdCBjb250ZXh0Jyk7XG59XG5cbi8qKlxuICogTWFyayBgaHRtbGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayBodG1sU2FuaXRpemVyfSB0byBiZSB0cnVzdGVkIGltcGxpY2l0bHkuXG4gKlxuICogQHBhcmFtIHRydXN0ZWRIdG1sIGBodG1sYCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgaHRtbGAgYFN0cmluZ2Agd2hpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdEh0bWwodHJ1c3RlZEh0bWw6IHN0cmluZyk6IFRydXN0ZWRIdG1sU3RyaW5nIHtcbiAgcmV0dXJuIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKHRydXN0ZWRIdG1sLCAnSHRtbCcpO1xufVxuLyoqXG4gKiBNYXJrIGBzdHlsZWAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayBzdHlsZVNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkU3R5bGUgYHN0eWxlYCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgc3R5bGVgIGBTdHJpbmdgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHlsZSh0cnVzdGVkU3R5bGU6IHN0cmluZyk6IFRydXN0ZWRTdHlsZVN0cmluZyB7XG4gIHJldHVybiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkU3R5bGUsICdTdHlsZScpO1xufVxuLyoqXG4gKiBNYXJrIGBzY3JpcHRgIHN0cmluZyBhcyB0cnVzdGVkLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd3JhcHMgdGhlIHRydXN0ZWQgc3RyaW5nIGluIGBTdHJpbmdgIGFuZCBicmFuZHMgaXQgaW4gYSB3YXkgd2hpY2ggbWFrZXMgaXRcbiAqIHJlY29nbml6YWJsZSB0byB7QGxpbmsgc2NyaXB0U2FuaXRpemVyfSB0byBiZSB0cnVzdGVkIGltcGxpY2l0bHkuXG4gKlxuICogQHBhcmFtIHRydXN0ZWRTY3JpcHQgYHNjcmlwdGAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYHNjcmlwdGAgYFN0cmluZ2Agd2hpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFNjcmlwdCh0cnVzdGVkU2NyaXB0OiBzdHJpbmcpOiBUcnVzdGVkU2NyaXB0U3RyaW5nIHtcbiAgcmV0dXJuIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKHRydXN0ZWRTY3JpcHQsICdTY3JpcHQnKTtcbn1cbi8qKlxuICogTWFyayBgdXJsYCBzdHJpbmcgYXMgdHJ1c3RlZC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdyYXBzIHRoZSB0cnVzdGVkIHN0cmluZyBpbiBgU3RyaW5nYCBhbmQgYnJhbmRzIGl0IGluIGEgd2F5IHdoaWNoIG1ha2VzIGl0XG4gKiByZWNvZ25pemFibGUgdG8ge0BsaW5rIHVybFNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkVXJsIGB1cmxgIHN0cmluZyB3aGljaCBuZWVkcyB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKiBAcmV0dXJucyBhIGB1cmxgIGBTdHJpbmdgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RVcmwodHJ1c3RlZFVybDogc3RyaW5nKTogVHJ1c3RlZFVybFN0cmluZyB7XG4gIHJldHVybiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkVXJsLCAnVXJsJyk7XG59XG4vKipcbiAqIE1hcmsgYHVybGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayByZXNvdXJjZVVybFNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkUmVzb3VyY2VVcmwgYHVybGAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYHVybGAgYFN0cmluZ2Agd2hpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFJlc291cmNlVXJsKHRydXN0ZWRSZXNvdXJjZVVybDogc3RyaW5nKTpcbiAgICBUcnVzdGVkUmVzb3VyY2VVcmxTdHJpbmcge1xuICByZXR1cm4gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcodHJ1c3RlZFJlc291cmNlVXJsLCAnUmVzb3VyY2VVcmwnKTtcbn1cblxuXG5mdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkU3RyaW5nOiBzdHJpbmcsIG1vZGU6ICdIdG1sJyk6IFRydXN0ZWRIdG1sU3RyaW5nO1xuZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcodHJ1c3RlZFN0cmluZzogc3RyaW5nLCBtb2RlOiAnU3R5bGUnKTogVHJ1c3RlZFN0eWxlU3RyaW5nO1xuZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RTdHJpbmcodHJ1c3RlZFN0cmluZzogc3RyaW5nLCBtb2RlOiAnU2NyaXB0Jyk6IFRydXN0ZWRTY3JpcHRTdHJpbmc7XG5mdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0cmluZyh0cnVzdGVkU3RyaW5nOiBzdHJpbmcsIG1vZGU6ICdVcmwnKTogVHJ1c3RlZFVybFN0cmluZztcbmZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKFxuICAgIHRydXN0ZWRTdHJpbmc6IHN0cmluZywgbW9kZTogJ1Jlc291cmNlVXJsJyk6IFRydXN0ZWRSZXNvdXJjZVVybFN0cmluZztcbmZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U3RyaW5nKFxuICAgIHRydXN0ZWRTdHJpbmc6IHN0cmluZyxcbiAgICBtb2RlOiAnSHRtbCcgfCAnU3R5bGUnIHwgJ1NjcmlwdCcgfCAnVXJsJyB8ICdSZXNvdXJjZVVybCcpOiBUcnVzdGVkU3RyaW5nIHtcbiAgY29uc3QgdHJ1c3RlZCA9IG5ldyBTdHJpbmcodHJ1c3RlZFN0cmluZykgYXMgVHJ1c3RlZFN0cmluZztcbiAgdHJ1c3RlZFtCUkFORF0gPSBtb2RlO1xuICByZXR1cm4gdHJ1c3RlZDtcbn1cbiJdfQ==