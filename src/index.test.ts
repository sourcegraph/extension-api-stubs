import assert from 'assert'
import * as sinon from 'sinon'
import { createStubExtensionContext, createStubSourcegraphAPI } from '.'

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
    // describe('languages', () => {
    //     // TODO fix Position/Range classes (publish as package) and MarkupKind enum assignability
    //     it('should allow registering a hover provider', () => {
    //         const stub = createStubSourcegraphAPI()
    //         stub.languages.registerHoverProvider(['*.ts'], {
    //             provideHover: (doc, pos) => ({
    //                 contents: { kind: stub.MarkupKind.Markdown, value: doc.uri },
    //                 range: new stub.Range(new stub.Position(1, 2), new stubs.Position(3, 4)),
    //             }),
    //         })
    //     })
    // })
})

describe('createStubExtensionContext()', () => {
    it('should create an extension context', () => {
        const ctx = createStubExtensionContext()
        const fn = sinon.spy()
        ctx.subscriptions.add(fn)
        sinon.assert.notCalled(fn)
        sinon.assert.calledOnce(ctx.subscriptions.add)
        ctx.subscriptions.unsubscribe()
        sinon.assert.calledOnce(fn)
    })
})
