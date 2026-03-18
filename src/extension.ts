import * as vscode from 'vscode';
import { evaluate } from './calculator';
import { CalculatorWebviewProvider } from './webviewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "inline-calculator" is now active!');

    const provider = new CalculatorWebviewProvider(context.extensionUri);

    // Register Webview View
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('inline-calculator.history', provider)
    );

    // Register Command: Calculate
    let calculateCmd = vscode.commands.registerCommand('inline-calculator.calculate', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter expression to calculate (e.g., 2 + 2, \\ln(e), \\log_{2}(8), \\sin(PI/2))',
            placeHolder: 'Expression',
            ignoreFocusOut: true
        });

        if (input) {
            try {
                const result = evaluate(input);
                vscode.window.showInformationMessage(`${input} = ${result}`);
                provider.addHistory(input, result);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Calculation Error: ${error.message}`);
            }
        }
    });

    // Register Command: Clear History
    let clearHistoryCmd = vscode.commands.registerCommand('inline-calculator.clearHistory', () => {
        provider.clearHistory();
        vscode.window.showInformationMessage('Calculation history cleared.');
    });

    context.subscriptions.push(calculateCmd);
    context.subscriptions.push(clearHistoryCmd);
}

export function deactivate() {}
