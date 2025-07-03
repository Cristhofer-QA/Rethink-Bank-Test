# Rethink-Bank-Test
Repositório criado para realização de testes de API utilizando Jest, Cucumber e Supertest.

---
<br>

# Como rodar o projeto

Clone o repositório e acesse a pasta raiz. Nela, execute o comando:

```bash
npm  run  run-all
```
<br>

---


# RESPONDENDO AS PERGUNTAS

## 1 - Há bugs? Se sim, quais são e quais são os cenários esperados?

**Resposta:** Sim! Eu peguei os bugs relatados abaixo. Além dos bugs, na seção de "Anotações", descrevo alguns detalhes e (talvez) inconsistências do sistema, onde para informar se é um erro ou não, é necessária a documentação e entendimento completo da regra de negócios.

### Endpoint POST /cadastro
1. Cadastra o usuário quando a senha não possui números (que é pré-requisito).
- *Nesse caso, não deve permitir o cadastro, visto que o número na senha é obrigatório.*
<br>

### Endpoint POST /login
1. Está permitindo usuário deletado (/account) logar no sistema.(Não consigo saber se é o /login que está permitindo o login usuários de excluídos ou se o /account não está deletando os usuários).
- *Acredito que, para todas as requisições, é obrigatório o usuário estar ativo no sistema*
<br>

### Endpoint POST /points/send
1. Os pontos enviados (de forma correta) não está sendo creditado na conta do usuário que está recebendo.
- *O esperado é que, se a solicitação for concluída, adicionar o valor transferido à conta do usuário que o recebeu.*

2. Usuários deletados estão podendo realizar a transferência de pontos.
- *Acredito que, para todas as requisições, é obrigatório o usuário estar ativo no sistema*
<br>

### Endpoint POST /caixinha/deposit

1. Os pontos enviados à caixinha não estão sendo creditado na caixinha do usuário.
- *Quando os pontos são enviados à caixinha de forma correta, deve-se acrescentar o valor enviado ao já presente na caixinha.*

2. Os pontos enviados à caixinha não estão sendo debitados dos pontos 'normais' do usuário**
- *Aqui, não consigo definir se é um erro, pois, como não está creditando na caixinha, pode ser que não esteja debitando dos pontos 'normais' do usuário*

3. Está sendo possível enviar valores inválidos no body da requisição. Por exemplo: números negativos e letras. (Possivelmente não realiza nenhuma ação, mas não consigo validar, pois não está adicionando valores à caixinha).
- *Por se tratar de transferência de valores, mesmo não realizando nenhuma ação, deve-se aceitar apenas valores válidos, ou seja inteiros positivos*

4. Usuários deletados estão podendo realizar a requisição de adição à caixinha.
- *Acredito que, para todas as requisições, é obrigatório o usuário estar ativo no sistema*
<br>

### Endpoint POST /caixinha/withdraw
1. Usuários deletados estão podendo realizar a requisição de resgate de pontos da caixinha.
- *Acredito que, para todas as requisições, é obrigatório o usuário estar ativo no sistema*
<br>
<br>

## 2 - Se houver bugs, classifique-os em nível de criticidade.

### Endpoint POST /cadastro
1. **Alto** - *Ignorar critérios de segurança no cadastro de senha expõe o sistema a vulnerabilidades sérias, como senhas fracas e facilidade de invasão. Porém, não é nenhum impeditivo de utilização do sistema.*

  
### Endpoint POST /login

1. **Crítico** - *Um usuário excluído ter acesso novamente compromete diretamente autorização e segurança, o que pode permitir movimentações indevidas, fraudes e brechas no controle de contas.*
<br>

#### Endpoint POST /points/send

1. **Crítico** - Perda de pontos em uma transferência causa inconsistência financeira e quebra da confiança do usuário. O sistema não está garantindo a integridade da transação.

2. **Crítico** - Usuários inativos operando transações é um risco de fraude, especialmente num contexto bancário. O sistema falha em aplicar regras de bloqueio.
<br>

#### Endpoint POST /caixinha/deposit
1. **Alto** - O sistema não executa a função pretendida, mas não há perda de pontos, apenas falha no armazenamento/uso.

2. **Alto** - Indica ausência de validação de entrada, o que pode causar corrupção de dados ou bugs em massa.

3. **Crítico** - Mesmo princípio da transferência. Permitir ações financeiras com contas inválidas quebra segurança e integridade.

4. **Crítico** - Mesmo princípio que o anterior.
<br>

#### Endpoint POST /caixinha/withdraw

1. **Crítico** - Resgate por contas inválidas significa retirada indevida de pontos, podendo ser explorado maliciosamente.
<br>
<br>

## Diante do cenário, o sistema está pronto para subir em produção?
Resposta: Não! Acredito que o sistema tenha muitas falhas, tanto de segurança, quanto das funcionalidades principais.

---

<br>
<br>

# Anotações

1. Ao tentar cadastrar um usuário com um CPF já cadastrado, está retornando o status code 400, porém o erro retornado é estranho. Como se não fosse tratado. O mesmo acontece com o cadastro de e-mail já existente. Segue o erro retornado (cpf duplicado):
```bash

{"error":  "duplicate key value violates unique constraint \"users_cpf_key\""}

```
2. Ao tentar fazer login (/login) e enviar a senha com o valor NULL, está retornando erro 500. Mas se enviar uma string vazia, ai o sistema valida e retorna um erro de credencial (esperado). Já se enviar ambos os campos null (email e senha), também validado como credencial inválida.
3.  O mesmo 'erro' do ponto 2 acontece para o endpoint de exclusão de usuário (/account).
4. Na documentação não deixa claro se o usuário deletado não pode conseguir realizar a transferência ou o resgate de pontos para a caixinha.
Todavia, ESTÁ permitindo. Por acreditar ser um erro, o inseri na seção de "Respondendo as perguntas".
