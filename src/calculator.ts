import * as math from 'mathjs';

export function evaluate(expression: string): string {
    let cleanExpr = expression;
    try {
        cleanExpr = preprocess(cleanExpr);
        // Replace ^ with .^ if needed? No, mathjs supports ^.
        // mathjs evaluation
        const result = math.evaluate(cleanExpr);
        return formatResult(result);
    } catch (error: any) {
        throw new Error(`Invalid expression: ${error.message}`);
    }
}

function preprocess(expression: string): string {
    // Basic replacements
    let processed = expression
        .replace(/\\ln/g, 'log')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\floor/g, 'floor')
        .replace(/\\ceil/g, 'ceil');

    // Handle \log_{base}(value) -> log(value, base)
    const logPattern = /\\log_\{/;
    let loopCount = 0;
    const MAX_LOOPS = 100; // Safety break

    while (logPattern.test(processed) && loopCount < MAX_LOOPS) {
        loopCount++;
        const startIndex = processed.indexOf('\\log_{');
        const baseStart = startIndex + 6; // length of "\log_{"
        
        // Find closing brace for base
        let baseEnd = findMatchingBracket(processed, baseStart, '{', '}');
        
        if (baseEnd === -1) {
             // Malformed, replace to avoid infinite loop
             processed = processed.substring(0, startIndex) + 'log_error' + processed.substring(startIndex + 5);
             continue;
        }
        
        const base = processed.substring(baseStart, baseEnd);
        
        // Check for opening parenthesis for value
        let valStart = baseEnd + 1;
        // Skip whitespace
        while (valStart < processed.length && /\s/.test(processed[valStart])) {
            valStart++;
        }
        
        if (valStart >= processed.length || processed[valStart] !== '(') {
            // Malformed, replace
            processed = processed.substring(0, startIndex) + 'log_error' + processed.substring(startIndex + 5);
            continue;
        }
        
        let valEnd = findMatchingBracket(processed, valStart + 1, '(', ')');
        if (valEnd === -1) {
            processed = processed.substring(0, startIndex) + 'log_error' + processed.substring(startIndex + 5);
            continue;
        }
        
        const value = processed.substring(valStart + 1, valEnd);
        
        // Construct new string: prefix + log(value, base) + suffix
        // mathjs log(x, base)
        const replacement = `log(${value}, ${base})`;
        
        // We replace the whole matched segment
        // From startIndex to valEnd
        processed = processed.substring(0, startIndex) + replacement + processed.substring(valEnd + 1);
    }

    return processed;
}

function findMatchingBracket(str: string, startIndex: number, open: string, close: string): number {
    let depth = 1;
    for (let i = startIndex; i < str.length; i++) {
        if (str[i] === open) {
            depth++;
        } else if (str[i] === close) {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }
    return -1;
}

function formatResult(result: any): string {
    if (typeof result === 'number') {
        return parseFloat(result.toPrecision(10)).toString(); // Avoid long decimals
    }
    if (result && result.toString) {
        return result.toString();
    }
    return String(result);
}
