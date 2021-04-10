const numberRegExp = /(-)?([0](\.\d{1,4})?|([1-9]+\d*)(\.\d{1,4})?)/;
const operatorRegExp = /(\+|-|\/|\*){1,1}/;
const formulaRegExp = /^(-)?([0]{1,1}(\.\d{1,4})?|([1-9]+\d*)(\.\d{1,4})?)((\+|-|\/|\*){1,1}(-)?([0]{1,1}(\.\d{1,4})?|([1-9]+\d*)(\.\d{1,4})?))*$/;

export function isFormula (formula) {
    return formulaRegExp.test(formula);
}

export function formulaWithoutOperatorsAtTheEnd(formula) {
    return formula.replace(/(\.|\+|\*|\/|-)*$/, '');
}

function parseFormula(formula) {
    let tree = [];
    while (formula.length !== 0) {
        var number = formula.match(numberRegExp);
        if (number) {
            tree.push(number[0]);
            formula = formula.replace(number[0], "");
        }

        var operator = formula.match(operatorRegExp);
        if (operator) {
            tree.push(operator[0]);
            formula = formula.replace(operator[0], "");
        }
    }
    return tree;
}

function calculate(tree) {

    if (tree.length < 3)
        return parseFloat(tree[0]);

    // process the '*' and '/' operations first
    let preprocessedTree = [tree[0]];

    for (let i = 1; i < tree.length;) {
        if (tree[i] === "*") {
            let prevValue = parseFloat(preprocessedTree.pop());
            preprocessedTree.push(String(prevValue * parseFloat(tree[i + 1])));
            i = i + 2;
        }
        else if (tree[i] === "/") {

            if (Math.abs(parseFloat(tree[i + 1])) < Number.EPSILON) // division by zero 
                return NaN;

            let prevValue = parseFloat(preprocessedTree.pop());
            preprocessedTree.push(String(prevValue / parseFloat(tree[i + 1])));
            i = i + 2;
        }
        else {
            preprocessedTree.push(tree[i]);
            i = i + 1;
        }
    }

    // process the '+' and '-' operations
    let res = parseFloat(preprocessedTree[0]);

    for (let i = 1; i < preprocessedTree.length;) {
        if (preprocessedTree[i] === "+") {
            res = res + parseFloat(preprocessedTree[i + 1]);
            i = i + 2;
        }
        else if (preprocessedTree[i] === "-") {
            res = res - parseFloat(preprocessedTree[i + 1]);
            i = i + 2;
        }
        else
            return NaN;
    }
    return res;
}

export function calculateFormula (formula) {
    let tree = parseFormula(formula);
    let result = calculate(tree);
    if (!Number.isInteger(result)) { // the floating point result will have precision 4, i.e. 1/3 = 0.3333
        result = Number.parseFloat(result).toFixed(4).replace(/0+$/, '');
    }
    return result;
}