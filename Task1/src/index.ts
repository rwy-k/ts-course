const name: string = "John";
const dateBirth: string| Date = new Date("1990-01-01");
const phoneNumber: string|number = "+380991234567";
const children: null | number = null;
const zip: undefined | number = undefined;

type funcArgument = string | Date | number | null | undefined;
type funcArguments = [funcArgument?, funcArgument?, funcArgument?, funcArgument?];

const printUserInfo = (...args: funcArguments): void => {
    console.log('User info:', args.join(', '));
}

printUserInfo(name, dateBirth, phoneNumber);