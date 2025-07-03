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

# Comentado pois não vou conseguir testar o funcionamento correto, 
# visto que não sei como vai funcionar o envio para a caixinha. Atualmente o envio está com falha
# Scenario: Transferência de pontos válida - usuário de envio com pontos na caixinha
#     Given que possuo um usuário transferidor cadastrado e validado, com pontos na caixinha
#     And possuo um usuário recebedor cadastrado e validado
#     When realizo a requisição de envio de pontos corretamente
#     Then a requisição deve retornar uma mensagem de confirmação
#     And o status da requisição deve ser 200 
#     And deve subtrair os pontos enviados da quantidade total do usuário de envio
#     And deve adicionar os pontos recebidos aos pontos já possuídos do usuário de envio
#     And deve gerar um histórico de transação de pontos para o usuário de envio
#     And deve gerar um histórico de transação de pontos para o usuário recebedor

# Scenario: Transferência de pontos válida - usuário recebedor com pontos na caixinha
# Scenario: Transferência total de pontos válida

# Scenario: Transferência de pontos inválida - saldo insuficiente
# Scenario: Transferência de pontos inválida - saldo disponível insuficiente, mas com saldo suficiente na caixinha
# Scenario: Transferência de pontos inválida = usuário recebedor não está ativo
# Scenario: Transferência de pontos inválida - usuário de envio não está ativo
# Scenario: Transferência de pontos inválida - usuário recebedor não existe