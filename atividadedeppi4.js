const express = require('express');
const session = require('express-session');
const app = express();
const porta = 4001;
const host = '0.0.0.0';

app.use(express.static('./pages/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: true
}));

let listaProdutos = [];

function verificarAutenticacao(req, resp, next) {
    if (req.session.autenticado) {
        next();
    } else {
        resp.redirect('/login');
    }
}

app.get('/', (req, resp) => {
    resp.send(`
        <html>
            <head>
                <title>Bem-vindo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #66cc66, #ffcc00, #ff9900);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        text-align: center;
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Bem-vindo ao Cadastro de Produtos</h1>
                    <a class="btn btn-primary btn-lg m-2" href="/cadastrarProduto">Cadastrar Produto</a>
                    <a class="btn btn-success btn-lg m-2" href="/listarProdutos">Ver Produtos Cadastrados</a>
                    <a class="btn btn-warning btn-lg m-2" href="/login">Login</a>
                </div>
            </body>
        </html>
    `);
});

app.get('/login', (req, resp) => {
    resp.send(`
        <html>
            <head>
                <title>Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container w-25 mt-5">
                    <form action='/login' method='POST' class="row g-3 needs-validation">
                        <fieldset class="border p-2">
                            <legend class="mb-3">Autenticação do Sistema</legend>
                            <div class="col-md-12">
                                <label for="usuario" class="form-label">Usuário:</label>
                                <input type="text" class="form-control" id="usuario" name="usuario" required>
                            </div>
                            <div class="col-md-12">
                                <label for="senha" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="senha" name="senha" required>
                            </div>
                            <div class="col-12 mt-2">
                                <button class="btn btn-primary" type="submit">Login</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </body>
        </html>
    `);
});

app.post('/login', (req, resp) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '123') {
        req.session.autenticado = true;
        resp.redirect('/');
    } else {
        resp.send(`
            <div class="alert alert-danger" role="alert">
                Usuário ou senha inválidos!
            </div>
            <a href="/login" class="btn btn-primary">Tentar Novamente</a>
        `);
    }
});

app.get('/cadastrarProduto', verificarAutenticacao, (req, resp) => {
    cadastroProdutoView(req, resp);
});

app.get('/listarProdutos', verificarAutenticacao, (req, resp) => {
    listarProdutosView(req, resp);
});

app.post('/cadastrarProduto', verificarAutenticacao, (req, resp) => {
    cadastrarProduto(req, resp);
});

function cadastroProdutoView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #66cc66, #ffcc00, #ff9900);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="border p-4 row g-3">
                        <div class="col-md-6">
                            <label for="codigoBarras" class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
                        </div>
                        <div class="col-md-6">
                            <label for="descricao" class="form-label">Descrição do Produto</label>
                            <input type="text" class="form-control" id="descricao" name="descricao" required>
                        </div>
                        <div class="col-md-6">
                            <label for="precoCusto" class="form-label">Preço de Custo</label>
                            <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
                        </div>
                        <div class="col-md-6">
                            <label for="precoVenda" class="form-label">Preço de Venda</label>
                            <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dataValidade" class="form-label">Data de Validade</label>
                            <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                        </div>
                        <div class="col-md-6">
                            <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required>
                        </div>
                        <div class="col-md-12">
                            <label for="nomeFabricante" class="form-label">Nome do Fabricante</label>
                            <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `);
}

function listarProdutosView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Lista de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #66cc66, #ffcc00, #ff9900);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h2>Produtos Cadastrados</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Código de Barras</th>
                                <th>Descrição</th>
                                <th>Preço de Custo</th>
                                <th>Preço de Venda</th>
                                <th>Data de Validade</th>
                                <th>Quantidade em Estoque</th>
                                <th>Fabricante</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listaProdutos.map(produto => `
                                <tr>
                                    <td>${produto.codigoBarras}</td>
                                    <td>${produto.descricao}</td>
                                    <td>R$ ${produto.precoCusto}</td>
                                    <td>R$ ${produto.precoVenda}</td>
                                    <td>${produto.dataValidade}</td>
                                    <td>${produto.qtdEstoque}</td>
                                    <td>${produto.nomeFabricante}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    `);
}

function cadastrarProduto(req, resp) {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante } = req.body;
    listaProdutos.push({ codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante });
    resp.redirect('/listarProdutos');
}

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
