function pxToRem(number: number, baseNumber: number = 14): string {
    return `${number / baseNumber}rem`;
}

export default pxToRem;
