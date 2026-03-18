import * as vscode from 'vscode';
import { evaluate } from './calculator';

export class CalculatorWebviewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private history: { expression: string; result: string }[] = [];

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'calculate':
                    {
                        try {
                            const result = evaluate(data.value);
                            this.addHistory(data.value, result);
                        } catch (error: any) {
                            vscode.window.showErrorMessage(`Calculation Error: ${error.message}`);
                        }
                        break;
                    }
                case 'copy':
                    {
                        vscode.env.clipboard.writeText(data.value);
                        vscode.window.showInformationMessage(`Copied to clipboard: ${data.value}`);
                        break;
                    }
            }
        });
    }

    public addHistory(expression: string, result: string) {
        this.history.unshift({ expression, result });
        this._updateWebview();
    }

    public clearHistory() {
        this.history = [];
        this._updateWebview();
    }

    private _updateWebview() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'updateHistory', history: this.history });
        }
    }

    private _getHtmlForWebview() {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Calculator</title>
            <style>
                body {
                    padding: 10px;
                    color: var(--vscode-editor-foreground);
                    font-family: var(--vscode-font-family);
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 15px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 2px;
                    box-sizing: border-box;
                }
                input:focus {
                    outline: 1px solid var(--vscode-focusBorder);
                }
                .history-item {
                    padding: 8px;
                    margin-bottom: 8px;
                    background: var(--vscode-editorWidget-background);
                    border: 1px solid var(--vscode-widget-border);
                    border-radius: 4px;
                    cursor: pointer;
                }
                .history-item:hover {
                    background: var(--vscode-list-hoverBackground);
                }
                .expression {
                    font-size: 0.9em;
                    opacity: 0.8;
                    margin-bottom: 4px;
                }
                .result {
                    font-size: 1.2em;
                    font-weight: bold;
                }
                .empty {
                    text-align: center;
                    opacity: 0.5;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <input type="text" id="calcInput" placeholder="Enter expression... (e.g. \\ln(e))" />
            <div id="historyList"></div>

            <script>
                const vscode = acquireVsCodeApi();
                const input = document.getElementById('calcInput');
                const historyList = document.getElementById('historyList');

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && input.value.trim()) {
                        vscode.postMessage({
                            type: 'calculate',
                            value: input.value
                        });
                        input.value = '';
                    }
                });

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'updateHistory') {
                        renderHistory(message.history);
                    }
                });

                function renderHistory(history) {
                    if (history.length === 0) {
                        historyList.innerHTML = '<div class="empty">No history</div>';
                        return;
                    }
                    
                    historyList.innerHTML = history.map((item) => \`
                        <div class="history-item" onclick="copyResult('\${item.result}')" title="Click to copy result">
                            <div class="expression">\${item.expression} =</div>
                            <div class="result">\${item.result}</div>
                        </div>
                    \`).join('');
                }

                function copyResult(result) {
                    vscode.postMessage({
                        type: 'copy',
                        value: result
                    });
                }

                // Initialize empty state
                renderHistory([]);
            </script>
        </body>
        </html>`;
    }
}
