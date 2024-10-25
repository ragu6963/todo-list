const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  // POST 요청의 ID를 마지막 ID의 + 1 한 값으로 설정
  if (req.method === "POST") {
    // key 순서
    const keys = ["id", "content", "completed"];
    // key 순서 보장을 위한 새로운 객체 변수
    const newObject = {};

    const db = router.db;
    const lastId = db.get("todos").value().length + 1; // 마지막 ID + 1
    req.body.id = lastId;

    // key 순서 재정렬
    for (let key of keys) {
      newObject[`${key}`] = req.body[`${key}`];
    }
    req.body = newObject;
  }

  next();
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
