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

1. Ao tentar cadastrar um usuário com um CPF já cadastrado, está retornando o status code 400, porém o erro retornado é estranho. Como se não fosse tratado. O mesmo acontece com o cadastro de e-mail já existente. Segue o erro retornado (cpf duplicado):

```bash
    {"error": "duplicate key value violates unique constraint \"users_cpf_key\""}
```

2. A documentação não deixa claro se, ao cadastrar um usuário, é obrigatória a confirmação de e-mail para prosseguir no login, ou esse endpoint (/confirm-email) é usando apenas para verificação.
   Não foi possível realizar o login sem essa validação. Para a suíte de teste, vou considerá-lo como correto.

3. Ao tentar fazer login (/login) e enviar a senha com o valor NULL, está retornando erro 500. Mas se enviar uma string vazia, ai o sistema valida e retorna um erro de credencial (esperado). Já se enviar ambos os campos null (email e senha), também validado como credencial inválida.

4. O mesmo 'erro' do ponto 3 acontece para o endpoint de exclusão de usuário (/account).


## Erros encontrados

1. Endpoint POST /cadastro
   Cadastra o usuário quando a senha não possui números (que é pré-requisito).

2. Endpoint POST /login
   Está permitindo usuário deletado (/account) logar no sistema.
   (Não consigo saber se é o /login que está permitindo o login usuários de excluídos ou se p /account não está deletando os usuários). 