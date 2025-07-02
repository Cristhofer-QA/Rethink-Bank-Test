Feature: Login

  Scenario: Login com usuário cadastrado e validado
    Given que tenho um usuário cadastrado e com email confirmado
    When realizo a requisição de login, informando as credenciais do usuário validado
    Then a resposta deve conter um token
    And o status da resposta deve ser 200


    
#   Scenario: Login com usuário cadastrado e não validado
#   Scenario: Login com email incorreto
#   Scenario: Login com senha incorreta
#   Scenario: Login sem email
#   Scenario: Login sem senha
#   Scenario: Login sem email e senha
#   Scenario: Login com credenciais válidas para um usuário excluído
