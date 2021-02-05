import { hasDuplicates } from "../utils/duplicates.ts";

export interface BracketPosition {
    bracket: string,
    index: number
}

interface HandlesBrackets {
    handleBrackets(): string[]
}

export type Bracket = '(' | '[' | '{' | '<';

abstract class TemplateStringHandler {
    protected readonly brackets: BracketPosition[] = [];
    protected templateUnits: string[] = [];
    protected outerUnit: string[] = [];
    protected tier = 0;

    constructor(protected readonly template: string, protected readonly openingBracket: Bracket) {} 

    protected closingBracketType() {
        if (this.openingBracket === '(') return ')';
        else if (this.openingBracket === '[') return ']';
        else if (this.openingBracket === '{') return '}';
        else return '>';
    }

    protected extractTemplateGroups(index: number = 0): void {
        let template = (typeof this.template === 'string') ? this.template : this.template[index];

        for (let i = 0; i < template.length; i++) {
            if (template[i] === this.openingBracket) {
                this.brackets.push({bracket: template[i], index: i});
            } else if (template[i] === this.closingBracketType()) {
                let lastOpener: BracketPosition = this.brackets[this.brackets.length - 1];
                let nestedUnit: string = template.slice(lastOpener.index, i + 1);
                template = this.removeNestedUnit(nestedUnit, template);
                i -= nestedUnit.length;
                this.brackets.pop();
                this.finishOuterUnit();
            }
        }
    }

    // outer units L -> R
    // nested (inner) unit R -> L
    protected removeNestedUnit(nestedUnit: string, template: string): string {
        if (this.noTierChange()) {
            this.outerUnit.push(nestedUnit);
        } else {
            this.outerUnit.unshift(nestedUnit);
            this.tier = this.brackets.length;
        }

        return template.replace(nestedUnit, '');
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
            });
    }
}

export { TemplateBracketHandler }
