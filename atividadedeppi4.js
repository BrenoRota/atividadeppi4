const express = require('express');
const app = express();
app.use(express.static('./pages/public'));
const porta = 4001;
const host = '0.0.0.0';

let listaProdutos = [];

app.use(express.urlencoded({ extended: true }));

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
                </div>
            </body>
        </html>
    `);
});

// Página de cadastro de produto
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

// Página de listagem de produtos
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
                    <a class="btn btn-primary" href="/">Voltar ao Início</a>
                </div>
            </body>
        </html>
    `);
}

// Rota de cadastro de produto
function cadastrarProduto(req, resp) {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante } = req.body;

    // Validações adicionais (exemplo)
    if (Number(precoCusto) > Number(precoVenda)) {
        return resp.send("Erro: O preço de custo não pode ser maior que o preço de venda!");
    }

    const produto = { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante };
    listaProdutos.push(produto);

    resp.redirect('/listarProdutos');
}

app.get('/cadastrarProduto', cadastroProdutoView);
app.get('/listarProdutos', listarProdutosView);
app.post('/cadastrarProduto', cadastrarProduto);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
