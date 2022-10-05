const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadImg = require('./middlewares/uploadImg')



dotenv.config();
const mongoPass = process.env.MONGO_PASS;


//importa o model
require("./models/User");
const User = mongoose.model("User");

require("./models/Post");
const Post = mongoose.model("Post");

require("./models/Img");
const Img = mongoose.model("Img");

const app = express();

app.use(express.json());

// use path que permite que os arquivos possam ser requisitados e visualizado atravez do caminho files, que substitui o src
app.use('/files', express.static(path.resolve(__dirname, "src")));

//midleware cors
// MODIFICAR QUEM PODE FAZER REQUISIÇAO ANTES DE LANÇAR
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://cartoes.felipr.com/*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    app.use(cors());
    next();
});


const port = process.env.PORT || 3000;


//configuraçao do mongoose ${mongoPass}

mongoose
  .connect(`mongodb+srv://felipr:${mongoPass}@clusterheart.l0j851f.mongodb.net/?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
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

//Imgs

//create Img Schema

app.post("/img", (req, res) => {
  const img = Img.create(req.body, (err) => {
    if (err)
      return res.status(400).json({
        error: true,
        message: "Erro ao criar img",
      });
    return res.status(200).json({
      error: false,
      message: "Img criado com sucesso",
    });
  });
});



//upload de imagem
app.post ("/uploadImg" , uploadImg.single('img'), async (req, res) => {
  console.log(req.body, req.file);
  
  if (req.file) {

    await Img.create({imgId: req.body.imgId, src: req.file.filename, text: req.body.text})
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

//get uploadImgs
app.get('/uploadImg', (req, res) => {
  Img.find({})
    .then((img) => {
      return res.json(img);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro ao retornar img",
      });
    });
})

//LISTEN TO PORT

app.listen(port, () => {
  console.log(
    `Listening on port ${port}, on localhost http://localhost:${port}`
  );
});
