RELATÓRIO DE DEPURAÇÃO — ESTOQUE FÁCIL

1. Objetivo

Investigar as falhas de comportamento do projeto recebido e corrigir a integração entre React e JSON Server, preservando a estrutura React + Vite + React Router DOM 6.

2. Problemas encontrados e corrigidos

Problema 1 — Rota incorreta na listagem

Arquivo/local: src/services/productService.js — função getProducts().

Sintoma: a tela de produtos não carregava os registros.

Causa: o frontend fazia GET /product, mas o recurso definido em db.json pelo JSON Server é /products.

Diagnóstico: comparei a URL utilizada no fetch com o recurso products do arquivo db.json e com a rota esperada pela API.

Correção: alterei a chamada para GET http://localhost:3001/products.

Validação: o teste automatizado verifica a URL e o método da chamada. Com a API em execução, a confirmação visual deve ser feita na listagem e na aba Network do navegador.

Problema 2 — Exclusão sem identificador

Arquivo/local: src/pages/ProductList.jsx — função handleDelete(id).

Sintoma: ao confirmar a exclusão, o produto não era removido corretamente, pois a requisição poderia ser enviada sem o identificador.

Causa: a função deleteProduct() era chamada sem argumento, embora o serviço necessite do ID do produto.

Diagnóstico: acompanhei o ID recebido pelo botão de exclusão e comparei com os parâmetros esperados pela função deleteProduct(id).

Correção: passei o identificador do produto como argumento, utilizando deleteProduct(id). O serviço envia uma requisição DELETE para /products/:id.

Validação: o teste automatizado confirma a chamada DELETE para http://localhost:3001/products/7 quando o ID 7 é informado. A interface também remove o produto do estado somente após a resposta bem-sucedida da API.

Problema 3 — Efeito de carregamento da edição com dependências incompletas

Arquivo/local: src/pages/ProductForm.jsx — useEffect responsável por buscar os dados do produto.

Sintoma: ao reutilizar o formulário com outro parâmetro de rota, os dados poderiam permanecer associados ao produto anterior.

Causa: o efeito possuía um array de dependências vazio ([]), apesar de utilizar as variáveis id e isEditing.

Diagnóstico: comparei as variáveis utilizadas dentro do useEffect com as dependências declaradas no Hook.

Correção: incluí as dependências [id, isEditing] e uma proteção para evitar atualizações de estado após a desmontagem do componente.

Validação: ao acessar diretamente uma rota de edição, como /products/1/edit, o sistema deve buscar e apresentar os dados correspondentes ao produto informado.

Problema 4 — Campos sem validação efetiva

Arquivo/local: src/pages/ProductForm.jsx — função handleSubmit.

Sintoma: era possível tentar enviar campos vazios ou valores numéricos inválidos no cadastro e na edição de produtos.

Causa: os dados eram convertidos diretamente, sem verificar se os campos estavam preenchidos ou se os valores respeitavam as regras esperadas.

Diagnóstico: revisei a conversão dos valores antes das requisições POST e PUT e comparei com os requisitos do cadastro de produtos.

Correção: implementei validações para nome e categoria, utilizando trim() para verificar campos vazios. Também adicionei verificações para garantir que o preço seja um número válido e não negativo e que a quantidade seja um número inteiro, válido e não negativo.

Validação: o formulário deve apresentar mensagens de validação e impedir o envio quando houver nome ou categoria vazios, preço inválido ou quantidade decimal ou negativa.

Problema 5 — Falhas HTTP e de conexão pouco claras

Arquivo/local: src/services/productService.js — camada de requisições HTTP.

Sintoma: falhas de conexão ou respostas HTTP não bem-sucedidas poderiam apresentar mensagens genéricas ou pouco claras para o usuário.

Causa: as verificações de erro eram repetidas nas funções e não havia um tratamento centralizado para falhas de conexão e respostas HTTP.

Diagnóstico: analisei os caminhos de sucesso e erro das operações de comunicação com a API.

Correção: criei a função request(), responsável por centralizar as requisições e tratar falhas de conexão, respostas HTTP com erro e respostas sem conteúdo, mantendo mensagens mais compreensíveis.

Validação: os testes automatizados simulam uma resposta HTTP 500 e uma falha de conexão, verificando se as mensagens de erro são apresentadas corretamente.

Problema 6 — Estado de carregamento da listagem e recuperação

