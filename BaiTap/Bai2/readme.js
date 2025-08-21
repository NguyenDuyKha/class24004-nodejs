// 18. Đáp án tham khảo:
// Phiên bản Callback:
const fs = require('fs');
fs.readFile('input.txt', 'utf8', (err, data) => {
   if (err) {
      console.error("Lỗi đọc file (Callback):", err);
      return;
   }
   console.log("Nội dung file (Callback):\\n", data);
});
console.log("Chương trình tiếp tục chạy, đang đọc file bằng Callback...");
// Phiên bản Promise:
const fs = require('fs').promises;
async function readFileAsyncAwait() {
   try {
      const data = await fs.readFile('input.txt', 'utf8');
      console.log("Nội dung file (Async/Await):\\n", data);
   } catch (err) {
      console.error("Lỗi đọc file (Async/Await):", err);
   }
}
readFileAsyncAwait();
console.log("Chương trình tiếp tục chạy, đang đọc file bằng Async/Await...");

// 19.Đáp án tham khảo:
// Phiên bản Callback:
const fs = require('fs');
const contentCallback = "Đây là nội dung được ghi vào file bất đồng bộ bằng Callback.";
fs.writeFile('output_callback.txt', contentCallback, 'utf8', (err) => {
   if (err) {
      console.error("Lỗi ghi file (Callback):", err);
      return;
   }
   console.log("Ghi file thành công (Callback)!");
});
console.log("Chương trình vẫn chạy, đang ghi file bằng Callback...");
// Phiên bản Promise:
const fs = require('fs').promises;
const contentAsyncAwait = "Đây là nội dung được ghi vào file bất đồng bộ bằng Async/Await.";
async function writeFileAsyncAwait() {
   try {
      await fs.writeFile('output_async_await.txt', contentAsyncAwait, 'utf8');
      console.log("Ghi file thành công (Async/Await)!");
   } catch (err) {
      console.error("Lỗi ghi file (Async/Await):", err);
   }
}
writeFileAsyncAwait();
console.log("Chương trình vẫn chạy, đang ghi file bằng Async/Await...");

// 20.Đáp án tham khảo:
// Phiên bản Callback:
const fs = require('fs');
fs.readFile('server.log', 'utf8', (err, logData) => {
   if (err) {
      console.error("Lỗi đọc file (Callback):", err);
      return;
   }
   const logLines = logData.split('\n');
   const errorLogs = [];
   for (const line of logLines) {
      if (line.includes('ERROR')) {
         errorLogs.push(line);
      }
   }
   const processedLogContent = errorLogs.join('\n');
   fs.writeFile('processed_log_callback.txt', processedLogContent, 'utf8', (err) => {
      if (err) {
         console.error("Lỗi ghi file (Callback):", err);
         return;
      }
      console.log("Đã ghi log lỗi vào file processed_log_callback.txt thành công (Callback)!");
   });
});
console.log("Chương trình bắt đầu xử lý log file... (Callback)");
// Phiên bản Promise:
const fs = require('fs').promises;
async function processLogFileAsyncAwait() {
   try {
      const logData = await fs.readFile('server.log', 'utf8');
      const logLines = logData.split('\\n');
      const errorLogs = logLines.filter(line => line.includes('ERROR'));
      const processedLogContent = errorLogs.join('\\n');
      await fs.writeFile('processed_log_async_await.txt', processedLogContent, 'utf8');
      console.log("Đã ghi log lỗi vào file processed_log_async_await.txt thành công (Async/Await)!");
   } catch (err) {
      console.error("Lỗi xử lý file log (Async/Await):", err);
   }
}
processLogFileAsyncAwait();
console.log("Chương trình bắt đầu xử lý log file... (Async/Await)");