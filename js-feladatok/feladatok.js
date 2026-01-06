function highAndLow(numbers){
    let tomb = [];
    const elvalasztas = numbers.split(' ');
    tomb = elvalasztas.map(Number);
    console.log(elvalasztas);
    let min = Math.min(...tomb);
    let max = Math.max(...tomb);
    return `${max} ${min}`;
}

console.log(highAndLow("1 2 3 4 5"), 5,1); // return "5 1"
console.log(highAndLow("1 2 -3 4 5"), 5, -3); // return "5 -3"
console.log(highAndLow("1 9 3 4 -5"), 9, -5); // return "9 -5")

