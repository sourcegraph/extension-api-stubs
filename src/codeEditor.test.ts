import { Position, Range, Selection } from '@sourcegraph/extension-api-classes'
import assert from 'assert'
import * as sinon from 'sinon'
import { createStubCodeEditor } from './codeEditor'
import { createStubTextDocument } from './textDocument'

describe('createStubCodeEditor()', () => {
    it('should create a stub CodeEditor', () => {
        const stub = createStubCodeEditor({
            document: createStubTextDocument({ languageId: 'foo', text: 'bla', uri: 'foo:bar' }),
        })

        assert.strictEqual(stub.type, 'CodeEditor')

        assert.strictEqual(stub.selection, null)
        const newSelections = [new Selection(new Position(0, 1), new Position(1, 2))]
        stub.selectionsChanges.next(newSelections)
        assert.strictEqual(stub.selections, newSelections)
        assert.strictEqual(stub.selection, newSelections[0])

        stub.setDecorations({ key: 'foo' }, [{ range: new Range(0, 1, 2, 3), border: 'red' }])
        sinon.assert.calledOnce(stub.setDecorations)
    })
})
