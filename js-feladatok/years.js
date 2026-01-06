function isLeapYear(year) {
  if(year %400 == 0 && year %100 !=0)
  {
    if(year %4 == 0)
    {
        return true
    } 
  }
  else
  {
    return false
  }
}


console.log(isLeapYear(2020), true,"Incorrect answer for year = 2020");
console.log(isLeapYear(2000), true, "Incorrect answer for year = 2000");
console.log(isLeapYear(2015), false, "Incorrect answer for year = 2015");