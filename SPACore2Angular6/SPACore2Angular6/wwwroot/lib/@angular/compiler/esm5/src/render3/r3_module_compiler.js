/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { identifierName } from '../compile_metadata';
import { mapLiteral } from '../output/map_util';
import * as o from '../output/output_ast';
import { Identifiers as R3 } from './r3_identifiers';
import { convertMetaToOutput, mapToMapExpression } from './util';
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 */
export function compileNgModule(meta) {
    var moduleType = meta.type, bootstrap = meta.bootstrap, declarations = meta.declarations, imports = meta.imports, exports = meta.exports;
    var expression = o.importExpr(R3.defineNgModule).callFn([mapToMapExpression({
            type: moduleType,
            bootstrap: o.literalArr(bootstrap),
            declarations: o.literalArr(declarations),
            imports: o.literalArr(imports),
            exports: o.literalArr(exports),
        })]);
    // TODO(alxhub): write a proper type reference when AOT compilation of @NgModule is implemented.
    var type = new o.ExpressionType(o.NULL_EXPR);
    var additionalStatements = [];
    return { expression: expression, type: type, additionalStatements: additionalStatements };
}
// TODO(alxhub): integrate this with `compileNgModule`. Currently the two are separate operations.
export function compileNgModuleFromRender2(ctx, ngModule, injectableCompiler) {
    var className = identifierName(ngModule.type);
    var rawImports = ngModule.rawImports ? [ngModule.rawImports] : [];
    var rawExports = ngModule.rawExports ? [ngModule.rawExports] : [];
    var injectorDefArg = mapLiteral({
        'factory': injectableCompiler.factoryFor({ type: ngModule.type, symbol: ngModule.type.reference }, ctx),
        'providers': convertMetaToOutput(ngModule.rawProviders, ctx),
        'imports': convertMetaToOutput(tslib_1.__spread(rawImports, rawExports), ctx),
    });
    var injectorDef = o.importExpr(R3.defineInjector).callFn([injectorDefArg]);
    ctx.statements.push(new o.ClassStmt(
    /* name */ className, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(
        /* name */ 'ngInjectorDef', 
        /* type */ o.INFERRED_TYPE, 
        /* modifiers */ [o.StmtModifier.Static], 
        /* initializer */ injectorDef)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []));
}
function accessExportScope(module) {
    var selectorScope = new o.ReadPropExpr(module, 'ngModuleDef');
    return new o.ReadPropExpr(selectorScope, 'exported');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfbW9kdWxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFHSCxPQUFPLEVBQStCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRWpGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQixDQUFDO0FBRzFDLE9BQU8sRUFBQyxXQUFXLElBQUksRUFBRSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGtCQUFrQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBNkMvRDs7R0FFRztBQUNILE1BQU0sMEJBQTBCLElBQXdCO0lBQy9DLElBQUEsc0JBQWdCLEVBQUUsMEJBQVMsRUFBRSxnQ0FBWSxFQUFFLHNCQUFPLEVBQUUsc0JBQU8sQ0FBUztJQUMzRSxJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztZQUM1RSxJQUFJLEVBQUUsVUFBVTtZQUNoQixTQUFTLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDbEMsWUFBWSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7U0FDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVMLGdHQUFnRztJQUNoRyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLElBQU0sb0JBQW9CLEdBQWtCLEVBQUUsQ0FBQztJQUMvQyxPQUFPLEVBQUMsVUFBVSxZQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsb0JBQW9CLHNCQUFBLEVBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsa0dBQWtHO0FBQ2xHLE1BQU0scUNBQ0YsR0FBa0IsRUFBRSxRQUFzQyxFQUMxRCxrQkFBc0M7SUFDeEMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUcsQ0FBQztJQUVsRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3BFLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFcEUsSUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO1FBQ2hDLFNBQVMsRUFDTCxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsRUFBRSxHQUFHLENBQUM7UUFDOUYsV0FBVyxFQUFFLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDO1FBQzVELFNBQVMsRUFBRSxtQkFBbUIsa0JBQUssVUFBVSxFQUFLLFVBQVUsR0FBRyxHQUFHLENBQUM7S0FDcEUsQ0FBQyxDQUFDO0lBRUgsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUU3RSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTO0lBQy9CLFVBQVUsQ0FBQyxTQUFTO0lBQ3BCLFlBQVksQ0FBQyxJQUFJO0lBQ2pCLFlBQVksQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVU7UUFDekIsVUFBVSxDQUFDLGVBQWU7UUFDMUIsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQzFCLGVBQWUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQ3RDLGlCQUFpQixDQUFDLFdBQVcsQ0FBRyxDQUFDO0lBQ3JDLGFBQWEsQ0FBQSxFQUFFO0lBQ2YsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3ZELGFBQWEsQ0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCwyQkFBMkIsTUFBb0I7SUFDN0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoRSxPQUFPLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTdGF0aWNTeW1ib2x9IGZyb20gJy4uL2FvdC9zdGF0aWNfc3ltYm9sJztcbmltcG9ydCB7Q29tcGlsZVNoYWxsb3dNb2R1bGVNZXRhZGF0YSwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtJbmplY3RhYmxlQ29tcGlsZXJ9IGZyb20gJy4uL2luamVjdGFibGVfY29tcGlsZXInO1xuaW1wb3J0IHttYXBMaXRlcmFsfSBmcm9tICcuLi9vdXRwdXQvbWFwX3V0aWwnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge091dHB1dENvbnRleHR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge0lkZW50aWZpZXJzIGFzIFIzfSBmcm9tICcuL3IzX2lkZW50aWZpZXJzJztcbmltcG9ydCB7Y29udmVydE1ldGFUb091dHB1dCwgbWFwVG9NYXBFeHByZXNzaW9ufSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFIzTmdNb2R1bGVEZWYge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG4gIHR5cGU6IG8uVHlwZTtcbiAgYWRkaXRpb25hbFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W107XG59XG5cbi8qKlxuICogTWV0YWRhdGEgcmVxdWlyZWQgYnkgdGhlIG1vZHVsZSBjb21waWxlciB0byBnZW5lcmF0ZSBhIGBuZ01vZHVsZURlZmAgZm9yIGEgdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSM05nTW9kdWxlTWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIG1vZHVsZSB0eXBlIGJlaW5nIGNvbXBpbGVkLlxuICAgKi9cbiAgdHlwZTogby5FeHByZXNzaW9uO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBleHByZXNzaW9ucyByZXByZXNlbnRpbmcgdGhlIGJvb3RzdHJhcCBjb21wb25lbnRzIHNwZWNpZmllZCBieSB0aGUgbW9kdWxlLlxuICAgKi9cbiAgYm9vdHN0cmFwOiBvLkV4cHJlc3Npb25bXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyBkZWNsYXJlZCBieSB0aGUgbW9kdWxlLlxuICAgKi9cbiAgZGVjbGFyYXRpb25zOiBvLkV4cHJlc3Npb25bXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBpbXBvcnRzIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBpbXBvcnRzOiBvLkV4cHJlc3Npb25bXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBleHBvcnRzOiBvLkV4cHJlc3Npb25bXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbWl0IHRoZSBzZWxlY3RvciBzY29wZSB2YWx1ZXMgKGRlY2xhcmF0aW9ucywgaW1wb3J0cywgZXhwb3J0cykgaW5saW5lIGludG8gdGhlXG4gICAqIG1vZHVsZSBkZWZpbml0aW9uLCBvciB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIHN0YXRlbWVudHMgd2hpY2ggcGF0Y2ggdGhlbSBvbi4gSW5saW5lIGVtaXNzaW9uXG4gICAqIGRvZXMgbm90IGFsbG93IGNvbXBvbmVudHMgdG8gYmUgdHJlZS1zaGFrZW4sIGJ1dCBpcyB1c2VmdWwgZm9yIEpJVCBtb2RlLlxuICAgKi9cbiAgZW1pdElubGluZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYW4gYFIzTmdNb2R1bGVEZWZgIGZvciB0aGUgZ2l2ZW4gYFIzTmdNb2R1bGVNZXRhZGF0YWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTmdNb2R1bGUobWV0YTogUjNOZ01vZHVsZU1ldGFkYXRhKTogUjNOZ01vZHVsZURlZiB7XG4gIGNvbnN0IHt0eXBlOiBtb2R1bGVUeXBlLCBib290c3RyYXAsIGRlY2xhcmF0aW9ucywgaW1wb3J0cywgZXhwb3J0c30gPSBtZXRhO1xuICBjb25zdCBleHByZXNzaW9uID0gby5pbXBvcnRFeHByKFIzLmRlZmluZU5nTW9kdWxlKS5jYWxsRm4oW21hcFRvTWFwRXhwcmVzc2lvbih7XG4gICAgdHlwZTogbW9kdWxlVHlwZSxcbiAgICBib290c3RyYXA6IG8ubGl0ZXJhbEFycihib290c3RyYXApLFxuICAgIGRlY2xhcmF0aW9uczogby5saXRlcmFsQXJyKGRlY2xhcmF0aW9ucyksXG4gICAgaW1wb3J0czogby5saXRlcmFsQXJyKGltcG9ydHMpLFxuICAgIGV4cG9ydHM6IG8ubGl0ZXJhbEFycihleHBvcnRzKSxcbiAgfSldKTtcblxuICAvLyBUT0RPKGFseGh1Yik6IHdyaXRlIGEgcHJvcGVyIHR5cGUgcmVmZXJlbmNlIHdoZW4gQU9UIGNvbXBpbGF0aW9uIG9mIEBOZ01vZHVsZSBpcyBpbXBsZW1lbnRlZC5cbiAgY29uc3QgdHlwZSA9IG5ldyBvLkV4cHJlc3Npb25UeXBlKG8uTlVMTF9FWFBSKTtcbiAgY29uc3QgYWRkaXRpb25hbFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgcmV0dXJuIHtleHByZXNzaW9uLCB0eXBlLCBhZGRpdGlvbmFsU3RhdGVtZW50c307XG59XG5cbi8vIFRPRE8oYWx4aHViKTogaW50ZWdyYXRlIHRoaXMgd2l0aCBgY29tcGlsZU5nTW9kdWxlYC4gQ3VycmVudGx5IHRoZSB0d28gYXJlIHNlcGFyYXRlIG9wZXJhdGlvbnMuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU5nTW9kdWxlRnJvbVJlbmRlcjIoXG4gICAgY3R4OiBPdXRwdXRDb250ZXh0LCBuZ01vZHVsZTogQ29tcGlsZVNoYWxsb3dNb2R1bGVNZXRhZGF0YSxcbiAgICBpbmplY3RhYmxlQ29tcGlsZXI6IEluamVjdGFibGVDb21waWxlcik6IHZvaWQge1xuICBjb25zdCBjbGFzc05hbWUgPSBpZGVudGlmaWVyTmFtZShuZ01vZHVsZS50eXBlKSAhO1xuXG4gIGNvbnN0IHJhd0ltcG9ydHMgPSBuZ01vZHVsZS5yYXdJbXBvcnRzID8gW25nTW9kdWxlLnJhd0ltcG9ydHNdIDogW107XG4gIGNvbnN0IHJhd0V4cG9ydHMgPSBuZ01vZHVsZS5yYXdFeHBvcnRzID8gW25nTW9kdWxlLnJhd0V4cG9ydHNdIDogW107XG5cbiAgY29uc3QgaW5qZWN0b3JEZWZBcmcgPSBtYXBMaXRlcmFsKHtcbiAgICAnZmFjdG9yeSc6XG4gICAgICAgIGluamVjdGFibGVDb21waWxlci5mYWN0b3J5Rm9yKHt0eXBlOiBuZ01vZHVsZS50eXBlLCBzeW1ib2w6IG5nTW9kdWxlLnR5cGUucmVmZXJlbmNlfSwgY3R4KSxcbiAgICAncHJvdmlkZXJzJzogY29udmVydE1ldGFUb091dHB1dChuZ01vZHVsZS5yYXdQcm92aWRlcnMsIGN0eCksXG4gICAgJ2ltcG9ydHMnOiBjb252ZXJ0TWV0YVRvT3V0cHV0KFsuLi5yYXdJbXBvcnRzLCAuLi5yYXdFeHBvcnRzXSwgY3R4KSxcbiAgfSk7XG5cbiAgY29uc3QgaW5qZWN0b3JEZWYgPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lSW5qZWN0b3IpLmNhbGxGbihbaW5qZWN0b3JEZWZBcmddKTtcblxuICBjdHguc3RhdGVtZW50cy5wdXNoKG5ldyBvLkNsYXNzU3RtdChcbiAgICAgIC8qIG5hbWUgKi8gY2xhc3NOYW1lLFxuICAgICAgLyogcGFyZW50ICovIG51bGwsXG4gICAgICAvKiBmaWVsZHMgKi9bbmV3IG8uQ2xhc3NGaWVsZChcbiAgICAgICAgICAvKiBuYW1lICovICduZ0luamVjdG9yRGVmJyxcbiAgICAgICAgICAvKiB0eXBlICovIG8uSU5GRVJSRURfVFlQRSxcbiAgICAgICAgICAvKiBtb2RpZmllcnMgKi9bby5TdG10TW9kaWZpZXIuU3RhdGljXSxcbiAgICAgICAgICAvKiBpbml0aWFsaXplciAqLyBpbmplY3RvckRlZiwgKV0sXG4gICAgICAvKiBnZXR0ZXJzICovW10sXG4gICAgICAvKiBjb25zdHJ1Y3Rvck1ldGhvZCAqLyBuZXcgby5DbGFzc01ldGhvZChudWxsLCBbXSwgW10pLFxuICAgICAgLyogbWV0aG9kcyAqL1tdKSk7XG59XG5cbmZ1bmN0aW9uIGFjY2Vzc0V4cG9ydFNjb3BlKG1vZHVsZTogby5FeHByZXNzaW9uKTogby5FeHByZXNzaW9uIHtcbiAgY29uc3Qgc2VsZWN0b3JTY29wZSA9IG5ldyBvLlJlYWRQcm9wRXhwcihtb2R1bGUsICduZ01vZHVsZURlZicpO1xuICByZXR1cm4gbmV3IG8uUmVhZFByb3BFeHByKHNlbGVjdG9yU2NvcGUsICdleHBvcnRlZCcpO1xufVxuIl19