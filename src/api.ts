import {
    Location,
    MarkupKind,
    NotificationType,
    Position,
    Range,
    Selection,
    DocumentHighlightKind,
} from '@sourcegraph/extension-api-classes'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { mapTo } from 'rxjs/operators'
import * as sinon from 'sinon'
import * as sourcegraph from 'sourcegraph'
import { notImplemented, subtypeOf } from './util'

let decorationTypeCounter = 0
let statusBarItemTypeCounter = 0

/**
 * Creates an object that (mostly) implements the Sourcegraph API,
 * with all methods being Sinon spys and all Subscribables being Subjects.
 */
export const createStubSourcegraphAPI = () => {
    const configSubject = new BehaviorSubject<any>({})
    const rootChanges = new Subject<void>()
    const openedTextDocuments = new Subject<sourcegraph.TextDocument>()
    const stubs = subtypeOf<typeof import('sourcegraph')>()({
        // Classes
        URI: URL,
        Position,
        Range,
        Location,
        Selection,

        // Enums
        MarkupKind,
        NotificationType,
        DocumentHighlightKind,

        // Namespaces
        internal: {
            sourcegraphURL: new URL('https://sourcegraph.test'),
            clientApplication: 'sourcegraph' as const,
            sync: () => Promise.resolve(),
            updateContext: sinon.spy((updates: sourcegraph.ContextValues): void => undefined),
        },
        workspace: {
            onDidOpenTextDocument: openedTextDocuments,
            openedTextDocuments,
            textDocuments: [] as sourcegraph.TextDocument[],
            onDidChangeRoots: rootChanges,
            rootChanges,
            roots: [] as sourcegraph.WorkspaceRoot[],
            versionContextChanges: new BehaviorSubject(undefined),
            get versionContext() {
                return this.versionContextChanges.value
            },
            searchContextChanges: new BehaviorSubject(undefined),
            get searchContext() {
                return this.searchContextChanges.value
            },
        },
        languages: {
            registerHoverProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.HoverProvider) => new Subscription()
            ),
            registerDefinitionProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.DefinitionProvider) => new Subscription()
            ),
            registerLocationProvider: sinon.spy(
                (id: string, selector: sourcegraph.DocumentSelector, provider: sourcegraph.LocationProvider) =>
                    new Subscription()
            ),
            registerReferenceProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.ReferenceProvider) => new Subscription()
            ),
            registerCompletionItemProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.CompletionItemProvider) =>
                    new Subscription()
            ),
            registerDocumentHighlightProvider: sinon.spy(
                (selector: sourcegraph.DocumentSelector, provider: sourcegraph.DocumentHighlightProvider) =>
                    new Subscription()
            ),
        },
        app: {
            windows: [] as sourcegraph.Window[],
            get activeWindow(): sourcegraph.Window | undefined {
                return this.activeWindowChanges.value
            },
            activeWindowChanges: new BehaviorSubject<sourcegraph.Window | undefined>(undefined),

            registerViewProvider: sinon.spy((id: string, provider: sourcegraph.ViewProvider) => new Subscription()),

            createDecorationType: () => ({ key: `decorationType${decorationTypeCounter++}` }),
            createPanelView: notImplemented as (id: string) => sourcegraph.PanelView,
            registerFileDecorationProvider: sinon.spy(
                (provider: sourcegraph.FileDecorationProvider) => new Subscription()
            ),
            createStatusBarItemType: () => ({ key: `statusBarItemType${statusBarItemTypeCounter++}` }),
            log: sinon.spy((message?: any, ...optionalParameters: any[]) => {}),
        },
        configuration: Object.assign(configSubject.pipe(mapTo(undefined)), {
            get: <C extends object = { [key: string]: any }>(): sourcegraph.Configuration<C> => ({
                get: <K extends keyof C>(key: K): Readonly<C[K]> | undefined => configSubject.value[key],
                update: async <K extends keyof C>(key: K, value: C[K] | undefined): Promise<void> => {
                    configSubject.next({ ...configSubject.value, [key]: value })
                },
                get value(): Readonly<C> {
                    return configSubject.value
                },
            }),
        }),
        content: {
            registerLinkPreviewProvider: sinon.spy(
                (urlMatchPattern: string, provider: sourcegraph.LinkPreviewProvider) => new Subscription()
            ),
        },
        search: {
            registerQueryTransformer: sinon.spy((provider: sourcegraph.QueryTransformer) => new Subscription()),
        },
        commands: {
            registerCommand: sinon.spy((command: string, callback: (...args: any[]) => any) => new Subscription()),
            executeCommand: sinon.spy<(command: string, ...args: any[]) => Promise<any>>(notImplemented),
        },
        graphQL: {
            execute: notImplemented as <TResult, TVariables extends object>(
                request: string,
                variables: TVariables
            ) => Promise<sourcegraph.graphQL.GraphQLResult<TResult>>,
        },
    })
    return stubs
}
