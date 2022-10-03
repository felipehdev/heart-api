const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadImg = require('./middlewares/uploadImg')

//instalar o muter? e multer s3?


dotenv.config();
const MONGO_CNSTRING = process.env.MONGO_CNSTRING;


//importa o model
require("./models/User");
const User = mongoose.model("User");

require("./models/Post");
const Post = mongoose.model("Post");

const app = express();

app.use(express.json());

//midleware cors
// MODIFICAR QUEM PODE FAZER REQUISIÇAO ANTES DE LANÇAR
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://felipr.com/");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    app.use(cors());
    next();
});


const port = process.env.PORT || 3000;


//configuraçao do mongoose

mongoose
  .connect(`mongodb+srv://felipr:${MONGO_CNSTRING}@clusterheart.l0j851f.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log(`Conectado com sucesso ao MongoDB`);
  })
  .catch((err) => {
    console.log("Nao foi possivel se conectar ao MongoDB.");
  });

//HOME

//get home
app.get("/", (req, res) => {
  return res.json({ titulo: "bem vindo" });
});

//USER

//create user
app.post("/user", (req, res) => {
  const user = User.create(req.body, (err) => {
    if (err)
      return res.status(400).json({
        error: true,
        message: "Erro ao criar usuario",
      });
    return res.status(200).json({
      error: false,
      message: "Usuario criado com sucesso",
    });
  });
});

//get user
app.get("/user", (req, res) => {
  User.find({})
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro ao retornar users",
      });
    });
});

//get user utilizando o nome como filtro
app.get("/user/:name", (req, res) => {
  console.log(req.params.name);

  User.findOne({ name: req.params.name })
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Nao foi possivel encontrar um usuario com esse nome",
      });
    });
});

//get user utilizando userId como filtro
app.get("/userId/:userId", (req, res) => {
    console.log(req.params.name);
  
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        return res.json(user);
      })
      .catch((err) => {
        return res.status(400).json({
          error: true,
          message: "Nao foi possivel encontrar um usuario com esse userId",
        });
      });
  });

//POST

//create post
app.post("/post", (req, res) => {
  const post = Post.create(req.body, (err) => {
    if (err)
      return res.status(400).json({
        error: true,
        message: "Erro ao criar post",
      });
    return res.status(200).json({
      error: false,
      message: "Post criado com sucesso",
    });
  });
});

//upload de imagem
app.post ("/uploadImg" , uploadImg.single('img'), async (req, res) => {
  if (req.file) {
    return res.json({
      error: false,
      menssage: "Upload de imagem com sucesso"
    });
  }

  return res.status(400).json({
    error: true,
    menssage: "Erro ao fazer upload da imagem"
  });
});

app.get ("/uploadImg", (req, res) => {
  
})

//get post
app.get("/post", (req, res) => {
  Post.find({})
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro ao retornar posts",
      });
    });
});

//get post recebendo id como parametro
app.get("/post/:postId", (req, res) => {
  Post.find({ postId: req.params.postId })
    .then((post) => {
      return res.json(post);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro ao retornar post",
      });
    });
});

// put - update  post de acordo com o id
app.put("/post/:postId", (req, res) => {
  const post = Post.updateOne(
    { postId: req.params.postId },
    req.body,
    (err) => {
      if (err)
        return res.status(400).json({
          error: true,
          message: "Nao foi possivel modificar o post",
        });

      return res.json({
        error: false,
        message: "Post modificado com sucesso",
      });
    }
  );
});

//delete post
app.delete("/post/:postId", (req, res) => {
  Post.deleteOne({ postId: req.params.postId }, req.body, (err) => {
    if (err)
      return res.status(400).json({
        error: true,
        message: "Nao foi possivel deletar o post",
      });

    return res.json({
      error: false,
      menssage: "Post deletetado com sucesso",
    });
  });
});

//LISTEN TO PORT

app.listen(port, () => {
  console.log(
    `Listening on port ${port}, on localhost http://localhost:${port}`
  );
});