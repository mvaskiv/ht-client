export const LoginPreg = /^[a-zA-Z0-9]+$/;
export const LetterPreg = /^[a-zA-Z]+$/;
export const TextPreg = /^[a-zA-Z0-9 ]+$/;
export const PassPreg = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const EmailPreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;