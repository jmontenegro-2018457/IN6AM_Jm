let cars = ["Toyota", "Volvo", "BMW"];
let fruits= ["Piña","Sandia","Melon","Papaya","Manzana"]

function resFirst (n,array){
    console.log('Los primeros '+n+' elementos del array son: ')
    for(let i = 0; i < n; i++){
        console.log((i+1)+" "+array[i]);
      }
    console.log("");
}

resFirst(2,cars);
resFirst(4,fruits);
      
     