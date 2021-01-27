import { hasDuplicates } from "../utils/duplicates.ts";

interface CharPos {
    char: string,
    index: number
}

export interface HandlesParentheses {
    handleBrackets(): string[]
}

export class TemplateGroupHandler implements HandlesParentheses {
    private openers: CharPos[] = [];
    private template_units: string[] = [];
    private str: string;

    constructor(str: string,) {
        this.str = str;
    }

    /**
     * This method is for unit testing purposes.
     * @param value 
     */
    _reset(value: string) {
        this.str = value;
        this.openers = [];
        this.template_units = [];
        return this;
    }

    handleBrackets(): string[] {
        this.handle();
        this.template_units = this.clean();
        return this.template_units;
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
                    this.template_units = this.template_units.concat(template_unit);
                    template_unit = [];
                } 
                this.str = this.str.replace(sub, '');
                i -= sub.length;
            }
        }
    }

    private clean() {
        if (hasDuplicates(this.template_units)) {
            throw new Error('Found duplicate template group names.');
        }
        return this.template_units
        .filter(e => {
            return !/\?[:<=!]?/.test(e);
        })
        .map((e, i, arr) => {
            return arr[i] = e.replace(/\(|\)/g, '');
        });
    }
}
