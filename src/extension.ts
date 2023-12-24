// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provider = new InputAreaViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            InputAreaViewProvider.viewType,
            provider
        )
    );
}

class InputAreaViewProvider implements vscode.WebviewViewProvider {
    // 表示させるviewのid
    public static readonly viewType = "vscodeExtensionTest.sampleView";

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}
    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // webviewView.webview.onDidReceiveMessage(data => {
        // 	switch (data.type) {
        // 		case 'colorSelected':
        // 			{
        // 				vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
        // 				break;
        // 			}
        // 	}
        // });
    }
    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
        );

        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
        );
        const nonce = getNonce();

        return `<!DOCTYPE html>
				<html lang="ja">
				<head>
					<meta charset="UTF-8">	
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>sample</title>
					<link href="${styleMainUri}" rel="stylesheet">
					
				</head>
				<body>
					<textarea id="sample-textarea"></textarea><br>
					<button id="run-button">実行</button>
					
					<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
				</html>`;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
