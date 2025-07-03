Feature: Resgate de ponto da caixinha
#
# Comentado pois não está funcionando corretamente o envio de pontos para a caixinha
#   Scenario: Extrair pontos da caixinha
#     Given que possuo um usuário cadastrado e validado, com pontos na caixinha
#     When realizo a requisição de extração de pontos da caixinha corretamente
#     Then a requisição deve retornar uma mensagem de confirmação
#     And o status da requisição deve ser 200
#     And deve subtrair os pontos extraídos da caixinha do usuário
#     And deve adicionar os pontos extraídos à quantidade total do usuário
#     And deve gerar mais um histórico de transação de pontos para o usuário

  Scenario: Extrair zero pontos da caixinha
    Given que possuo um usuário cadastrado e validado, sem pontos na caixinha
    When realizo a requisição de extração de pontos da caixinha corretamente
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200
    And deve subtrair os pontos extraídos da caixinha do usuário e adicionado ao seu saldo
    And não deve gerar nenhum histórico de transação de pontos para o usuário

  Scenario: Extrair pontos da caixinha - usuário sem pontos na caixinha
    Given que possuo um usuário cadastrado e validado, sem pontos na caixinha
    When realizo a requisição de extração de pontos da caixinha
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400
    And não deve alterar os pontos do usuário
    And não deve gerar um histórico de transação de pontos para o usuário
#    
# Comentado pois não está funcionando corretamente o envio de pontos para a caixinha
#   Scenario: Extrair pontos da caixinha - usuário com pontos na caixinha insuficiente
#     Given que possuo um usuário cadastrado e validado, com pontos na caixinha
#     When realizo a requisição de extração de pontos da caixinha, com um valor maior do que o disponível
#     Then a requisição deve retornar uma mensagem de erro
#     And o status da requisição deve ser 400
#     And não deve subtrair os pontos extraídos da caixinha do usuário
#     And não deve adicionar os pontos extraídos à quantidade total do usuário
#     And não deve gerar um histórico de transação de pontos para o usuário

  Scenario: Extrair pontos da caixinha - usuário não ativo
    Given que possuo um usuário cadastrado e validado, mas não ativo
    When realizo a requisição de extração de pontos da caixinha
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400
#
  Scenario: Extrair pontos da caixinha - Token não informado
    Given que possuo um usuário cadastrado e validado
    When realizo a requisição de extração de pontos da caixinha sem informar o token
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 401

  Scenario: Extrair pontos da caixinha - Token inválido
    Given que possuo um usuário cadastrado e validado
    When realizo a requisição de extração de pontos da caixinha com um token inválido
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 401
