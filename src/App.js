// using http library
// const http = require("http");
// const port = process.env.PORT || 5000;
// const host = "localhost"

// const requestListener = (req,res) => {
//     res.writeHead(200);
//     res.end("My first server!");
// }

// const server = http.createServer(requestListener);

// server.listen(port, host, () => {
//     console.log(`Server is listening on port ${port}`)
// })

//to study: Error handling, Swagger UI (API docs), environment setup

// using express library
const express = require("express");//
const bodyParser = require("body-parser");//
const cors = require("cors");//
require("./models/index");
const UserRoutes = require("./routes/user.routes");

const port = process.env.PORT; // || 5000;
const app = express();//
app.use(bodyParser.json());//
app.use(cors());//
app.use("/users", UserRoutes);

// app.use("/", (req,res) => {
//     res.status(200).send("Server is running!!!")
// })

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