Arquivo/local: src/pages/ProductList.jsx — carregamento e renderização dos produtos.

Sintoma: o componente apresentava dificuldades na organização dos estados de carregamento e erro, além de não oferecer uma ação direta para tentar carregar os produtos novamente.

Causa: o estado de carregamento era tratado por meio de um retorno antecipado e a função responsável pela busca não estava estabilizada como callback.

Diagnóstico: acompanhei os estados loading e error durante os processos de carregamento, sucesso e falha da requisição.

Correção: utilizei useCallback(), ajustei as dependências do useEffect e organizei os estados de carregamento e erro. Também adicionei a opção Tentar novamente.

Validação: com o JSON Server desligado, a aplicação deve apresentar uma mensagem de erro de conexão. Após iniciar o servidor, a opção Tentar novamente deve permitir carregar os produtos normalmente.

Problema 7 — Estado do formulário e prevenção de envio duplicado

Arquivo/local: src/pages/ProductForm.jsx — função handleSubmit e botão de envio.

Sintoma: durante o salvamento, o usuário não recebia uma indicação visual de que a operação estava em andamento e poderia acionar o botão repetidamente.

Causa: não existia um estado específico para controlar o envio do formulário.

Diagnóstico: revisei o fluxo assíncrono das operações POST e PUT e o comportamento visual do botão durante as requisições.

Correção: adicionei o estado saving, responsável por controlar o envio. Também configurei o botão para ficar desabilitado durante a requisição e apresentar o texto Salvando....

Validação: durante o envio, o botão deve permanecer desabilitado e retornar ao estado normal após a conclusão da operação, inclusive quando a API apresentar algum erro.

Problema 8 — React não definido no componente principal

Arquivo/local: src/App.jsx — importações do componente principal.

Sintoma: ao executar a aplicação no navegador, a tela ficava completamente branca.

Causa: o componente utilizava JSX sem importar o React, gerando o erro React is not defined.

Diagnóstico: abri o Console do navegador (F12) e identifiquei o erro apontando para a linha 7 do arquivo App.jsx.

Correção: adicionei a importação import React from 'react' no componente principal e nos demais componentes que precisavam dela.

Validação: salvei as alterações, atualizei a página e verifiquei se a aplicação voltou a renderizar normalmente.

3. Testes automatizados executados

Arquivo/local: src/services/productService.test.js.

Diagnóstico: foram criados testes utilizando o Node.js Test Runner para verificar o funcionamento das operações de comunicação com a API.

Correção: adicionei testes para verificar as requisições HTTP, os parâmetros enviados e o tratamento de erros.

Validação: resultado registrado durante a preparação dos testes:

7 testes executados.
7 testes aprovados.
0 falhas.

Os testes contemplam:

1. Consulta de produtos utilizando GET /products.
2. Consulta de um produto utilizando GET /products/:id.
3. Cadastro de produtos utilizando POST.
4. Atualização de produtos utilizando PUT.
5. Exclusão de produtos utilizando DELETE.
6. Tratamento de respostas HTTP com erro.
7. Tratamento de falhas de conexão.

Observação: os testes automatizados verificam a camada de serviço utilizando fetch simulado. Eles não substituem os testes integrados no navegador com o JSON Server em execução.

4. Reflexão sobre o processo de depuração

Durante a atividade, percebi que alguns problemas não são identificados apenas observando o código ou verificando se o projeto compila. Em alguns casos, foi necessário executar a aplicação, acompanhar as requisições e analisar as mensagens apresentadas no Console do navegador.

Um dos problemas identificados foi a utilização de uma rota incorreta na comunicação com a API. Outro problema que chamou atenção foi o erro React is not defined, que impedia completamente a renderização da aplicação.

A atividade permitiu compreender melhor a importância de investigar as causas dos erros antes de realizar alterações no código, além de reforçar o conhecimento sobre requisições HTTP, Hooks, estados, formulários e integração entre frontend e backend.

5. Checklist de validação

Listagem de produtos utilizando GET.
Cadastro de produtos utilizando POST.
Edição de produtos utilizando PUT.
Exclusão de produtos utilizando DELETE.
Carregamento dos dados na tela de edição.
Validação dos campos do formulário.
Tratamento de erros HTTP e de conexão.
Correção do erro React is not defined.
Execução dos testes automatizados.
Verificação do funcionamento integrado no navegador.
Captura de evidências da aplicação e da aba Network do DevTools.
