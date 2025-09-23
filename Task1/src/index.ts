const name: string = "John";
const dateBirth: string| Date = new Date("1990-01-01");
const phoneNumber: string|number = "+380991234567";
const children: null = null;
const zip: undefined = undefined;

const printUserInfo = (...args: [unknown?, unknown?, unknown?, unknown?]): void => {
    console.log('User info:', args.join(', '));
}

printUserInfo(name, dateBirth, phoneNumber);