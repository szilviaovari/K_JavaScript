import input from "./input.js"


const tanulokSzama = await input("Hány tanulót adsz meg? ")

const tanulok = []

for(let i = 0; i< tanulokSzama; i++)
{
    const nev = await input("A tanuló neve: ")
    const email = await input("Email cím: ")
    tanulok.push(nev, email)
}

// tanulok.forEach(item => {
//     console.log(`Név: ${item.name}, email: ${item.email}`)
// })

for(let i = 0; i < tanulok.length; i++)
{
    console.log(`Név: ${tanulok[i].name}, email: ${tanulok[i].email}`)
}