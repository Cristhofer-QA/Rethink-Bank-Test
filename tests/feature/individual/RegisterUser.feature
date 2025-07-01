Feature: Cadastro de usuário

  Scenario: Cadastro com dados válidos
    Given que possuo os dados obrigatórios para cadastro
    When realizo a requisição de cadastro com todos os dados válidos
    Then a resposta deve conter a mensagem de cadastro com sucesso
    And a resposta deve conter o campo confirmToken
    And o status da resposta deve ser 201
