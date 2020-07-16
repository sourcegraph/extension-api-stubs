import * as sinon from 'sinon'
import { createStubExtensionContext } from './context'

describe('createStubExtensionContext()', () => {
    it('should create an extension context', () => {
        const context = createStubExtensionContext()
        const cleanup = sinon.spy(() => {})
        context.subscriptions.add(cleanup)
        sinon.assert.notCalled(cleanup)
        sinon.assert.calledOnce(context.subscriptions.add)
        context.subscriptions.unsubscribe()
        sinon.assert.calledOnce(cleanup)
    })
})
