import fs from "fs";

let content = fs.readFileSync("dobasok.txt", {encoding: "utf-8"});
const arr = content.split(',').map(e => +e);

console.log("2. feladat");
let mezo= 0;
let index= 0;
for(let i = 0; i < arr.length; i++)
{
    mezo = mezo + arr[i];
    if(mezo % 10 == 0)
    {
        mezo = mezo-3;
        console.log(`${mezo} `);
        index++;
    }
    else
    {
        console.log(`${mezo} `);
    }
    
}

console.log("3. feladat");
console.log(`A játék során ${index} alkalommal lépett létrára.`);

console.log("4. feladat");
if(mezo >=45)
{
    console.log(`A játékot befejezte.`);
}
else
{
    console.log(`A játékot abbahagyta.`);
}

