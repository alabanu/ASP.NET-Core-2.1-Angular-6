/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// We have to do a little dance to get the ng1 injector into the module injector.
// We store the ng1 injector so that the provider in the module injector can access it
// Then we "get" the ng1 injector from the module injector, which triggers the provider to read
// the stored injector and release the reference to it.
let /** @type {?} */ tempInjectorRef;
/**
 * @param {?} injector
 * @return {?}
 */
export function setTempInjectorRef(injector) {
    tempInjectorRef = injector;
}
/**
 * @return {?}
 */
export function injectorFactory() {
    if (!tempInjectorRef) {
        throw new Error('Trying to get the AngularJS injector before it being set.');
    }
    const /** @type {?} */ injector = tempInjectorRef;
    tempInjectorRef = null; // clear the value to prevent memory leaks
    return injector;
}
/**
 * @param {?} i
 * @return {?}
 */
export function rootScopeFactory(i) {
    return i.get('$rootScope');
}
/**
 * @param {?} i
 * @return {?}
 */
export function compileFactory(i) {
    return i.get('$compile');
}
/**
 * @param {?} i
 * @return {?}
 */
export function parseFactory(i) {
    return i.get('$parse');
}
export const /** @type {?} */ angular1Providers = [
    // We must use exported named functions for the ng2 factories to keep the compiler happy:
    // > Metadata collected contains an error that will be reported at runtime:
    // >   Function calls are not supported.
    // >   Consider replacing the function or lambda with a reference to an exported function
    { provide: '$injector', useFactory: injectorFactory, deps: [] },
    { provide: '$rootScope', useFactory: rootScopeFactory, deps: ['$injector'] },
    { provide: '$compile', useFactory: compileFactory, deps: ['$injector'] },
    { provide: '$parse', useFactory: parseFactory, deps: ['$injector'] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjFfcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zcmMvc3RhdGljL2FuZ3VsYXIxX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFjQSxxQkFBSSxlQUE4QyxDQUFDOzs7OztBQUNuRCxNQUFNLDZCQUE2QixRQUFrQztJQUNuRSxlQUFlLEdBQUcsUUFBUSxDQUFDO0NBQzVCOzs7O0FBQ0QsTUFBTTtJQUNKLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsdUJBQU0sUUFBUSxHQUFrQyxlQUFlLENBQUM7SUFDaEUsZUFBZSxHQUFHLElBQUksQ0FBQztJQUN2QixPQUFPLFFBQVEsQ0FBQztDQUNqQjs7Ozs7QUFFRCxNQUFNLDJCQUEyQixDQUEyQjtJQUMxRCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Q0FDNUI7Ozs7O0FBRUQsTUFBTSx5QkFBeUIsQ0FBMkI7SUFDeEQsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0NBQzFCOzs7OztBQUVELE1BQU0sdUJBQXVCLENBQTJCO0lBQ3RELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUN4QjtBQUVELE1BQU0sQ0FBQyx1QkFBTSxpQkFBaUIsR0FBRzs7Ozs7SUFLL0IsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUM3RCxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0lBQzFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0lBQ3RFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0NBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnLi4vY29tbW9uL2FuZ3VsYXIxJztcblxuLy8gV2UgaGF2ZSB0byBkbyBhIGxpdHRsZSBkYW5jZSB0byBnZXQgdGhlIG5nMSBpbmplY3RvciBpbnRvIHRoZSBtb2R1bGUgaW5qZWN0b3IuXG4vLyBXZSBzdG9yZSB0aGUgbmcxIGluamVjdG9yIHNvIHRoYXQgdGhlIHByb3ZpZGVyIGluIHRoZSBtb2R1bGUgaW5qZWN0b3IgY2FuIGFjY2VzcyBpdFxuLy8gVGhlbiB3ZSBcImdldFwiIHRoZSBuZzEgaW5qZWN0b3IgZnJvbSB0aGUgbW9kdWxlIGluamVjdG9yLCB3aGljaCB0cmlnZ2VycyB0aGUgcHJvdmlkZXIgdG8gcmVhZFxuLy8gdGhlIHN0b3JlZCBpbmplY3RvciBhbmQgcmVsZWFzZSB0aGUgcmVmZXJlbmNlIHRvIGl0LlxubGV0IHRlbXBJbmplY3RvclJlZjogYW5ndWxhci5JSW5qZWN0b3JTZXJ2aWNlfG51bGw7XG5leHBvcnQgZnVuY3Rpb24gc2V0VGVtcEluamVjdG9yUmVmKGluamVjdG9yOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2UpIHtcbiAgdGVtcEluamVjdG9yUmVmID0gaW5qZWN0b3I7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0b3JGYWN0b3J5KCkge1xuICBpZiAoIXRlbXBJbmplY3RvclJlZikge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGdldCB0aGUgQW5ndWxhckpTIGluamVjdG9yIGJlZm9yZSBpdCBiZWluZyBzZXQuJyk7XG4gIH1cblxuICBjb25zdCBpbmplY3RvcjogYW5ndWxhci5JSW5qZWN0b3JTZXJ2aWNlfG51bGwgPSB0ZW1wSW5qZWN0b3JSZWY7XG4gIHRlbXBJbmplY3RvclJlZiA9IG51bGw7ICAvLyBjbGVhciB0aGUgdmFsdWUgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcbiAgcmV0dXJuIGluamVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm9vdFNjb3BlRmFjdG9yeShpOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2UpIHtcbiAgcmV0dXJuIGkuZ2V0KCckcm9vdFNjb3BlJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRmFjdG9yeShpOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2UpIHtcbiAgcmV0dXJuIGkuZ2V0KCckY29tcGlsZScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGYWN0b3J5KGk6IGFuZ3VsYXIuSUluamVjdG9yU2VydmljZSkge1xuICByZXR1cm4gaS5nZXQoJyRwYXJzZScpO1xufVxuXG5leHBvcnQgY29uc3QgYW5ndWxhcjFQcm92aWRlcnMgPSBbXG4gIC8vIFdlIG11c3QgdXNlIGV4cG9ydGVkIG5hbWVkIGZ1bmN0aW9ucyBmb3IgdGhlIG5nMiBmYWN0b3JpZXMgdG8ga2VlcCB0aGUgY29tcGlsZXIgaGFwcHk6XG4gIC8vID4gTWV0YWRhdGEgY29sbGVjdGVkIGNvbnRhaW5zIGFuIGVycm9yIHRoYXQgd2lsbCBiZSByZXBvcnRlZCBhdCBydW50aW1lOlxuICAvLyA+ICAgRnVuY3Rpb24gY2FsbHMgYXJlIG5vdCBzdXBwb3J0ZWQuXG4gIC8vID4gICBDb25zaWRlciByZXBsYWNpbmcgdGhlIGZ1bmN0aW9uIG9yIGxhbWJkYSB3aXRoIGEgcmVmZXJlbmNlIHRvIGFuIGV4cG9ydGVkIGZ1bmN0aW9uXG4gIHtwcm92aWRlOiAnJGluamVjdG9yJywgdXNlRmFjdG9yeTogaW5qZWN0b3JGYWN0b3J5LCBkZXBzOiBbXX0sXG4gIHtwcm92aWRlOiAnJHJvb3RTY29wZScsIHVzZUZhY3Rvcnk6IHJvb3RTY29wZUZhY3RvcnksIGRlcHM6IFsnJGluamVjdG9yJ119LFxuICB7cHJvdmlkZTogJyRjb21waWxlJywgdXNlRmFjdG9yeTogY29tcGlsZUZhY3RvcnksIGRlcHM6IFsnJGluamVjdG9yJ119LFxuICB7cHJvdmlkZTogJyRwYXJzZScsIHVzZUZhY3Rvcnk6IHBhcnNlRmFjdG9yeSwgZGVwczogWyckaW5qZWN0b3InXX1cbl07XG4iXX0=