import { BehaviorSubject } from 'rxjs'
import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { subTypeOf } from './util'

export const createStubCodeEditor = ({
    document,
    selections = [],
}: Pick<sourcegraph.CodeEditor, 'document'> & Partial<Pick<sourcegraph.CodeEditor, 'selections'>>) => {
    const codeEditor = subTypeOf<sourcegraph.CodeEditor>()({
        type: 'CodeEditor' as const,
        document,
        get selections(): sourcegraph.Selection[] {
            return this.selectionsChanges.value
        },
        get selection(): sourcegraph.Selection | null {
            return this.selections[0] || null
        },
        selectionsChanges: new BehaviorSubject<sourcegraph.Selection[]>(selections),
        setDecorations: sinon.spy(
            (
                decorationType: sourcegraph.TextDocumentDecorationType,
                decorations: sourcegraph.TextDocumentDecoration[]
            ): void => undefined
        ),
    })
    return codeEditor
}
