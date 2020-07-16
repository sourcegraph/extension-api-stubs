import assert from 'assert'
import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { createStubSourcegraphAPI } from './api'

describe('createStubSourcegraphAPI()', () => {
    it('should return a stub API', () => {
        const stub = createStubSourcegraphAPI()
        assert(stub)
    })
    describe('app', () => {
        it('should support creating unique decorationTypes', () => {
            const stub = createStubSourcegraphAPI()
            assert.deepStrictEqual(stub.app.createDecorationType(), { key: 'decorationType0' })
            assert.deepStrictEqual(stub.app.createDecorationType(), { key: 'decorationType1' })
            assert.deepStrictEqual(stub.app.createDecorationType(), { key: 'decorationType2' })
        })
        it('should support managing the active Window', () => {
            const stub = createStubSourcegraphAPI()
            const newWindow = {} as sourcegraph.Window
            assert.strictEqual(stub.app.activeWindow, undefined)
            stub.app.activeWindowChanges.next(newWindow)
            assert.strictEqual(stub.app.activeWindow, newWindow)
        })
    })
    describe('configuration', () => {
        it('should support reading configuration', async () => {
            const stub = createStubSourcegraphAPI()
            assert.deepStrictEqual(stub.configuration.get().value, {})
            const listener = sinon.spy()
            stub.configuration.subscribe(listener)
            sinon.assert.calledOnce(listener)
            assert.deepStrictEqual(listener.args[0][0], undefined)
            await stub.configuration.get().update('foo', 'bar')
            assert.deepStrictEqual(stub.configuration.get().value, { foo: 'bar' })
            assert.deepStrictEqual(stub.configuration.get().get('foo'), 'bar')
            sinon.assert.calledTwice(listener)
            assert.deepStrictEqual(listener.args[1][0], undefined)
        })
    })
    describe('languages', () => {
        it('should allow registering a hover provider', () => {
            const stub = createStubSourcegraphAPI()
            stub.languages.registerHoverProvider(['*.ts'], {
                provideHover: (textDocument, position) => ({
                    contents: { kind: stub.MarkupKind.Markdown, value: `${textDocument.uri}:${position.line}:${position.character}` },
                    range: new stub.Range(new stub.Position(1, 2), new stub.Position(3, 4)),
                }),
            })
        })
    })
})
