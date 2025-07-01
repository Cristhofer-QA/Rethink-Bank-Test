Feature: Cadastro de usuário
  # Scenario: Cadastro com dados válidos
  #   Given que possuo todos os dados para o cadastro de usuário
  #   When realizo a requisição de cadastro com todos os dados válidos
  #   Then a resposta deve conter a mensagem de cadastro com sucesso
  #   And a resposta deve conter o campo confirmToken
  #   And o status da resposta deve ser 201
  # Scenario: Cadastro com CPF já cadastrado
  #   Given que eu possua o CPF de um usuário já cadastrado
  #   When realizo a requisição de cadastro informando o CPF já cadastrado
  #   Then deve retornar uma responta informando que CPF já está cadastrado
  #   And o status da resposta deve ser 400 para o CPF já está cadastrado
  #  Scenario: Cadastro com email já cadastrado
  #   Given que eu possua o email de um usuário já cadastrado
  #   When realizo a requisição de cadastro informando o email já cadastrado
  #   Then deve retornar uma responta informando que email já está cadastrado
  #   And o status da resposta deve ser 400 para o email já está cadastrado
  # Scenario Outline: Cadastro com CPF inválido - <scenario>
  #   Given que possuo os dados "<cpf>", "<full_name>", "<email>", "<password>" e "<confirm_password>" pra cadastro com CPF inválido
  #   When realizo a requisição de cadastro com o CPF inválido
  #   Then a responta deve conter um erro para o CPF inválido
  #   And o status da resposta deve ser 400 para o CPF inválido
  #   Examples:
  #     | scenario              | cpf            | full_name     | email              | password    | confirm_password |
  #     | CPF com menos dígitos |         123456 | João da Silva | j_silva@xpto.com   | Teste01@    | Teste01@         |
  #     | CPF com pontuação     | 785.541.236-99 | Fábio Pasquim | f_pasquim@xpto.com | aSdGa25!!@  | aSdGa25!!@       |
  #     | CPF com letra         |    9875622145A | Roger Bento   | g_bento@xpto.com   | fd@%448fACX | fd@%448fACX      |
  #     | Sem CPF               |                | Pedro Roberto | p.roberto@xpto.com | fdAW2#@#    | fdAW2#@#         |
  # Scenario Outline: Cadastro com full_name invalido - <scenario>
  #   Given que possuo os dados "<cpf>", "<full_name>", "<email>", "<password>" e "<confirm_password>" pra cadastro com Full Name inválido
  #   When realizo a requisição de cadastro com o full_name invalido
  #   Then a responta deve conter um erro para o full_name invalido
  #   And o status da resposta deve ser 400 para o full_name invalido
  #   Examples:
  #     | scenario                    | cpf         | full_name | email              | password   | confirm_password |
  #     | Full Name só com uma string | 98747852444 | João      | j_silva@xpto.com   | tsCa4d22@  | tsCa4d22@        |
  #     | Sem Full Name               | 89874110259 |           | f_pasquim@xpto.com | aSdGa25!!@ | aSdGa25!!@       |
  # Scenario Outline: Cadastro com email invalido - <scenario>
  #   Given que possuo os dados "<cpf>", "<full_name>", "<email>", "<password>" e "<confirm_password>" pra cadastro com email inválido
  #   When realizo a requisição de cadastro com o full_name invalido
  #   Then a responta deve conter um erro para o full_name invalido
  #   And o status da resposta deve ser 400 para o full_name invalido
  #   Examples:
  # #     | scenario    | cpf         | full_name  | email               | password    | confirm_password |
  # #     | Email sem @ | 98747852444 | João Souza | j_souza1exemplo.com | tsaCa4d22@  | tsaCa4d22@       |
  # #     | Sem email   | 78985669878 | Fábio Lins |                     | aSdGda25!!@ | aSdGda25!!@      |

  Scenario Outline: Cadastro com senha inválida - <scenario>
    Given que possuo os dados "<cpf>", "<full_name>", "<email>", "<password>" e "<confirm_password>" pra cadastro com senha inválida
    When realizo a requisição de cadastro com senha inválida
    Then a responta deve conter um erro com senha inválida
    And o status da resposta deve ser 400 com senha inválida

    Examples:
      | scenario                     | cpf         | full_name       | email                 | password  | confirm_password |
      | Senha com menos de 8 dígitos | 78554115225 | João Souza      | j_souza1@exemplo.com  | Ca4d22@   | Ca4d22@          |
      | Senha sem letra minúscula    | 98889668558 | Fábio Gustavo   | g.g@xpto.com          | FS#ADD15@ | FS#ADD15@        |
      | Senha sem letra maiúscula    | 00145887444 | Gustavo Paulo   | gp@xpto.com           | sr4!!@cdc | sr4!!@cdc        |
      | Senha sem caractere especial | 72555525520 | Jorge Rodrigues | jj_rogr1gues@xpto.com | saAwfWW5  | saAwfWW5         |
      | Senha sem número             | 08898521185 | Joana D' Ávida  | jsdsasv@xpto.com      | iIkUjJJd@ | iIkUjJJd@        |
      | Sem senha                    | 01158855487 | Talis Pereira   | talis_p1@xpto.com     |           |                  |
