function trackBrackets(str: string) {
    let openers: any[] = [];
    let template_vars = [];
    let subOpeners: any[] = [];
    for (let char = 0; char < str.length; char++) {
        if (str[char] === '(') {
            subOpeners.push({char: str[char], index: char});
        } else if (str[char] === ')') {
            let start = subOpeners[subOpeners.length - 1].index;
            subOpeners.pop();
            let sub = str.slice(start, char + 1);
            template_vars.unshift(sub);
            if (subOpeners.length === 0) {
                openers = openers.concat(template_vars);
                template_vars = [];
            } 

            str = str.replace(sub, '');
            char -= sub.length;
        }
    }

    console.log(openers)
}

trackBrackets('((foo)bar)(baz)');

export {}