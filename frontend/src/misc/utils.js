export function isValidUsername(username){
    return /^[A-Za-z0-9]+$/i.test(username)
}

export function getRandomNumber(number){
    return Math.floor(Math.random() * number)
}