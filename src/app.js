const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


/**
 * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, 
 * sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto 
 * no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; 
 * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
 * 
 * GET /repositories: Rota que lista todos os repositórios;
 * 
 * PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual
 * ao id presente nos parâmetros da rota;
 *
 * DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
 *
 * POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id 
 * presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
 */


const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID." });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  // if (!repository) {
  //   return response.status(400).send()
  // }

  const repository = {
    id,
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(400).send()
  }

  repository.likes ++

  return response.json(repository)
});

module.exports = app;
