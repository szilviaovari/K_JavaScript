let numbers = [];
//1. feladat
function getOtosLotteryNumbers() {
    for (let i = 0; i < 5; i++) {
        let randomszamok = Math.floor(Math.random() * 90) + 1; //kerekites mert tizedesjeggyel iratja ki valamiert
        if (!numbers.includes(randomszamok)) {
            numbers.push(randomszamok);
        } 
        else {
            i--;
        }
    }
    return numbers;
}

const fivenumbers = getOtosLotteryNumbers();
fivenumbers.forEach(e => {
    console.log(e); 
});

//2. feladat
function getSortedLotteryNumbers() {
    let sortedNumbers = [...numbers]; //masolat a number tombrol
    sortedNumbers.sort(function(a, b) { return a - b }); 
    return sortedNumbers;
}

const sortedNumbers = getSortedLotteryNumbers();
console.log("Rendezett számok:");
sortedNumbers.forEach(e => {
    console.log(e);
});

