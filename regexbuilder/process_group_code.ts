type groupCode = 'cg' | 'ncg' | 'la' | 'nla' | 'lb' | 'nlb';

const groupStarters = {
    cg: '(',
    ncg: '(?:',
    la: '(?=',
    lb: '(?<=',
    nla: '(?!',
    nlb: '(?<!',
    close: ')'
};

function processGroupCode(type: groupCode): string {
    if (type === 'cg') {
        return groupStarters.cg;
    } else if (type === 'ncg') {
        return groupStarters.ncg;
    } else if (type === 'la') {
        return groupStarters.la;
    } else if (type === 'lb') {
        return groupStarters.lb;
    } else if (type === 'nla') {
        return groupStarters.nla;
    } else if (type === 'nlb') {
        return groupStarters.nlb;
    }
    return groupStarters.ncg;
}

export { groupStarters, processGroupCode }
export type { groupCode }