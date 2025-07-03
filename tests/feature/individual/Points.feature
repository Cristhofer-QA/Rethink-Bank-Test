Feature: Transferência de pontos

Scenario: Transferência de pontos correta
    Given que possuo um usuário transferidor cadastrado e validado, com pontos
    And possuo um usuário recebedor cadastrado e validado
    When realizo a requisição de envio de pontos corretamente
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200 
    And deve subtrair os pontos enviados da quantidade total do usuário de envio
    And deve adicionar os pontos recebidos aos pontos já possuídos do usuário de envio
    And deve gerar um histórico de transação de pontos para o usuário de envio
    And deve gerar um histórico de transação de pontos para o usuário recebedor

Scenario: Transferência total de pontos
    Given que possuo um usuário transferidor cadastrado e validado, com pontos
    And possuo um usuário recebedor cadastrado e validado
    When realizo a requisição de envio de todos os pontos disponíveis
    Then a requisição deve retornar uma mensagem de confirmação
    And o status da requisição deve ser 200 
    And deve subtrair todos os pontos do usuário de envio
    And deve adicionar todos os pontos ao usuário recebedor
    And deve gerar um histórico de transação de pontos para o usuário de envio
    And deve gerar um histórico de transação de pontos para o usuário recebedor

Scenario: Transferência de pontos inválida - saldo insuficiente
    Given que possuo um usuário transferidor cadastrado e validado, com pontos
    And possuo um usuário recebedor cadastrado e validado
    When realizo a requisição de envio de pontos com quantidade maior do que a disponível
    Then a requisição deve retornar uma mensagem de erro
    And o status da requisição deve ser 400 
    And não deve subtrair pontos do usuário de envio
    And não deve adicionar pontos ao usuário recebedor
    And não deve gerar um histórico de transação de pontos para o usuário de envio
    And não deve gerar um histórico de transação de pontos para o usuário recebedor
    
# Scenario: Transferência de pontos inválida = usuário recebedor não está ativo
# Scenario: Transferência de pontos inválida - usuário de envio não está ativo
# Scenario: Transferência de pontos inválida - usuário recebedor não existe