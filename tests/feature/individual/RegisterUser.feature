Feature: Cadastro de usuário

  Scenario: Cadastro com dados válidos
    Given que possuo todos os dados para o cadastro de usuário
    When realizo a requisição de cadastro com todos os dados válidos
    Then a resposta deve conter a mensagem de cadastro com sucesso
    And a resposta deve conter o campo confirmToken
    And o status da resposta deve ser 201

  Scenario: Cadastro com CPF já cadastrado
    Given que eu possua o CPF de um usuário já cadastrado
    When realizo a requisição de cadastro informando o CPF já cadastrado
    Then deve retornar uma responta informando que CPF já está cadastrado
    And o status da resposta deve ser 400 para o CPF já está cadastrado

  Scenario: Cadastro com email já cadastrado
    Given que eu possua o email de um usuário já cadastrado
    When realizo a requisição de cadastro informando o email já cadastrado
    Then deve retornar uma responta informando que email já está cadastrado
    And o status da resposta deve ser 400 para o email já está cadastrado

  Scenario Outline: Cadastro com CPF inválido - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>" e "<password>" pra cadastro com CPF inválido
    When realizo a requisição de cadastro com o CPF inválido
    Then a responta deve conter um erro para o CPF inválido
    And o status da resposta deve ser 400 para o CPF inválido

    Examples:
      | scenario              | cpf                  | full_name           | email           | password           |
      | CPF com menos dígitos | ${CPF_MENOS_DIG}     | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |
      | CPF com pontuação     | ${CPF_COM_PONTUACAO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |
      | CPF com letra         | ${CPF_COM_LETRA}     | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |
      | Sem CPF               | ${NULL)              | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |

  Scenario Outline: Cadastro com full_name invalido - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>" e "<password>" pra cadastro com Full Name inválido
    When realizo a requisição de cadastro com o full_name invalido
    Then a responta deve conter um erro para o full_name invalido
    And o status da resposta deve ser 400 para o full_name invalido

    Examples:
      | scenario                    | cpf           | full_name        | email           | password           |
      | Full Name só com uma string | ${CPF_VALIDO} | ${NOME_UNITARIO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |
      | Sem Full Name               | ${CPF_VALIDO} | ${NULL)          | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} |

  Scenario Outline: Cadastro com email invalido - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>" e "<password>" pra cadastro com email inválido
    When realizo a requisição de cadastro com o full_name invalido
    Then a responta deve conter um erro para o full_name invalido
    And o status da resposta deve ser 400 para o full_name invalido

    Examples:
      | scenario       | cpf           | full_name           | email                | password           |
      | Email sem @    | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_SEM_ARROBA}  | ${PASSWORD_VALIDA} |
      | Email sem .com | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_SEM_DOT_COM} | ${PASSWORD_VALIDA} |
      | Sem email      | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${NULL)              | ${PASSWORD_VALIDA} |

  Scenario Outline: Cadastro com senha inválida - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>" e "<password>" pra cadastro com senha inválida
    When realizo a requisição de cadastro com senha inválida
    Then a responta deve conter um erro com senha inválida
    And o status da resposta deve ser 400 com senha inválida

    Examples:
      | scenario                     | cpf           | full_name           | email           | password                           |
      | Senha com menos de 8 dígitos | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_MENOS_DIG}              |
      | Senha sem letra minúscula    | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_SEM_MINUSCULA}          |
      | Senha sem letra maiúscula    | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_SEM_MAIUSCULA}          |
      | Senha sem caractere especial | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_SEM_CARACTERE_ESPECIAL} |
      | Senha sem número             | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_SEM_NUMERO}             |
      | Sem senha                    | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${NULL)                            |

  Scenario Outline: Cadastro com confirmação de senha inválida - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>", "<password>" e "<password_confirm>" pra cadastro com confirmação de senha inválida
    When realizo a requisição de cadastro com confirmação de senha inválida
    Then a responta deve conter um erro com confirmação de senha inválida
    And o status da resposta deve ser 400 com confirmação de senha inválida

    Examples:
      | scenario                        | cpf           | full_name           | email           | password           | password_confirm              |
      | Senha de confirmação diferente  | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} | ${PASSWORD_CONFIRM_DIFERENTE} |
      | Senha de confirmação não válida | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} | ${PASSWORD_CONFIRM_INVALIDA}  |
      | Sem senha de confirmação        | ${CPF_VALIDO} | ${FULL_NAME_VALIDO} | ${EMAIL_VALIDO} | ${PASSWORD_VALIDA} | ${NULL)                       |
