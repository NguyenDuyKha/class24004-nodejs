const fs = require('fs');

// try {
//     // const data = fs.readFileSync("input.txt", "utf8");
//     // console.log(data);

//     fs.writeFileSync("output1.txt", "Hello World\nJavaScript.", "utf8");
//     console.log("Da ghi xong file");

// } catch (err) {
//     console.log("Error:", err);
// }

// fs.readFile('input1.txt', 'utf8', (err, data) => {
//     if(err) {
//         console.log("Error: ", err);
//         return;
//     }
//     console.log(data);
// });

// fs.writeFile("output.txt", "Hello World\nJavaScript.", "utf8", (err) => {
//     if(err) {
//         console.log("Error: ", err);
//         return;
//     }
//     console.log("Da ghi file thanh cong");
// })


// fs.promises.readFile("input.txt", 'utf8')
// .then(data => {
//     console.log(data);
// })
// .catch(err => {
//     console.log(err);
// })

// fs.promises.writeFile("output.txt", "Hello World\nJavaScript.", "utf8")
// .then(() => {
//     console.log("Ghi file thanh cong");
// })
// .catch(err => {
//     console.log(err);
// })


// async function readFileAsyncAwait() {
//     try {
//         const data = await fs.promises.readFile("input.txt", "utf8");
//         console.log(data)
//     } catch (err) {
//         console.log(err);
//     }
// }

// readFileAsyncAwait();

async function writeFileAsyncAwait() {
    try {
        await fs.promises.writeFile("output.txt", "Hello World\nJavaScript.", "utf8");
        console.log("Ghi thanh cong");
    } catch (err) {
        console.log(err);
    }
}

writeFileAsyncAwait();

console.log("Chuong trinh tiep tuc chay ngay lap tuc");