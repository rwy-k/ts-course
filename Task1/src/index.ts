const name: string = "John";
const dateBirth: string| Date = new Date("1990-01-01");
const phoneNumber: string|number = "+380991234567";
let children: null | number = null;
let zip: undefined | number = undefined;

type FuncArgument = string | Date | number | null | undefined;
type FuncArguments = [FuncArgument?, FuncArgument?, FuncArgument?, FuncArgument?];

const printUserInfo = (...args: FuncArguments): void => {
    console.log('User info:');
    for (const arg of args) {
        if (arg === null || arg === undefined) {
            console.log('Missing value');
        } else if (arg instanceof Date) {
            console.log(arg.toISOString());
        } else {
            console.log(arg);
        }
    }
    console.log('--------------------------------');
}

printUserInfo(name, dateBirth, children);

children = 1;
printUserInfo(name, dateBirth, phoneNumber, children);