import { Location, MarkupKind, NotificationType, Position, Range, Selection } from '@sourcegraph/extension-api-classes'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { mapTo } from 'rxjs/operators'
import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { deprecate } from 'util'

interface DeprecatedTypeDefinitionProvider {
    provideTypeDefinition(
        document: sourcegraph.TextDocument,
        position: Position
    ): sourcegraph.ProviderResult<sourcegraph.Definition>
}

interface DeprecatedImplementationProvider {
    provideImplementation(
        document: sourcegraph.TextDocument,
        position: Position
    ): sourcegraph.ProviderResult<sourcegraph.Definition>
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
        // Classes
        URI: URL,
        Position,
        Range,
        Location,
        Selection,

        // Enums
        MarkupKind,
        NotificationType,

        // Namespaces
        internal: {
            sourcegraphURL: 'https://sourcegraph.test',
        },
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
                deprecate(
                    (selector: sourcegraph.DocumentSelector, provider: DeprecatedTypeDefinitionProvider) =>
                        new Subscription(),
                    'sourcegraph.languages.registerTypeDefinitionProvider() is deprecated. Use sourcegraph.languages.registerLocationProvider() instead.'
                )
            ),
            registerImplementationProvider: sinon.spy(
                deprecate(
                    (selector: sourcegraph.DocumentSelector, provider: DeprecatedImplementationProvider) =>
                        new Subscription(),
                    'sourcegraph.languages.registerImplementationProvider() is deprecated. Use sourcegraph.languages.registerLocationProvider() instead.'
                )
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
