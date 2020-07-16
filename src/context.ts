import { Subscription } from 'rxjs'
import * as sinon from 'sinon'
import { ExtensionContext } from 'sourcegraph'
import { subtypeOf } from './util'

export const createStubExtensionContext = () => {
    const subscriptions = sinon.stub(new Subscription())
    subscriptions.add.callThrough()
    subscriptions.remove.callThrough()
    subscriptions.unsubscribe.callThrough()
    const context = subtypeOf<ExtensionContext>()({
        subscriptions,
    })
    return context
}
