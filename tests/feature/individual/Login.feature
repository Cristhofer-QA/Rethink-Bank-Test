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
    # And a resposta de conter uma mensagem de conta não validada
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



    # Examples:
    #   | scenario                                     | email                | password            |
    #   | Email incorreto                              | ${CPF_MENOS_DIG}     | ${FULL_NAME_VALIDO} |
    #   | Email inválido                               | ${CPF_MENOS_DIG}     | ${FULL_NAME_VALIDO} |
    #   | Senha incorreta                              | ${CPF_COM_PONTUACAO} | ${FULL_NAME_VALIDO} |
    #   | Senha inválida                               | ${CPF_COM_PONTUACAO} | ${FULL_NAME_VALIDO} |
    #   | Sem email                                    | ${CPF_COM_LETRA}     | ${FULL_NAME_VALIDO} |
    #   | Sem senha                                    | ${NULL)              | ${FULL_NAME_VALIDO} |
    #   | Sem email e senha                            | ${NULL)              | ${FULL_NAME_VALIDO} |
    #   | Credenciais válidas para um usuário excluído | ${NULL)              | ${FULL_NAME_VALIDO} |
#   Scenario: Login com email incorreto
#   Scenario: Login com email inválido
#   Scenario: Login com senha incorreta
#   Scenario: Login com senha inválida
#   Scenario: Login sem email
#   Scenario: Login sem senha
#   Scenario: Login sem email e senha
#   Scenario: Login com credenciais válidas para um usuário excluído
