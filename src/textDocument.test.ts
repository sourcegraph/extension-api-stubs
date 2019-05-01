import assert from 'assert'
import * as sinon from 'sinon'
import { createStubTextDocument } from './textDocument'

describe('createStubTextDocument()', () => {
    it('should create a stub TextDocument', () => {
        const uri = 'foo:bar'
        const languageId = 'foo'
        const text = 'bla'
        const stub = createStubTextDocument({ uri, languageId, text })
        assert.strictEqual(stub.uri, uri)
        assert.strictEqual(stub.languageId, languageId)
        assert.strictEqual(stub.text, text)
        // not implemented spies
        sinon.assert.notCalled(stub.getWordRangeAtPosition)
        sinon.assert.notCalled(stub.positionAt)
        sinon.assert.notCalled(stub.validatePosition)
        sinon.assert.notCalled(stub.validateRange)
    })
})
