import { Python2, Python3 } from 'dt-python-parser';

export const ParserPython2 = (inputBlock: string | string[]) => {
    try {
        let resultArray;
        const Python2Parser = new Python2();
        if (Array.isArray(inputBlock)) {
            resultArray = inputBlock.join('');
        } else {
            resultArray = inputBlock;
        }
        const result = Python2Parser.validate(resultArray);
        return result[0];
    } catch (e) {
        return e;
    }
};

export const ParserPython3 = (inputBlock: string | string[]) => {
    try {
        let resultArray;
        const Python3Parser = new Python3();
        if (Array.isArray(inputBlock)) {
            resultArray = inputBlock.join('');
        } else {
            resultArray = inputBlock;
        }
        const result = Python3Parser.validate(resultArray);
        return result[0];
    } catch (e) {
        return e;
    }
};
