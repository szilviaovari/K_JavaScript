function bmi(weight, height) {
    const bmi = weight/Math.pow(height,2);
    if (bmi <= 18.5)
    {
        return "Underweight";
    }
    if (bmi <= 25.0)
    {
        return "Normal";
    }
    if (bmi <= 30.0)
    {
        return "Overweight";
    }
    if (bmi > 30)
    {
        return "Obese";
    } 
}

console.log(bmi(50, 1.80),"For weight = 50 and height = 1.80");
console.log(bmi(80, 1.80),"For weight = 80 and height = 1.80");
console.log(bmi(90, 1.80),"For weight = 90 and height = 1.80");
console.log(bmi(100, 1.80),"For weight = 100 and height = 1.80");