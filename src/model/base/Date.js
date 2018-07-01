
export function strToDate(str) {
    let result = str.toString().replace(/\-/g, "/");
    return new Date(result);
}
