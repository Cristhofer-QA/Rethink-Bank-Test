Feature: Confirmação de e-mail

  Scenario: Confirmação correta de e-mail
    Given que tenho um usuário cadastrado que não possua e-mail confirmado
    When realizo a requisição de confirmar e-mail para o usuário que não foi confirmado
    Then o status da resposta deve ser 200 (para a confirmação do e-mail ainda não confirmado)
    And a resposta deve apresentar a mensagem de confirmação (do e-mail ainda não confirmado)

  Scenario: Confirmar um e-mail já confirmado
    Given que tenha um usuário cadastrado com um e-mail já confirmado
    When realizo a requisição de confirmar e-mail para o usuário que já foi confirmado
    Then o status da responta deve ser 200 (para a confirmação já realizada)
    And a resposta deve apresentar a mensagem de confirmação (para a confirmação já realizada)

  Scenario: Confirmar um e-mail com um token inválido
    Given que tenha um usuário cadastrado e com o token retornado
    When realizo a requisição de confirmar e-mail informando um token incorreto
    Then o status da responta deve ser 400 (para a confirmação com token incorreto)
    And a resposta não deve apresentar a mensagem de confirmação (para a confirmação com token incorreto)

  Scenario: Confirmar um e-mail sem token
    Given que tenha um usuário cadastrado e com o token retornado (validação sem token)
    When realizo a requisição de confirmar e-mail não informando um token
    Then o status da responta deve ser 400 (para a confirmação sem token)
    And a resposta não deve apresentar a mensagem de confirmação (para a confirmação sem token)
