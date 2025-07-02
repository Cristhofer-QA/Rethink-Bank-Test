Feature: Login

  Scenario: Login com usuário cadastrado e validado
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando as credenciais do usuário validado
    Then a resposta deve conter um token
    And o status da resposta deve ser 200

  Scenario: Login com usuário cadastrado e não validado
    Given que tenho um usuário cadastrado e com email não confirmado
    When realizo a requisição de login, informando as credenciais do usuário não validado
    Then a resposta não deve conter um token
    And a resposta de conter uma mensagem de conta não validada
    And o status da resposta deve ser 400

  Scenario Outline: Login com campos incorretos - <scenario>
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando o campo "<fieldIncorrect>" incorreto
    Then a resposta não deve conter um token
    And a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

    Examples:
      | scenario        | fieldIncorrect |
      | Email incorreto | EMAIL          |
      | Senha incorreta | SENHA          |

  Scenario Outline: Login com campos inválidos - <scenario>
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando o campo "<fieldInvalid>" inválido
    Then a resposta não deve conter um token
    And a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

    Examples:
      | scenario       | fieldInvalid |
      | Email inválido | EMAIL        |
      | Senha inválida | SENHA        |

  Scenario Outline: Login com campos nulos - <scenario>
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando o campo "<fieldNull>" null
    Then a resposta não deve conter um token
    And a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

    Examples:
      | scenario          | fieldNull |
      | Sem email         | EMAIL     |
      | Sem senha         | SENHA     |
      | Sem email e senha | ALL       |

  Scenario Outline: Login com campos vazios - <scenario>
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando o campo "<fieldNull>" vazio
    Then a resposta não deve conter um token
    And a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

    Examples:
      | scenario          | fieldNull |
      | Sem email         | EMAIL     |
      | Sem senha         | SENHA     |
      | Sem email e senha | ALL       |

  Scenario: Login correto mas para usuário deletado
    Given que tenho um usuário cadastrado, com email confirmado, mas deletado
    When realizo a requisição de login, informando as informações desse usuário
    Then a resposta não deve conter um token
    And o status da resposta não deve ser 200

