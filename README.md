# Rethink-Bank-Test

Repositório criado para realização de testes de API utilizando Jest, Cucumber e Supertest.

---



## Como rodar o projeto

Clone o repositório e acesse a pasta raiz. Nela, execute o comando:

```bash
npm run run-all

```


---
## Anotações

1. Ao tentar cadastrar um usuário com um CPF já cadastrado, está retornando o status code 400,
porém o erro retornado é estranho. Como se não fosse tratado. O mesmo acontece com o cadastro de e-mail já existente. Segue o erro retornado (cpf duplicado):

```bash
    {"error": "duplicate key value violates unique constraint \"users_cpf_key\""}
```


## Erros encontrados

1. Endpoint POST /cadastro
   Cadastra o usuário quando a senha não possui números (que é pré-requisito).