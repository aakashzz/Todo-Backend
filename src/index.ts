import http from "http";
import "dotenv/config";
import { app } from "./app";

const server = http.createServer(app);
const port = process.env.PORT || 5000;

server.listen(port, () => {
   console.log("server running: ", port);
});
