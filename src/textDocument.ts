import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { notImplemented, subtypeOf } from './util'

/**
 * Creates a stub TextDocument.
 *
 */
export const createStubTextDocument = (init: Pick<sourcegraph.TextDocument, 'languageId' | 'text' | 'uri'>) => {
    const textDocument = subtypeOf<sourcegraph.TextDocument>()({
        ...init,
        // TODO share the implementation of these methods with the real implementations
        getWordRangeAtPosition: sinon.spy<(position: sourcegraph.Position) => sourcegraph.Range | undefined>(
            notImplemented
        ),
        validatePosition: sinon.spy<(position: sourcegraph.Position) => sourcegraph.Position>(notImplemented),
        offsetAt: sinon.spy<(position: sourcegraph.Position) => number>(notImplemented),
        positionAt: sinon.spy<(offset: number) => sourcegraph.Position>(notImplemented),
        validateRange: sinon.spy<(range: sourcegraph.Range) => sourcegraph.Range>(notImplemented),
        getText: sinon.spy<(range?: sourcegraph.Range) => string | undefined>(notImplemented),
    })
    return textDocument
}
