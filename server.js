const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 遅延を追加するミドルウェア
server.use((req, res, next) => {
	setTimeout(next, 1000); // 1秒の遅延
});

server.use(middlewares);
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`JSON Server is running on http://localhost:${PORT}`);
});
