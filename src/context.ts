import { Subscription } from 'rxjs'
import * as sinon from 'sinon'
import { ExtensionContext } from 'sourcegraph'
import { subTypeOf } from './util'

export const createStubExtensionContext = () => {
    const subscriptions = sinon.stub(new Subscription())
    subscriptions.add.callThrough()
    subscriptions.remove.callThrough()
    subscriptions.unsubscribe.callThrough()
    const context = subTypeOf<ExtensionContext>()({
        subscriptions,
    })
    return context
}
