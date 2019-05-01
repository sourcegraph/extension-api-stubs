import * as sinon from 'sinon'
import { createStubExtensionContext } from './context'

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
