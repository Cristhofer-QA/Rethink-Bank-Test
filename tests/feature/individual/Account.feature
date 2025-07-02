Feature: Exclusão de conta

  Background:
    Given que tenha um usuário cadastrado com um e-mail já confirmado

  Scenario: Exclusão correta de conta
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, informando a senha correta para esse usuário
    Then a resposta deve conter uma mensagem de sucesso
    And o status da resposta deve ser 200

  Scenario: Exclusão de conta informando senha inválida
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, informando uma senha incorreta para esse usuário
    Then a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

  Scenario: Exclusão de conta não informando senha
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, informando uma senha vazia
    Then a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

  Scenario: Exclusão de conta informando senha nula
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, informando uma senha nula
    Then a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

  Scenario: Exclusão de conta informando senha de outro usuário
    And possuo a senha de outro usuário cadastrado e validado
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, informando uma senha de um outro usuário
    Then a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 400

  Scenario: Exclusão de conta não informando o bearer token
    When logo no sistema com esse usuário
    And realizo a requisição de exclusão de conta, com dados corretos, mas sem bearer token
    Then a resposta deve conter uma mensagem de erro
    And o status da resposta deve ser 401
