import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { mapTo } from 'rxjs/operators'
import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { MarkupKind } from 'vscode-languageserver-types'

const URI = URL
type URI = URL

// TODO publish actual classes of these!
class Position {
    constructor(public line: number, public character: number) {}
}
class Range {
    constructor(public start: Position, public end: Position) {}
}
class Location {
    constructor(public uri: URI, public range: Range) {}
}
class Selection {
    constructor(public anchor: Position, public active: Position) {}
}

let decorationTypeCounter = 0

/**
 * Creates an object that (mostly) implements the Sourcegraph API,
 * with all methods being Sinon spys and all Subscribables being Subjects.
 */
export const createStubSourcegraphAPI = () => {
    const configSubject = new BehaviorSubject<any>({})
    const rootChanges = new Subject<void>()
    const openedTextDocuments = new Subject<sourcegraph.TextDocument>()
    // const shims: typeof import('sourcegraph') = {
    const stubs = {
        internal: {
            sourcegraphURL: 'https://sourcegraph.test',
        },
        URI,
        Position,
        Range,
        Location,
        Selection,
        MarkupKind,
        workspace: {
            onDidOpenTextDocument: openedTextDocuments,
            openedTextDocuments,
            textDocuments: [] as sourcegraph.TextDocument[],
            onDidChangeRoots: rootChanges,
            rootChanges,
            roots: [] as sourcegraph.WorkspaceRoot[],
        },
        languages: {
            registerHoverProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.HoverProvider) => new Subscription()
            ),
            registerDefinitionProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.DefinitionProvider) => new Subscription()
            ),
            registerLocationProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.LocationProvider) => new Subscription()
            ),
            registerReferenceProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.ReferenceProvider) => new Subscription()
            ),
            registerTypeDefinitionProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.TypeDefinitionProvider) =>
                    new Subscription()
            ),
            registerImplementationProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.ImplementationProvider) =>
                    new Subscription()
            ),
        },
        app: {
            createDecorationType: () => ({ key: 'decorationType' + decorationTypeCounter++ }),
        },
        configuration: {
            get: <C extends object = { [key: string]: any }>() => ({
                get: <K extends keyof C>(key: K): Readonly<C[K]> | undefined => configSubject.value[key],

                update: async <K extends keyof C>(key: K, value: C[K] | undefined): Promise<void> => {
                    configSubject.next({ ...configSubject.value, [key]: value })
                },

                get value(): Readonly<C> {
                    return configSubject.value
                },
            }),
            subscribe: (next: () => void) => configSubject.pipe(mapTo(undefined)).subscribe(next),
        },
        search: {}, // TODO
        commands: {}, // TODO
    }
    return stubs
}

export const createStubExtensionContext = () => {
    const subscriptions = sinon.stub(new Subscription())
    subscriptions.add.callThrough()
    subscriptions.remove.callThrough()
    subscriptions.unsubscribe.callThrough()
    const context = {
        subscriptions,
    }
    return context
}
