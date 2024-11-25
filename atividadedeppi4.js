const express = require('express');
const app = express();
const porta = 4001;
const host = '0.0.0.0';

let listaEscolas = [];

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, resp) => {
    resp.send(`
        <html>
            <head>
                <title>Bem-vindo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #FFDD93, #FFC3A0, #FF9B93);
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
                    <h1>Bem-vindo ao Cadastro de Escolas</h1>
                    <a class="btn btn-primary btn-lg m-2" href="/cadastrarEscola">Cadastrar Escola</a>
                    <a class="btn btn-success btn-lg m-2" href="/listarEscolas">Ver Escolas Cadastradas</a>
                </div>
            </body>
        </html>
    `);
});

function cadastroEscolaView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Escolas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #FFDD93, #FFC3A0, #FF9B93);
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
                    input, select, button {
                        border: 2px solid #FF6F61; 
                        background-color: #FFF7E0; 
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    input:focus, select:focus {
                        outline: none;
                        border-color: #FF9B93; 
                    }
                </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Cadastro de Escolas</h1>
                    <form method="POST" action="/cadastrarEscola" class="border p-4 row g-3">
                        <!-- Campos de cadastro aqui -->
                    </form>
                </div>
            </body>
        </html>
    `);
}

function listarEscolasView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Lista de Escolas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(45deg, #FFDD93, #FFC3A0, #FF9B93);
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
                    <h2>Escolas Cadastradas</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Razão Social</th>
                                <th>Nome Fantasia</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>UF</th>
                                <th>CEP</th>
                                <th>Email</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listaEscolas.map(escola => `
                                <tr>
                                    <td>${escola.cnpj}</td>
                                    <td>${escola.razaoSocial}</td>
                                    <td>${escola.nomeFantasia}</td>
                                    <td>${escola.endereco}</td>
                                    <td>${escola.cidade}</td>
                                    <td>${escola.uf}</td>
                                    <td>${escola.cep}</td>
                                    <td>${escola.email}</td>
                                    <td>${escola.telefone}</td>
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

function cadastrarEscola(req, resp) {
    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
    listaEscolas.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone });
    resp.redirect('/listarEscolas');
}

app.get('/cadastrarEscola', cadastroEscolaView);
app.get('/listarEscolas', listarEscolasView);
app.post('/cadastrarEscola', cadastrarEscola);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
