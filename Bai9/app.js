// console.log("Start");

// setTimeout( () => {
//     console.log("Callback setTimeout 0ms");
// }, 0);

// Promise.resolve("Promise").then(res => console.log(res));

// console.log("End");

const fs = require('fs');

console.log("Start");

fs.readFile('myfile.txt', 'utf8', (err, data) => {
    if(err) {
        console.error("Err:", err);
        return;
    }
    console.log("Data:", data);
})

console.log("End");