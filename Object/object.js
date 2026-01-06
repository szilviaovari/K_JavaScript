const person = {
    name: "Alice",
    age: 19,
    city: "Szeged",
    driverLicen: true
}
person.greet = function() {
    console.log(`Hello ${this.name}`)
}

const person2 = {
    name: "Bob",
    age: 20,
    city: "London",
    driverLicen: true,
    greet(){
        console.log(`Hello ${this.name}`)
    }
}
// person2.greet()

for (let key in person){
    console.log(`Key: ${key} >> Value: ${person[key]}`)
}