import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

export type ComponentMeta = {
    title?: string;
    componentName?: string;
    summary?: string;
    props?: { name: string; description?: string }[];
};

export async function extractComponentMetadata(storyFilePath: string): Promise<ComponentMeta | null> {
    const project = new Project();
    const source = project.addSourceFileAtPath(path.resolve(storyFilePath));

    const result: ComponentMeta = { props: [] };

    // Get default export object (Meta)
    const defaultExport = source.getDefaultExportSymbol();
    if (!defaultExport) return null;

    const exportDecl = defaultExport.getDeclarations()[0];
    const metaObj = exportDecl.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
    if (!metaObj) return null;

    // 1. Get `title`
    const titleProp = metaObj.getProperty('title');
    if (titleProp?.getKind() === SyntaxKind.PropertyAssignment) {
        const titleText = titleProp.getFirstDescendantByKind(SyntaxKind.StringLiteral)?.getLiteralValue();
        result.title = titleText;
    }

    // 2. Get `component` name
    const componentProp = metaObj.getProperty('component');
    let componentName = '';
    if (componentProp?.getKind() === SyntaxKind.PropertyAssignment) {
        const id = componentProp.getFirstDescendantByKind(SyntaxKind.Identifier);
        if (id) {
            componentName = id.getText();
            result.componentName = componentName;
        }
    }

    // 3. Resolve the component's file
    const importDecl = source.getImportDeclarations().find(decl =>
        decl.getNamedImports().some(named => named.getName() === componentName) ||
        decl.getDefaultImport()?.getText() === componentName
    );

    if (!importDecl) return result; // no import found

    const importPath = importDecl.getModuleSpecifierValue();
    const storyDir = path.dirname(storyFilePath);
    const resolvedComponentPath = path.resolve(storyDir, importPath);

    const componentSource = project.addSourceFileAtPath(`${resolvedComponentPath}.tsx`);

    // 4. Get the component function/class declaration
    const componentDecl =
        componentSource.getFunction(componentName) ||
        componentSource.getVariableDeclaration(componentName);

    let componentJsDoc: string | undefined;

    if (componentDecl) {
        const kind = componentDecl.getKind();

        if (kind === SyntaxKind.FunctionDeclaration || kind === SyntaxKind.ClassDeclaration) {
            componentJsDoc = (componentDecl as any).getJsDocs?.()[0]?.getDescription().trim();
        }

        if (kind === SyntaxKind.VariableDeclaration) {
            const initializer = (componentDecl as any).getInitializer?.();

            if (initializer) {
                const initKind = initializer.getKind();

                if (
                    initKind === SyntaxKind.ArrowFunction ||
                    initKind === SyntaxKind.FunctionExpression
                ) {
                    componentJsDoc = initializer.getJsDocs?.()[0]?.getDescription().trim();
                }
            }
        }
    }

    result.summary = componentJsDoc;

    // 5. Try to find inline interface
    const propsTypeName = componentDecl?.getType().getSymbol()?.getName(); // not always reliable
    const interfaces = componentSource.getInterfaces();
    for (const iface of interfaces) {
        if (!propsTypeName || iface.getName() === propsTypeName) {
            result.props?.push(
                ...iface.getProperties().map(prop => ({
                    name: prop.getName(),
                    description: prop.getJsDocs()[0]?.getDescription().trim(),
                }))
            );
            break;
        }
    }

    return result;
}