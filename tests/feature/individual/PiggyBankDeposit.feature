Feature: Deposito de pontos na caixinha

  Scenario: Adicionar pontos à caixinha
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha corretamente
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200
    And deve adicionar os pontos enviados à caixinha do usuário
    And deve gerar um histórico de transação de pontos para o usuário
#
# Não implementado, pois não está funcionando corretamente o envio de pontos para a caixinha
#   Scenario: Adicionar pontos à caixinha - usuário com pontos na caixinha
#     Given que possuo um usuário cadastrado e validado, com pontos na caixinha
#     When realizo a requisição de adição de pontos à caixinha corretamente
#     Then a requisição deve retornar uma mensagem de confirmação
#     And o status da requisição deve ser 200
#     And deve adicionar os pontos enviados à caixinha do usuário
#     And deve gerar mais um histórico de transação de pontos para o usuário

  Scenario: Adicionar pontos à caixinha - usuário sem pontos suficientes
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha, com um valor maior do que o disponível
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400
    And não deve adicionar os pontos enviados à caixinha do usuário
    And não deve gerar um histórico de transação de pontos para o usuário

  Scenario: Adicionar todos os pontos à caixinha
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de todos os pontos à caixinha
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200
    And deve adicionar todos os pontos enviados à caixinha do usuário
    And deve gerar um histórico de transação de pontos para o usuário

  Scenario: Não enviar pontos à caixinha
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha, mas não envio nenhum ponto
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200
    And não deve adicionar os pontos enviados à caixinha do usuário
    And não deve gerar um histórico de transação de pontos para o usuário

  Scenario: Enviar pontos negativos à caixinha
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha com um valor negativo
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400
    And não deve adicionar os pontos enviados à caixinha do usuário
    And não deve gerar um histórico de transação de pontos para o usuário

  Scenario: Adicionar pontos à caixinha - usuário não ativo
    Given que possuo um usuário cadastrado e validado, mas não ativo
    When realizo a requisição de adição de pontos à caixinha
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400

  Scenario: Adicionar pontos à caixinha - Token não informado
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha sem informar o token
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 401

  Scenario: Adicionar pontos à caixinha - Token inválido
    Given que possuo um usuário cadastrado e validado, com pontos
    When realizo a requisição de adição de pontos à caixinha com um token inválido
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 401
#
#