import { hasDuplicates } from "../utils/duplicates.ts";

export interface BracketPosition {
    bracket: string,
    index: number
}

interface HandlesBrackets {
    handleBrackets(): string[]
}

export type Bracket = '(' | '[' | '{' | '<';

export class TemplateStringHandler {
    protected readonly brackets: BracketPosition[] = [];
    protected templateUnits: string[] = [];
    protected outerUnit: string[] = [];
    protected tier = 0;

    constructor(protected template: string, protected readonly openingBracket: Bracket) {} 

    protected closingBracketType() {
        if (this.openingBracket === '(') return ')';
        else if (this.openingBracket === '[') return ']';
        else if (this.openingBracket === '{') return '}';
        else return '>';
    }

    extractTemplateGroups() {
        for (let i = 0; i < this.template.length; i++) {
            if (this.template[i] === this.openingBracket) {
                this.brackets.push({bracket: this.template[i], index: i});
            } else if (this.template[i] === this.closingBracketType()) {
                let lastOpener: BracketPosition = this.brackets[this.brackets.length - 1];
                let nestedUnit: string = this.template.slice(lastOpener.index, i + 1);
                this.template = this.removeNestedUnit(nestedUnit);
                i -= nestedUnit.length;
                this.brackets.pop();
                this.finishOuterUnit();
            }
        }
        return this.templateUnits;
    }

    // outer units L -> R
    // nested (inner) unit R -> L
    protected removeNestedUnit(nestedUnit: string): string {
        if (this.noTierChange()) {
            this.outerUnit.push(nestedUnit);
        } else {
            this.outerUnit.unshift(nestedUnit);
            this.tier = this.brackets.length;
        }
        return this.template.replace(nestedUnit, '');
    }

    protected noTierChange() {
        return (this.tier === this.brackets.length);
    }

    protected finishOuterUnit(): void {
        if (this.brackets.length === 0) {
            this.templateUnits = this.templateUnits.concat(this.outerUnit);
            this.outerUnit = [];
        } 
    }
}

class TemplateBracketHandler extends TemplateStringHandler implements HandlesBrackets {
    /**
     * Keeps track of opening and closing parentheses to extract nested regex groups one at a time, 
     * from the innermost tiers to the outermost tiers. Filters out non-capturing groups and template 
     * variable symbols to return a list of groups that can be mapped directly with matches found 
     * using the template's pattern.
     */
    handleBrackets(): string[] {
        this.extractTemplateGroups();
        this.templateUnits = this.clean();
        return this.templateUnits;
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
                return arr[i] = e.replace(/\(|\)|[!@#%]/g, '');
            })
            .filter(e => {
                return !/^\\/.test(e);
            });
    }
}

export { TemplateBracketHandler }
