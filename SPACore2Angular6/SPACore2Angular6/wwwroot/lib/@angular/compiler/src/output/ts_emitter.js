/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/output/ts_emitter", ["require", "exports", "tslib", "@angular/compiler/src/output/abstract_emitter", "@angular/compiler/src/output/output_ast"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var abstract_emitter_1 = require("@angular/compiler/src/output/abstract_emitter");
    var o = require("@angular/compiler/src/output/output_ast");
    var _debugFilePath = '/debug/lib';
    function debugOutputAstAsTypeScript(ast) {
        var converter = new _TsEmitterVisitor();
        var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
        var asts = Array.isArray(ast) ? ast : [ast];
        asts.forEach(function (ast) {
            if (ast instanceof o.Statement) {
                ast.visitStatement(converter, ctx);
            }
            else if (ast instanceof o.Expression) {
                ast.visitExpression(converter, ctx);
            }
            else if (ast instanceof o.Type) {
                ast.visitType(converter, ctx);
            }
            else {
                throw new Error("Don't know how to print debug info for " + ast);
            }
        });
        return ctx.toSource();
    }
    exports.debugOutputAstAsTypeScript = debugOutputAstAsTypeScript;
    var TypeScriptEmitter = /** @class */ (function () {
        function TypeScriptEmitter() {
        }
        TypeScriptEmitter.prototype.emitStatementsAndContext = function (genFilePath, stmts, preamble, emitSourceMaps, referenceFilter, importFilter) {
            if (preamble === void 0) { preamble = ''; }
            if (emitSourceMaps === void 0) { emitSourceMaps = true; }
            var converter = new _TsEmitterVisitor(referenceFilter, importFilter);
            var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
            converter.visitAllStatements(stmts, ctx);
            var preambleLines = preamble ? preamble.split('\n') : [];
            converter.reexports.forEach(function (reexports, exportedModuleName) {
                var reexportsCode = reexports.map(function (reexport) { return reexport.name + " as " + reexport.as; }).join(',');
                preambleLines.push("export {" + reexportsCode + "} from '" + exportedModuleName + "';");
            });
            converter.importsWithPrefixes.forEach(function (prefix, importedModuleName) {
                // Note: can't write the real word for import as it screws up system.js auto detection...
                preambleLines.push("imp" +
                    ("ort * as " + prefix + " from '" + importedModuleName + "';"));
            });
            var sm = emitSourceMaps ?
                ctx.toSourceMapGenerator(genFilePath, preambleLines.length).toJsComment() :
                '';
            var lines = tslib_1.__spread(preambleLines, [ctx.toSource(), sm]);
            if (sm) {
                // always add a newline at the end, as some tools have bugs without it.
                lines.push('');
            }
            ctx.setPreambleLineCount(preambleLines.length);
            return { sourceText: lines.join('\n'), context: ctx };
        };
        TypeScriptEmitter.prototype.emitStatements = function (genFilePath, stmts, preamble) {
            if (preamble === void 0) { preamble = ''; }
            return this.emitStatementsAndContext(genFilePath, stmts, preamble).sourceText;
        };
        return TypeScriptEmitter;
    }());
    exports.TypeScriptEmitter = TypeScriptEmitter;
    var _TsEmitterVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(_TsEmitterVisitor, _super);
        function _TsEmitterVisitor(referenceFilter, importFilter) {
            var _this = _super.call(this, false) || this;
            _this.referenceFilter = referenceFilter;
            _this.importFilter = importFilter;
            _this.typeExpression = 0;
            _this.importsWithPrefixes = new Map();
            _this.reexports = new Map();
            return _this;
        }
        _TsEmitterVisitor.prototype.visitType = function (t, ctx, defaultType) {
            if (defaultType === void 0) { defaultType = 'any'; }
            if (t) {
                this.typeExpression++;
                t.visitType(this, ctx);
                this.typeExpression--;
            }
            else {
                ctx.print(null, defaultType);
            }
        };
        _TsEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
            var value = ast.value;
            if (value == null && ast.type != o.INFERRED_TYPE) {
                ctx.print(ast, "(" + value + " as any)");
                return null;
            }
            return _super.prototype.visitLiteralExpr.call(this, ast, ctx);
        };
        // Temporary workaround to support strictNullCheck enabled consumers of ngc emit.
        // In SNC mode, [] have the type never[], so we cast here to any[].
        // TODO: narrow the cast to a more explicit type, or use a pattern that does not
        // start with [].concat. see https://github.com/angular/angular/pull/11846
        _TsEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
            if (ast.entries.length === 0) {
                ctx.print(ast, '(');
            }
            var result = _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
            if (ast.entries.length === 0) {
                ctx.print(ast, ' as any[])');
            }
            return result;
        };
        _TsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
            this._visitIdentifier(ast.value, ast.typeParams, ctx);
            return null;
        };
        _TsEmitterVisitor.prototype.visitAssertNotNullExpr = function (ast, ctx) {
            var result = _super.prototype.visitAssertNotNullExpr.call(this, ast, ctx);
            ctx.print(ast, '!');
            return result;
        };
        _TsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
            if (stmt.hasModifier(o.StmtModifier.Exported) && stmt.value instanceof o.ExternalExpr &&
                !stmt.type) {
                // check for a reexport
                var _a = stmt.value.value, name_1 = _a.name, moduleName = _a.moduleName;
                if (moduleName) {
                    var reexports = this.reexports.get(moduleName);
                    if (!reexports) {
                        reexports = [];
                        this.reexports.set(moduleName, reexports);
                    }
                    reexports.push({ name: name_1, as: stmt.name });
                    return null;
                }
            }
            if (stmt.hasModifier(o.StmtModifier.Exported)) {
                ctx.print(stmt, "export ");
            }
            if (stmt.hasModifier(o.StmtModifier.Final)) {
                ctx.print(stmt, "const");
            }
            else {
                ctx.print(stmt, "var");
            }
            ctx.print(stmt, " " + stmt.name);
            this._printColonType(stmt.type, ctx);
            if (stmt.value) {
                ctx.print(stmt, " = ");
                stmt.value.visitExpression(this, ctx);
            }
            ctx.println(stmt, ";");
            return null;
        };
        _TsEmitterVisitor.prototype.visitWrappedNodeExpr = function (ast, ctx) {
            throw new Error('Cannot visit a WrappedNodeExpr when outputting Typescript.');
        };
        _TsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
            ctx.print(ast, "(<");
            ast.type.visitType(this, ctx);
            ctx.print(ast, ">");
            ast.value.visitExpression(this, ctx);
            ctx.print(ast, ")");
            return null;
        };
        _TsEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
            ctx.print(ast, "new ");
            this.typeExpression++;
            ast.classExpr.visitExpression(this, ctx);
            this.typeExpression--;
            ctx.print(ast, "(");
            this.visitAllExpressions(ast.args, ctx, ',');
            ctx.print(ast, ")");
            return null;
        };
        _TsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
            var _this = this;
            ctx.pushClass(stmt);
            if (stmt.hasModifier(o.StmtModifier.Exported)) {
                ctx.print(stmt, "export ");
            }
            ctx.print(stmt, "class " + stmt.name);
            if (stmt.parent != null) {
                ctx.print(stmt, " extends ");
                this.typeExpression++;
                stmt.parent.visitExpression(this, ctx);
                this.typeExpression--;
            }
            ctx.println(stmt, " {");
            ctx.incIndent();
            stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
            if (stmt.constructorMethod != null) {
                this._visitClassConstructor(stmt, ctx);
            }
            stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
            stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
            ctx.decIndent();
            ctx.println(stmt, "}");
            ctx.popClass();
            return null;
        };
        _TsEmitterVisitor.prototype._visitClassField = function (field, ctx) {
            if (field.hasModifier(o.StmtModifier.Private)) {
                // comment out as a workaround for #10967
                ctx.print(null, "/*private*/ ");
            }
            if (field.hasModifier(o.StmtModifier.Static)) {
                ctx.print(null, 'static ');
            }
            ctx.print(null, field.name);
            this._printColonType(field.type, ctx);
            if (field.initializer) {
                ctx.print(null, ' = ');
                field.initializer.visitExpression(this, ctx);
            }
            ctx.println(null, ";");
        };
        _TsEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
            if (getter.hasModifier(o.StmtModifier.Private)) {
                ctx.print(null, "private ");
            }
            ctx.print(null, "get " + getter.name + "()");
            this._printColonType(getter.type, ctx);
            ctx.println(null, " {");
            ctx.incIndent();
            this.visitAllStatements(getter.body, ctx);
            ctx.decIndent();
            ctx.println(null, "}");
        };
        _TsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
            ctx.print(stmt, "constructor(");
            this._visitParams(stmt.constructorMethod.params, ctx);
            ctx.println(stmt, ") {");
            ctx.incIndent();
            this.visitAllStatements(stmt.constructorMethod.body, ctx);
            ctx.decIndent();
            ctx.println(stmt, "}");
        };
        _TsEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
            if (method.hasModifier(o.StmtModifier.Private)) {
                ctx.print(null, "private ");
            }
            ctx.print(null, method.name + "(");
            this._visitParams(method.params, ctx);
            ctx.print(null, ")");
            this._printColonType(method.type, ctx, 'void');
            ctx.println(null, " {");
            ctx.incIndent();
            this.visitAllStatements(method.body, ctx);
            ctx.decIndent();
            ctx.println(null, "}");
        };
        _TsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
            if (ast.name) {
                ctx.print(ast, 'function ');
                ctx.print(ast, ast.name);
            }
            ctx.print(ast, "(");
            this._visitParams(ast.params, ctx);
            ctx.print(ast, ")");
            this._printColonType(ast.type, ctx, 'void');
            if (!ast.name) {
                ctx.print(ast, " => ");
            }
            ctx.println(ast, '{');
            ctx.incIndent();
            this.visitAllStatements(ast.statements, ctx);
            ctx.decIndent();
            ctx.print(ast, "}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
            if (stmt.hasModifier(o.StmtModifier.Exported)) {
                ctx.print(stmt, "export ");
            }
            ctx.print(stmt, "function " + stmt.name + "(");
            this._visitParams(stmt.params, ctx);
            ctx.print(stmt, ")");
            this._printColonType(stmt.type, ctx, 'void');
            ctx.println(stmt, " {");
            ctx.incIndent();
            this.visitAllStatements(stmt.statements, ctx);
            ctx.decIndent();
            ctx.println(stmt, "}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
            ctx.println(stmt, "try {");
            ctx.incIndent();
            this.visitAllStatements(stmt.bodyStmts, ctx);
            ctx.decIndent();
            ctx.println(stmt, "} catch (" + abstract_emitter_1.CATCH_ERROR_VAR.name + ") {");
            ctx.incIndent();
            var catchStmts = [abstract_emitter_1.CATCH_STACK_VAR.set(abstract_emitter_1.CATCH_ERROR_VAR.prop('stack', null)).toDeclStmt(null, [
                    o.StmtModifier.Final
                ])].concat(stmt.catchStmts);
            this.visitAllStatements(catchStmts, ctx);
            ctx.decIndent();
            ctx.println(stmt, "}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitBuiltinType = function (type, ctx) {
            var typeStr;
            switch (type.name) {
                case o.BuiltinTypeName.Bool:
                    typeStr = 'boolean';
                    break;
                case o.BuiltinTypeName.Dynamic:
                    typeStr = 'any';
                    break;
                case o.BuiltinTypeName.Function:
                    typeStr = 'Function';
                    break;
                case o.BuiltinTypeName.Number:
                    typeStr = 'number';
                    break;
                case o.BuiltinTypeName.Int:
                    typeStr = 'number';
                    break;
                case o.BuiltinTypeName.String:
                    typeStr = 'string';
                    break;
                default:
                    throw new Error("Unsupported builtin type " + type.name);
            }
            ctx.print(null, typeStr);
            return null;
        };
        _TsEmitterVisitor.prototype.visitExpressionType = function (ast, ctx) {
            ast.value.visitExpression(this, ctx);
            return null;
        };
        _TsEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
            this.visitType(type.of, ctx);
            ctx.print(null, "[]");
            return null;
        };
        _TsEmitterVisitor.prototype.visitMapType = function (type, ctx) {
            ctx.print(null, "{[key: string]:");
            this.visitType(type.valueType, ctx);
            ctx.print(null, "}");
            return null;
        };
        _TsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
            var name;
            switch (method) {
                case o.BuiltinMethod.ConcatArray:
                    name = 'concat';
                    break;
                case o.BuiltinMethod.SubscribeObservable:
                    name = 'subscribe';
                    break;
                case o.BuiltinMethod.Bind:
                    name = 'bind';
                    break;
                default:
                    throw new Error("Unknown builtin method: " + method);
            }
            return name;
        };
        _TsEmitterVisitor.prototype._visitParams = function (params, ctx) {
            var _this = this;
            this.visitAllObjects(function (param) {
                ctx.print(null, param.name);
                _this._printColonType(param.type, ctx);
            }, params, ctx, ',');
        };
        _TsEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
            var _this = this;
            var name = value.name, moduleName = value.moduleName;
            if (this.referenceFilter && this.referenceFilter(value)) {
                ctx.print(null, '(null as any)');
                return;
            }
            if (moduleName && (!this.importFilter || !this.importFilter(value))) {
                var prefix = this.importsWithPrefixes.get(moduleName);
                if (prefix == null) {
                    prefix = "i" + this.importsWithPrefixes.size;
                    this.importsWithPrefixes.set(moduleName, prefix);
                }
                ctx.print(null, prefix + ".");
            }
            ctx.print(null, name);
            if (this.typeExpression > 0) {
                // If we are in a type expression that refers to a generic type then supply
                // the required type parameters. If there were not enough type parameters
                // supplied, supply any as the type. Outside a type expression the reference
                // should not supply type parameters and be treated as a simple value reference
                // to the constructor function itself.
                var suppliedParameters = typeParams || [];
                if (suppliedParameters.length > 0) {
                    ctx.print(null, "<");
                    this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, typeParams, ctx, ',');
                    ctx.print(null, ">");
                }
            }
        };
        _TsEmitterVisitor.prototype._printColonType = function (type, ctx, defaultType) {
            if (type !== o.INFERRED_TYPE) {
                ctx.print(null, ':');
                this.visitType(type, ctx, defaultType);
            }
        };
        return _TsEmitterVisitor;
    }(abstract_emitter_1.AbstractEmitterVisitor));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvdHNfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFNSCxrRkFBa0k7SUFDbEksMkRBQWtDO0lBRWxDLElBQU0sY0FBYyxHQUFHLFlBQVksQ0FBQztJQUVwQyxvQ0FBMkMsR0FBZ0Q7UUFFekYsSUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQzFDLElBQU0sR0FBRyxHQUFHLHdDQUFxQixDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9DLElBQU0sSUFBSSxHQUFVLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUNmLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzlCLEdBQUcsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3RDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQy9CO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTBDLEdBQUssQ0FBQyxDQUFDO2FBQ2xFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJ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LEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNqQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSSxFQUFFLEdBQUcsQ0FBQyxFQUF6QixDQUF5QixFQUFFLFVBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2hGLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUN0QjthQUNGO1FBQ0gsQ0FBQztRQUVPLDJDQUFlLEdBQXZCLFVBQXdCLElBQWlCLEVBQUUsR0FBMEIsRUFBRSxXQUFvQjtZQUN6RixJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFO2dCQUM1QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQztRQUNILHdCQUFDO0lBQUQsQ0FBQyxBQXJXRCxDQUFnQyx5Q0FBc0IsR0FxV3JEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5cbmltcG9ydCB7U3RhdGljU3ltYm9sfSBmcm9tICcuLi9hb3Qvc3RhdGljX3N5bWJvbCc7XG5pbXBvcnQge0NvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGF9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuXG5pbXBvcnQge0Fic3RyYWN0RW1pdHRlclZpc2l0b3IsIENBVENIX0VSUk9SX1ZBUiwgQ0FUQ0hfU1RBQ0tfVkFSLCBFbWl0dGVyVmlzaXRvckNvbnRleHQsIE91dHB1dEVtaXR0ZXJ9IGZyb20gJy4vYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0X2FzdCc7XG5cbmNvbnN0IF9kZWJ1Z0ZpbGVQYXRoID0gJy9kZWJ1Zy9saWInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVidWdPdXRwdXRBc3RBc1R5cGVTY3JpcHQoYXN0OiBvLlN0YXRlbWVudCB8IG8uRXhwcmVzc2lvbiB8IG8uVHlwZSB8IGFueVtdKTpcbiAgICBzdHJpbmcge1xuICBjb25zdCBjb252ZXJ0ZXIgPSBuZXcgX1RzRW1pdHRlclZpc2l0b3IoKTtcbiAgY29uc3QgY3R4ID0gRW1pdHRlclZpc2l0b3JDb250ZXh0LmNyZWF0ZVJvb3QoKTtcbiAgY29uc3QgYXN0czogYW55W10gPSBBcnJheS5pc0FycmF5KGFzdCkgPyBhc3QgOiBbYXN0XTtcblxuICBhc3RzLmZvckVhY2goKGFzdCkgPT4ge1xuICAgIGlmIChhc3QgaW5zdGFuY2VvZiBvLlN0YXRlbWVudCkge1xuICAgICAgYXN0LnZpc2l0U3RhdGVtZW50KGNvbnZlcnRlciwgY3R4KTtcbiAgICB9IGVsc2UgaWYgKGFzdCBpbnN0YW5jZW9mIG8uRXhwcmVzc2lvbikge1xuICAgICAgYXN0LnZpc2l0RXhwcmVzc2lvbihjb252ZXJ0ZXIsIGN0eCk7XG4gICAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBvLlR5cGUpIHtcbiAgICAgIGFzdC52aXNpdFR5cGUoY29udmVydGVyLCBjdHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYERvbid0IGtub3cgaG93IHRvIHByaW50IGRlYnVnIGluZm8gZm9yICR7YXN0fWApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjdHgudG9Tb3VyY2UoKTtcbn1cblxuZXhwb3J0IHR5cGUgUmVmZXJlbmNlRmlsdGVyID0gKHJlZmVyZW5jZTogby5FeHRlcm5hbFJlZmVyZW5jZSkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGNsYXNzIFR5cGVTY3JpcHRFbWl0dGVyIGltcGxlbWVudHMgT3V0cHV0RW1pdHRlciB7XG4gIGVtaXRTdGF0ZW1lbnRzQW5kQ29udGV4dChcbiAgICAgIGdlbkZpbGVQYXRoOiBzdHJpbmcsIHN0bXRzOiBvLlN0YXRlbWVudFtdLCBwcmVhbWJsZTogc3RyaW5nID0gJycsXG4gICAgICBlbWl0U291cmNlTWFwczogYm9vbGVhbiA9IHRydWUsIHJlZmVyZW5jZUZpbHRlcj86IFJlZmVyZW5jZUZpbHRlcixcbiAgICAgIGltcG9ydEZpbHRlcj86IFJlZmVyZW5jZUZpbHRlcik6IHtzb3VyY2VUZXh0OiBzdHJpbmcsIGNvbnRleHQ6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dH0ge1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IG5ldyBfVHNFbWl0dGVyVmlzaXRvcihyZWZlcmVuY2VGaWx0ZXIsIGltcG9ydEZpbHRlcik7XG5cbiAgICBjb25zdCBjdHggPSBFbWl0dGVyVmlzaXRvckNvbnRleHQuY3JlYXRlUm9vdCgpO1xuXG4gICAgY29udmVydGVyLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10cywgY3R4KTtcblxuICAgIGNvbnN0IHByZWFtYmxlTGluZXMgPSBwcmVhbWJsZSA/IHByZWFtYmxlLnNwbGl0KCdcXG4nKSA6IFtdO1xuICAgIGNvbnZlcnRlci5yZWV4cG9ydHMuZm9yRWFjaCgocmVleHBvcnRzLCBleHBvcnRlZE1vZHVsZU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0c0NvZGUgPVxuICAgICAgICAgIHJlZXhwb3J0cy5tYXAocmVleHBvcnQgPT4gYCR7cmVleHBvcnQubmFtZX0gYXMgJHtyZWV4cG9ydC5hc31gKS5qb2luKCcsJyk7XG4gICAgICBwcmVhbWJsZUxpbmVzLnB1c2goYGV4cG9ydCB7JHtyZWV4cG9ydHNDb2RlfX0gZnJvbSAnJHtleHBvcnRlZE1vZHVsZU5hbWV9JztgKTtcbiAgICB9KTtcblxuICAgIGNvbnZlcnRlci5pbXBvcnRzV2l0aFByZWZpeGVzLmZvckVhY2goKHByZWZpeCwgaW1wb3J0ZWRNb2R1bGVOYW1lKSA9PiB7XG4gICAgICAvLyBOb3RlOiBjYW4ndCB3cml0ZSB0aGUgcmVhbCB3b3JkIGZvciBpbXBvcnQgYXMgaXQgc2NyZXdzIHVwIHN5c3RlbS5qcyBhdXRvIGRldGVjdGlvbi4uLlxuICAgICAgcHJlYW1ibGVMaW5lcy5wdXNoKFxuICAgICAgICAgIGBpbXBgICtcbiAgICAgICAgICBgb3J0ICogYXMgJHtwcmVmaXh9IGZyb20gJyR7aW1wb3J0ZWRNb2R1bGVOYW1lfSc7YCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzbSA9IGVtaXRTb3VyY2VNYXBzID9cbiAgICAgICAgY3R4LnRvU291cmNlTWFwR2VuZXJhdG9yKGdlbkZpbGVQYXRoLCBwcmVhbWJsZUxpbmVzLmxlbmd0aCkudG9Kc0NvbW1lbnQoKSA6XG4gICAgICAgICcnO1xuICAgIGNvbnN0IGxpbmVzID0gWy4uLnByZWFtYmxlTGluZXMsIGN0eC50b1NvdXJjZSgpLCBzbV07XG4gICAgaWYgKHNtKSB7XG4gICAgICAvLyBhbHdheXMgYWRkIGEgbmV3bGluZSBhdCB0aGUgZW5kLCBhcyBzb21lIHRvb2xzIGhhdmUgYnVncyB3aXRob3V0IGl0LlxuICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgfVxuICAgIGN0eC5zZXRQcmVhbWJsZUxpbmVDb3VudChwcmVhbWJsZUxpbmVzLmxlbmd0aCk7XG4gICAgcmV0dXJuIHtzb3VyY2VUZXh0OiBsaW5lcy5qb2luKCdcXG4nKSwgY29udGV4dDogY3R4fTtcbiAgfVxuXG4gIGVtaXRTdGF0ZW1lbnRzKGdlbkZpbGVQYXRoOiBzdHJpbmcsIHN0bXRzOiBvLlN0YXRlbWVudFtdLCBwcmVhbWJsZTogc3RyaW5nID0gJycpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0U3RhdGVtZW50c0FuZENvbnRleHQoZ2VuRmlsZVBhdGgsIHN0bXRzLCBwcmVhbWJsZSkuc291cmNlVGV4dDtcbiAgfVxufVxuXG5cbmNsYXNzIF9Uc0VtaXR0ZXJWaXNpdG9yIGV4dGVuZHMgQWJzdHJhY3RFbWl0dGVyVmlzaXRvciBpbXBsZW1lbnRzIG8uVHlwZVZpc2l0b3Ige1xuICBwcml2YXRlIHR5cGVFeHByZXNzaW9uID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlZmVyZW5jZUZpbHRlcj86IFJlZmVyZW5jZUZpbHRlciwgcHJpdmF0ZSBpbXBvcnRGaWx0ZXI/OiBSZWZlcmVuY2VGaWx0ZXIpIHtcbiAgICBzdXBlcihmYWxzZSk7XG4gIH1cblxuICBpbXBvcnRzV2l0aFByZWZpeGVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgcmVleHBvcnRzID0gbmV3IE1hcDxzdHJpbmcsIHtuYW1lOiBzdHJpbmcsIGFzOiBzdHJpbmd9W10+KCk7XG5cbiAgdmlzaXRUeXBlKHQ6IG8uVHlwZXxudWxsLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCwgZGVmYXVsdFR5cGU6IHN0cmluZyA9ICdhbnknKSB7XG4gICAgaWYgKHQpIHtcbiAgICAgIHRoaXMudHlwZUV4cHJlc3Npb24rKztcbiAgICAgIHQudmlzaXRUeXBlKHRoaXMsIGN0eCk7XG4gICAgICB0aGlzLnR5cGVFeHByZXNzaW9uLS07XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5wcmludChudWxsLCBkZWZhdWx0VHlwZSk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRMaXRlcmFsRXhwcihhc3Q6IG8uTGl0ZXJhbEV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IGFzdC52YWx1ZTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBhc3QudHlwZSAhPSBvLklORkVSUkVEX1RZUEUpIHtcbiAgICAgIGN0eC5wcmludChhc3QsIGAoJHt2YWx1ZX0gYXMgYW55KWApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci52aXNpdExpdGVyYWxFeHByKGFzdCwgY3R4KTtcbiAgfVxuXG5cbiAgLy8gVGVtcG9yYXJ5IHdvcmthcm91bmQgdG8gc3VwcG9ydCBzdHJpY3ROdWxsQ2hlY2sgZW5hYmxlZCBjb25zdW1lcnMgb2YgbmdjIGVtaXQuXG4gIC8vIEluIFNOQyBtb2RlLCBbXSBoYXZlIHRoZSB0eXBlIG5ldmVyW10sIHNvIHdlIGNhc3QgaGVyZSB0byBhbnlbXS5cbiAgLy8gVE9ETzogbmFycm93IHRoZSBjYXN0IHRvIGEgbW9yZSBleHBsaWNpdCB0eXBlLCBvciB1c2UgYSBwYXR0ZXJuIHRoYXQgZG9lcyBub3RcbiAgLy8gc3RhcnQgd2l0aCBbXS5jb25jYXQuIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMTE4NDZcbiAgdmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdDogby5MaXRlcmFsQXJyYXlFeHByLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKGFzdC5lbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY3R4LnByaW50KGFzdCwgJygnKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdCwgY3R4KTtcbiAgICBpZiAoYXN0LmVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjdHgucHJpbnQoYXN0LCAnIGFzIGFueVtdKScpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBvLkV4dGVybmFsRXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHRoaXMuX3Zpc2l0SWRlbnRpZmllcihhc3QudmFsdWUsIGFzdC50eXBlUGFyYW1zLCBjdHgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRBc3NlcnROb3ROdWxsRXhwcihhc3Q6IG8uQXNzZXJ0Tm90TnVsbCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnZpc2l0QXNzZXJ0Tm90TnVsbEV4cHIoYXN0LCBjdHgpO1xuICAgIGN0eC5wcmludChhc3QsICchJyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZpc2l0RGVjbGFyZVZhclN0bXQoc3RtdDogby5EZWNsYXJlVmFyU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGlmIChzdG10Lmhhc01vZGlmaWVyKG8uU3RtdE1vZGlmaWVyLkV4cG9ydGVkKSAmJiBzdG10LnZhbHVlIGluc3RhbmNlb2Ygby5FeHRlcm5hbEV4cHIgJiZcbiAgICAgICAgIXN0bXQudHlwZSkge1xuICAgICAgLy8gY2hlY2sgZm9yIGEgcmVleHBvcnRcbiAgICAgIGNvbnN0IHtuYW1lLCBtb2R1bGVOYW1lfSA9IHN0bXQudmFsdWUudmFsdWU7XG4gICAgICBpZiAobW9kdWxlTmFtZSkge1xuICAgICAgICBsZXQgcmVleHBvcnRzID0gdGhpcy5yZWV4cG9ydHMuZ2V0KG1vZHVsZU5hbWUpO1xuICAgICAgICBpZiAoIXJlZXhwb3J0cykge1xuICAgICAgICAgIHJlZXhwb3J0cyA9IFtdO1xuICAgICAgICAgIHRoaXMucmVleHBvcnRzLnNldChtb2R1bGVOYW1lLCByZWV4cG9ydHMpO1xuICAgICAgICB9XG4gICAgICAgIHJlZXhwb3J0cy5wdXNoKHtuYW1lOiBuYW1lICEsIGFzOiBzdG10Lm5hbWV9KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdG10Lmhhc01vZGlmaWVyKG8uU3RtdE1vZGlmaWVyLkV4cG9ydGVkKSkge1xuICAgICAgY3R4LnByaW50KHN0bXQsIGBleHBvcnQgYCk7XG4gICAgfVxuICAgIGlmIChzdG10Lmhhc01vZGlmaWVyKG8uU3RtdE1vZGlmaWVyLkZpbmFsKSkge1xuICAgICAgY3R4LnByaW50KHN0bXQsIGBjb25zdGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHgucHJpbnQoc3RtdCwgYHZhcmApO1xuICAgIH1cbiAgICBjdHgucHJpbnQoc3RtdCwgYCAke3N0bXQubmFtZX1gKTtcbiAgICB0aGlzLl9wcmludENvbG9uVHlwZShzdG10LnR5cGUsIGN0eCk7XG4gICAgaWYgKHN0bXQudmFsdWUpIHtcbiAgICAgIGN0eC5wcmludChzdG10LCBgID0gYCk7XG4gICAgICBzdG10LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihzdG10LCBgO2ApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRXcmFwcGVkTm9kZUV4cHIoYXN0OiBvLldyYXBwZWROb2RlRXhwcjxhbnk+LCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB2aXNpdCBhIFdyYXBwZWROb2RlRXhwciB3aGVuIG91dHB1dHRpbmcgVHlwZXNjcmlwdC4nKTtcbiAgfVxuXG4gIHZpc2l0Q2FzdEV4cHIoYXN0OiBvLkNhc3RFeHByLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgY3R4LnByaW50KGFzdCwgYCg8YCk7XG4gICAgYXN0LnR5cGUgIS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICBjdHgucHJpbnQoYXN0LCBgPmApO1xuICAgIGFzdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICBjdHgucHJpbnQoYXN0LCBgKWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRJbnN0YW50aWF0ZUV4cHIoYXN0OiBvLkluc3RhbnRpYXRlRXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wcmludChhc3QsIGBuZXcgYCk7XG4gICAgdGhpcy50eXBlRXhwcmVzc2lvbisrO1xuICAgIGFzdC5jbGFzc0V4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGN0eCk7XG4gICAgdGhpcy50eXBlRXhwcmVzc2lvbi0tO1xuICAgIGN0eC5wcmludChhc3QsIGAoYCk7XG4gICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5hcmdzLCBjdHgsICcsJyk7XG4gICAgY3R4LnByaW50KGFzdCwgYClgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RGVjbGFyZUNsYXNzU3RtdChzdG10OiBvLkNsYXNzU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wdXNoQ2xhc3Moc3RtdCk7XG4gICAgaWYgKHN0bXQuaGFzTW9kaWZpZXIoby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQpKSB7XG4gICAgICBjdHgucHJpbnQoc3RtdCwgYGV4cG9ydCBgKTtcbiAgICB9XG4gICAgY3R4LnByaW50KHN0bXQsIGBjbGFzcyAke3N0bXQubmFtZX1gKTtcbiAgICBpZiAoc3RtdC5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgY3R4LnByaW50KHN0bXQsIGAgZXh0ZW5kcyBgKTtcbiAgICAgIHRoaXMudHlwZUV4cHJlc3Npb24rKztcbiAgICAgIHN0bXQucGFyZW50LnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgICAgdGhpcy50eXBlRXhwcmVzc2lvbi0tO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihzdG10LCBgIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgc3RtdC5maWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHRoaXMuX3Zpc2l0Q2xhc3NGaWVsZChmaWVsZCwgY3R4KSk7XG4gICAgaWYgKHN0bXQuY29uc3RydWN0b3JNZXRob2QgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdmlzaXRDbGFzc0NvbnN0cnVjdG9yKHN0bXQsIGN0eCk7XG4gICAgfVxuICAgIHN0bXQuZ2V0dGVycy5mb3JFYWNoKChnZXR0ZXIpID0+IHRoaXMuX3Zpc2l0Q2xhc3NHZXR0ZXIoZ2V0dGVyLCBjdHgpKTtcbiAgICBzdG10Lm1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB0aGlzLl92aXNpdENsYXNzTWV0aG9kKG1ldGhvZCwgY3R4KSk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludGxuKHN0bXQsIGB9YCk7XG4gICAgY3R4LnBvcENsYXNzKCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdENsYXNzRmllbGQoZmllbGQ6IG8uQ2xhc3NGaWVsZCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpIHtcbiAgICBpZiAoZmllbGQuaGFzTW9kaWZpZXIoby5TdG10TW9kaWZpZXIuUHJpdmF0ZSkpIHtcbiAgICAgIC8vIGNvbW1lbnQgb3V0IGFzIGEgd29ya2Fyb3VuZCBmb3IgIzEwOTY3XG4gICAgICBjdHgucHJpbnQobnVsbCwgYC8qcHJpdmF0ZSovIGApO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGFzTW9kaWZpZXIoby5TdG10TW9kaWZpZXIuU3RhdGljKSkge1xuICAgICAgY3R4LnByaW50KG51bGwsICdzdGF0aWMgJyk7XG4gICAgfVxuICAgIGN0eC5wcmludChudWxsLCBmaWVsZC5uYW1lKTtcbiAgICB0aGlzLl9wcmludENvbG9uVHlwZShmaWVsZC50eXBlLCBjdHgpO1xuICAgIGlmIChmaWVsZC5pbml0aWFsaXplcikge1xuICAgICAgY3R4LnByaW50KG51bGwsICcgPSAnKTtcbiAgICAgIGZpZWxkLmluaXRpYWxpemVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihudWxsLCBgO2ApO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDbGFzc0dldHRlcihnZXR0ZXI6IG8uQ2xhc3NHZXR0ZXIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KSB7XG4gICAgaWYgKGdldHRlci5oYXNNb2RpZmllcihvLlN0bXRNb2RpZmllci5Qcml2YXRlKSkge1xuICAgICAgY3R4LnByaW50KG51bGwsIGBwcml2YXRlIGApO1xuICAgIH1cbiAgICBjdHgucHJpbnQobnVsbCwgYGdldCAke2dldHRlci5uYW1lfSgpYCk7XG4gICAgdGhpcy5fcHJpbnRDb2xvblR5cGUoZ2V0dGVyLnR5cGUsIGN0eCk7XG4gICAgY3R4LnByaW50bG4obnVsbCwgYCB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKGdldHRlci5ib2R5LCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihudWxsLCBgfWApO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDbGFzc0NvbnN0cnVjdG9yKHN0bXQ6IG8uQ2xhc3NTdG10LCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCkge1xuICAgIGN0eC5wcmludChzdG10LCBgY29uc3RydWN0b3IoYCk7XG4gICAgdGhpcy5fdmlzaXRQYXJhbXMoc3RtdC5jb25zdHJ1Y3Rvck1ldGhvZC5wYXJhbXMsIGN0eCk7XG4gICAgY3R4LnByaW50bG4oc3RtdCwgYCkge2ApO1xuICAgIGN0eC5pbmNJbmRlbnQoKTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LmNvbnN0cnVjdG9yTWV0aG9kLmJvZHksIGN0eCk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludGxuKHN0bXQsIGB9YCk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdENsYXNzTWV0aG9kKG1ldGhvZDogby5DbGFzc01ldGhvZCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpIHtcbiAgICBpZiAobWV0aG9kLmhhc01vZGlmaWVyKG8uU3RtdE1vZGlmaWVyLlByaXZhdGUpKSB7XG4gICAgICBjdHgucHJpbnQobnVsbCwgYHByaXZhdGUgYCk7XG4gICAgfVxuICAgIGN0eC5wcmludChudWxsLCBgJHttZXRob2QubmFtZX0oYCk7XG4gICAgdGhpcy5fdmlzaXRQYXJhbXMobWV0aG9kLnBhcmFtcywgY3R4KTtcbiAgICBjdHgucHJpbnQobnVsbCwgYClgKTtcbiAgICB0aGlzLl9wcmludENvbG9uVHlwZShtZXRob2QudHlwZSwgY3R4LCAndm9pZCcpO1xuICAgIGN0eC5wcmludGxuKG51bGwsIGAge2ApO1xuICAgIGN0eC5pbmNJbmRlbnQoKTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhtZXRob2QuYm9keSwgY3R4KTtcbiAgICBjdHguZGVjSW5kZW50KCk7XG4gICAgY3R4LnByaW50bG4obnVsbCwgYH1gKTtcbiAgfVxuXG4gIHZpc2l0RnVuY3Rpb25FeHByKGFzdDogby5GdW5jdGlvbkV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBpZiAoYXN0Lm5hbWUpIHtcbiAgICAgIGN0eC5wcmludChhc3QsICdmdW5jdGlvbiAnKTtcbiAgICAgIGN0eC5wcmludChhc3QsIGFzdC5uYW1lKTtcbiAgICB9XG4gICAgY3R4LnByaW50KGFzdCwgYChgKTtcbiAgICB0aGlzLl92aXNpdFBhcmFtcyhhc3QucGFyYW1zLCBjdHgpO1xuICAgIGN0eC5wcmludChhc3QsIGApYCk7XG4gICAgdGhpcy5fcHJpbnRDb2xvblR5cGUoYXN0LnR5cGUsIGN0eCwgJ3ZvaWQnKTtcbiAgICBpZiAoIWFzdC5uYW1lKSB7XG4gICAgICBjdHgucHJpbnQoYXN0LCBgID0+IGApO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihhc3QsICd7Jyk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKGFzdC5zdGF0ZW1lbnRzLCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnQoYXN0LCBgfWApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdERlY2xhcmVGdW5jdGlvblN0bXQoc3RtdDogby5EZWNsYXJlRnVuY3Rpb25TdG10LCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKHN0bXQuaGFzTW9kaWZpZXIoby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQpKSB7XG4gICAgICBjdHgucHJpbnQoc3RtdCwgYGV4cG9ydCBgKTtcbiAgICB9XG4gICAgY3R4LnByaW50KHN0bXQsIGBmdW5jdGlvbiAke3N0bXQubmFtZX0oYCk7XG4gICAgdGhpcy5fdmlzaXRQYXJhbXMoc3RtdC5wYXJhbXMsIGN0eCk7XG4gICAgY3R4LnByaW50KHN0bXQsIGApYCk7XG4gICAgdGhpcy5fcHJpbnRDb2xvblR5cGUoc3RtdC50eXBlLCBjdHgsICd2b2lkJyk7XG4gICAgY3R4LnByaW50bG4oc3RtdCwgYCB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuc3RhdGVtZW50cywgY3R4KTtcbiAgICBjdHguZGVjSW5kZW50KCk7XG4gICAgY3R4LnByaW50bG4oc3RtdCwgYH1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0VHJ5Q2F0Y2hTdG10KHN0bXQ6IG8uVHJ5Q2F0Y2hTdG10LCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgY3R4LnByaW50bG4oc3RtdCwgYHRyeSB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuYm9keVN0bXRzLCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihzdG10LCBgfSBjYXRjaCAoJHtDQVRDSF9FUlJPUl9WQVIubmFtZX0pIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgY29uc3QgY2F0Y2hTdG10cyA9XG4gICAgICAgIFs8by5TdGF0ZW1lbnQ+Q0FUQ0hfU1RBQ0tfVkFSLnNldChDQVRDSF9FUlJPUl9WQVIucHJvcCgnc3RhY2snLCBudWxsKSkudG9EZWNsU3RtdChudWxsLCBbXG4gICAgICAgICAgby5TdG10TW9kaWZpZXIuRmluYWxcbiAgICAgICAgXSldLmNvbmNhdChzdG10LmNhdGNoU3RtdHMpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKGNhdGNoU3RtdHMsIGN0eCk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludGxuKHN0bXQsIGB9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEJ1aWx0aW5UeXBlKHR5cGU6IG8uQnVpbHRpblR5cGUsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBsZXQgdHlwZVN0cjogc3RyaW5nO1xuICAgIHN3aXRjaCAodHlwZS5uYW1lKSB7XG4gICAgICBjYXNlIG8uQnVpbHRpblR5cGVOYW1lLkJvb2w6XG4gICAgICAgIHR5cGVTdHIgPSAnYm9vbGVhbic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5UeXBlTmFtZS5EeW5hbWljOlxuICAgICAgICB0eXBlU3RyID0gJ2FueSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5UeXBlTmFtZS5GdW5jdGlvbjpcbiAgICAgICAgdHlwZVN0ciA9ICdGdW5jdGlvbic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5UeXBlTmFtZS5OdW1iZXI6XG4gICAgICAgIHR5cGVTdHIgPSAnbnVtYmVyJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG8uQnVpbHRpblR5cGVOYW1lLkludDpcbiAgICAgICAgdHlwZVN0ciA9ICdudW1iZXInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugby5CdWlsdGluVHlwZU5hbWUuU3RyaW5nOlxuICAgICAgICB0eXBlU3RyID0gJ3N0cmluZyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBidWlsdGluIHR5cGUgJHt0eXBlLm5hbWV9YCk7XG4gICAgfVxuICAgIGN0eC5wcmludChudWxsLCB0eXBlU3RyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RXhwcmVzc2lvblR5cGUoYXN0OiBvLkV4cHJlc3Npb25UeXBlLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgYXN0LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRBcnJheVR5cGUodHlwZTogby5BcnJheVR5cGUsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICB0aGlzLnZpc2l0VHlwZSh0eXBlLm9mLCBjdHgpO1xuICAgIGN0eC5wcmludChudWxsLCBgW11gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0TWFwVHlwZSh0eXBlOiBvLk1hcFR5cGUsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnQobnVsbCwgYHtba2V5OiBzdHJpbmddOmApO1xuICAgIHRoaXMudmlzaXRUeXBlKHR5cGUudmFsdWVUeXBlLCBjdHgpO1xuICAgIGN0eC5wcmludChudWxsLCBgfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0QnVpbHRpbk1ldGhvZE5hbWUobWV0aG9kOiBvLkJ1aWx0aW5NZXRob2QpOiBzdHJpbmcge1xuICAgIGxldCBuYW1lOiBzdHJpbmc7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2Ugby5CdWlsdGluTWV0aG9kLkNvbmNhdEFycmF5OlxuICAgICAgICBuYW1lID0gJ2NvbmNhdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5NZXRob2QuU3Vic2NyaWJlT2JzZXJ2YWJsZTpcbiAgICAgICAgbmFtZSA9ICdzdWJzY3JpYmUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugby5CdWlsdGluTWV0aG9kLkJpbmQ6XG4gICAgICAgIG5hbWUgPSAnYmluZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGJ1aWx0aW4gbWV0aG9kOiAke21ldGhvZH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdFBhcmFtcyhwYXJhbXM6IG8uRm5QYXJhbVtdLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IHZvaWQge1xuICAgIHRoaXMudmlzaXRBbGxPYmplY3RzKHBhcmFtID0+IHtcbiAgICAgIGN0eC5wcmludChudWxsLCBwYXJhbS5uYW1lKTtcbiAgICAgIHRoaXMuX3ByaW50Q29sb25UeXBlKHBhcmFtLnR5cGUsIGN0eCk7XG4gICAgfSwgcGFyYW1zLCBjdHgsICcsJyk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdElkZW50aWZpZXIoXG4gICAgICB2YWx1ZTogby5FeHRlcm5hbFJlZmVyZW5jZSwgdHlwZVBhcmFtczogby5UeXBlW118bnVsbCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiB2b2lkIHtcbiAgICBjb25zdCB7bmFtZSwgbW9kdWxlTmFtZX0gPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5yZWZlcmVuY2VGaWx0ZXIgJiYgdGhpcy5yZWZlcmVuY2VGaWx0ZXIodmFsdWUpKSB7XG4gICAgICBjdHgucHJpbnQobnVsbCwgJyhudWxsIGFzIGFueSknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1vZHVsZU5hbWUgJiYgKCF0aGlzLmltcG9ydEZpbHRlciB8fCAhdGhpcy5pbXBvcnRGaWx0ZXIodmFsdWUpKSkge1xuICAgICAgbGV0IHByZWZpeCA9IHRoaXMuaW1wb3J0c1dpdGhQcmVmaXhlcy5nZXQobW9kdWxlTmFtZSk7XG4gICAgICBpZiAocHJlZml4ID09IG51bGwpIHtcbiAgICAgICAgcHJlZml4ID0gYGkke3RoaXMuaW1wb3J0c1dpdGhQcmVmaXhlcy5zaXplfWA7XG4gICAgICAgIHRoaXMuaW1wb3J0c1dpdGhQcmVmaXhlcy5zZXQobW9kdWxlTmFtZSwgcHJlZml4KTtcbiAgICAgIH1cbiAgICAgIGN0eC5wcmludChudWxsLCBgJHtwcmVmaXh9LmApO1xuICAgIH1cbiAgICBjdHgucHJpbnQobnVsbCwgbmFtZSAhKTtcblxuICAgIGlmICh0aGlzLnR5cGVFeHByZXNzaW9uID4gMCkge1xuICAgICAgLy8gSWYgd2UgYXJlIGluIGEgdHlwZSBleHByZXNzaW9uIHRoYXQgcmVmZXJzIHRvIGEgZ2VuZXJpYyB0eXBlIHRoZW4gc3VwcGx5XG4gICAgICAvLyB0aGUgcmVxdWlyZWQgdHlwZSBwYXJhbWV0ZXJzLiBJZiB0aGVyZSB3ZXJlIG5vdCBlbm91Z2ggdHlwZSBwYXJhbWV0ZXJzXG4gICAgICAvLyBzdXBwbGllZCwgc3VwcGx5IGFueSBhcyB0aGUgdHlwZS4gT3V0c2lkZSBhIHR5cGUgZXhwcmVzc2lvbiB0aGUgcmVmZXJlbmNlXG4gICAgICAvLyBzaG91bGQgbm90IHN1cHBseSB0eXBlIHBhcmFtZXRlcnMgYW5kIGJlIHRyZWF0ZWQgYXMgYSBzaW1wbGUgdmFsdWUgcmVmZXJlbmNlXG4gICAgICAvLyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gaXRzZWxmLlxuICAgICAgY29uc3Qgc3VwcGxpZWRQYXJhbWV0ZXJzID0gdHlwZVBhcmFtcyB8fCBbXTtcbiAgICAgIGlmIChzdXBwbGllZFBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdHgucHJpbnQobnVsbCwgYDxgKTtcbiAgICAgICAgdGhpcy52aXNpdEFsbE9iamVjdHModHlwZSA9PiB0eXBlLnZpc2l0VHlwZSh0aGlzLCBjdHgpLCB0eXBlUGFyYW1zICEsIGN0eCwgJywnKTtcbiAgICAgICAgY3R4LnByaW50KG51bGwsIGA+YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcHJpbnRDb2xvblR5cGUodHlwZTogby5UeXBlfG51bGwsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0LCBkZWZhdWx0VHlwZT86IHN0cmluZykge1xuICAgIGlmICh0eXBlICE9PSBvLklORkVSUkVEX1RZUEUpIHtcbiAgICAgIGN0eC5wcmludChudWxsLCAnOicpO1xuICAgICAgdGhpcy52aXNpdFR5cGUodHlwZSwgY3R4LCBkZWZhdWx0VHlwZSk7XG4gICAgfVxuICB9XG59XG4iXX0=