import input from './input.js';

let txt = await  input("Kérek egy szöveget: ");


console.log(txt);

const elsoMegoldas = txt.substr(0, 5);
console.log(`Az első 5 karakter: ${elsoMegoldas}`);

const haromtolNyolcig = txt.slice(2, 8);
console.log(`A 3. karaktertől a 8. karakterig: ${haromtolNyolcig}`);

const otodiktolVeg = txt.substring(4);
console.log(`Az 5. karaktertől a végéig: ${otodiktolVeg}`);

const hatkarakterHosszan5Tol = txt.substring(4, 10);
console.log(`Hat karakter 5-től: ${hatkarakterHosszan5Tol}`);

const nagybetus = txt.toUpperCase();
console.log(`Nagy betűkkel: ${nagybetus}`);

let mindenmasodik = "";
for (let i =0; i< txt.length; i++)
{
    if(i % 2 != 0)
    {
        mindenmasodik += txt[i].toUpperCase();
    }
    else
    {
        mindenmasodik += txt[i];
    }
}
console.log(`Minden második nagy: ${mindenmasodik}`);

const nagyEk = txt.replaceAll("e", "E");
console.log(`Nagy E betűkkel: ${nagyEk}`);

const etlenTob = txt.split('e');
console.log(`A szöveg e szerint szétválasztva: ${etlenTob}`);