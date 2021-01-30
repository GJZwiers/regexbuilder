import { hasDuplicates } from "../utils/duplicates.ts";

interface CharPositions {
    char: string,
    index: number
}

interface HandlesParentheses {
    handleBrackets(): string[]
}

abstract class TemplateStringHandler {
    protected templateUnits: string[] = [];
    protected openers: CharPositions[] = [];
    constructor(protected str: string) {} 
}

class TemplateGroupHandler extends TemplateStringHandler implements HandlesParentheses {
    handleBrackets(): string[] {
        this.handle();
        this.templateUnits = this.clean();
        return this.templateUnits;
    }

    private handle(): void {
        let template_unit = [];
        for (let i = 0; i < this.str.length; i++) {
            if (this.str[i] === '(') {
                this.openers.push({char: this.str[i], index: i});
            } else if (this.str[i] === ')') {
                let start = this.openers[this.openers.length - 1].index;
                let sub = this.str.slice(start, i + 1);
                template_unit.unshift(sub);
                this.openers.pop();
                if (this.openers.length === 0) {
                    this.templateUnits = this.templateUnits.concat(template_unit);
                    template_unit = [];
                } 
                this.str = this.str.replace(sub, '');
                i -= sub.length;
            }
        }
    }

    private clean(): string[] {
        if (hasDuplicates(this.templateUnits)) {
            throw new Error('(regexbuilder) Error: Cannot map duplicate template variables.');
        }
        return this.templateUnits
            .filter(e => {
                return !/\?[:<=!]?/.test(e);
            })
            .map((e, i, arr) => {
                return arr[i] = e.replace(/\(|\)/g, '');
            });
    }
}

export { TemplateGroupHandler }
