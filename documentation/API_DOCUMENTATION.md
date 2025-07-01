Projeto Roche / epharma
Documentação para uso de APIs – Zicard
Métodos:
•	Autenticação para uso dos métodos:
para obter o token exigido para executar os endpoints abaixo é necessário fazer uma autenticação no API gateway da Zicard.
url: 	http://k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com/geral/autenticacao
login:	epharma@zicard.com.br
Senha: Zrd@9032!8*
	Esse endpoint retornará um token que deverá ser utilizado no header dos outros endpoints, como Authorization Bearer ....

Endpoints para uso no hotsite:
url:	http://k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com/geral/action
token:	No header de cada método utilizar o Authorization Bearer *token obtido da autenticação*
IMPORTANTE:
A url para acessar os métodos abaixo será sempre a mesma informada acima assim como o token também.
No body da requisição terá sempre um campo chamado “Action” que indica ao endpoint o processamento que será realizado.
A estrutura do body será sempre assim:
{
  "action": "Nome do método",
  "body": {
    "campo1": "valor",
    “campo2”: “valor”, etc..
  }
}

Abaixo segue a lista de endpoints e a seguir o detalhamento de cada um deles.

•	ConsultarCPF
•	CadastrarSenha
•	ValidarCodigo
•	ReenviarCodigo
•	AutenticarUsuario
•	ConsultarSaldo
•	ListarProdutos
•	MeusPontos
•	MeusVouchers
•	ResgatarVoucher

Descrição dos métodos
•	ConsultarCPF
Este método irá consultar o CPF na base de dados local. Caso não encontre fará uma busca na epharma. Obtendo os dados do participante na API da epharna o método faz a inclusão na base de dados local e retorna o id do participante e seu nome.

o	Request
{
  "action": "ConsultarCPF",
  "body": {
    "cpf": "05746937002"
  }
}
o	Response - quando o CPF informado já está cadastrado na base local.
{
  "success": 1,
  "message": "Participante cadastrado!",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar Senha"
  }
}
O campo “proximoPasso” serve para orientar o frontend sobre o que deve ser feito em seguida.

o	Response - quando o CPF informado NÃO está cadastrado na base do programa da Roche.
{
  "success": 0,
  "message": "CPF não encontrado na base de dados do programa.",
  "data": {
    "proximoPasso": "Solicitar novo CPF"
  }
}

o	Response - quando o CPF informado NÃO está cadastrado na base local.
{
  "success": 1,
  "message": "Participante incluído com sucesso na base local!",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Cadastrar Senha"
  }
}

o	Response - quando houver algum erro inesperado.
		{
		  "success": 0,
		  "message": "Erro de comunicação.: Status 0",
		  "data": {
			       "proximoPasso": "Solicitar novo CPF"
		   }
		}

 
•	CadastrarSenha
Este método irá armazenar na base de dados local o senha informada pelo usuário no front end.

o	Request
{
"action": "CadastrarSenha",
"body": {
"idparticipante": 537894257, -- recebido no ConsultarCPF
"senha": "Teste@1234",
"confirmasenha": "Teste@1234"
}
}
o	Response - quando o participante ainda não tem senha cadastrada
A API vai cadastrar a senha e retornar o código de validação. Esse código expira em 15 minutos
{
  "success": 1,
  "message": "Senha atende as regras.",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "codigoValidacao": "12345666",
    "proximoPasso": "Validar código"
  }
}

o	Response - quando o participante JÁ TEM senha cadastrada
A API vai retornar informando que já tem senha cadastrada. Ele deve fazer login:
{
  "success": 0,
  "message": "Participante já tem senha cadastrada.:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Fazer login"
  }
}

o	Response - quando a senha não confere com a confirmação de senha:
{
  "success": 0,
  "message": "A senha não confere com a senha confirmada.:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar nova senha"
  }
}

o	Response - quando a senha não atende as regras exigidas:
- Mínimo de 6 caracteres
- 1 ou mais letra maiúscula
- 1 ou mais letra minúscula
- 1 ou mais número de 0 a 9
- 1 caracter especial
{
  "success": 0,
  "message": "A senha informada não atende as regras exigidas:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar nova senha"
  }
}

•	ValidarCodigo
Este método irá validar o código de verificação informado. Esse código deve estar dentro do período de validade e deve estar registrado na base de dados local

o	Request
{
  "action": "ValidarCodigo",
  "body": {
    "idparticipante": 537894257,
    "codigovalidacao": "606628"
  }
}
 
o	Response - quando o código já expirou
{
  "success": 0,
  "message": "Este código já expirou!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar código"
  }
}

o	Response - quando o código informado é diferente do que foi gerado
{
  "success": 0,
  "message": "Código inválido!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar CPF"
  }
}

o	Response - quando o código informado válido
{
  "success": 1,
  "message": "Código validado!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Fazer login"
  }
}

•	ReenviarCodigo
Este método irá gerar um novo código de verificação e enviar ao usuário. 

o	Request
{
  "action": "ReenviarCodigo",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response - quando o código já foi validado
{
  "success": 0,
  "message": "Participante já validou seu código!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Fazer login"
  }
}

o	Response - quando o código ainda não foi validado
{
  "success": 1,
  "message": "Código reenviado com sucesso!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar código"
  }
}

•	AutenticarUsuario
Este deve ser utilizado para fazer o login do usuário depois que ele informou o cpf e a senha.

o	Request
{
  "action": "AutenticarUsuario",
  "body": {
    "idparticipante": 537894257,
    "senha": "Abc@123"
  }
}

o	Response - quando os dados estão corretos
{
  "success": 1,
  "message": " Autenticação feita com sucesso!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Liberar área logada"
  }
}

o	Response - quando o código ainda não foi validado
{
  "success": 0,
  "message": " Falha na autenticação - Código não validado!",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Validar código"
  }
}

o	Response – quando os dados informados não conferem
{
  "success": 0,
  "message": " Falha na autenticação - CPF ou senha incorreto!",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "proximoPasso": "Solicitar senha"
  }
}

•	ConsultarSaldo
Este método é utilizado para consultar o saldo disponível do participante.

o	Request
{
  "action": "ConsutarSaldo",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response 
{
  "success": 1,
  "message": " Consullta realizada com sucesso.",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    “saldo”: “1340”,
    "proximoPasso": "Atualizar saldo no site"
  }
}

•	ListarProdutos
Este método é utilizado para retornar a lista de produtos que será exibida no hotsite.
IMPORTANTE:
Esse método mostra o número de pontos dependendo da qtde que o usuário escolher. Qtde 1 = x pontos, Qtde 2 = y pontos, Qtde 3 = z pontos.
O site deve atualizar o número de pontos que será utilizado no resgate na medida que o usuário alterar a quantidade.
Sugiro que a página mostre algo como: 1 cx = x pontos, 2cxs = y pontos, 3cxs = z pontos.
O usuário pode escolher somente a qtde 1, 2 ou 3.


o	Request
{
  "action": "ListarProdutos",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response 
{
  "success": 1,
  "message": "Consulta realizada com sucesso!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "saldo": "16969",
    "produtos": [
      {
        "idproduto": 1,
        "nomeproduto": "ACCU-CHEK ACTIVE",
        "descricaoproduto": "Accu-Chek Active é uma linha de tiras de glicemia, desenvolvida pela Roche, para que as pessoas possam testar seus níveis de açúcar no sangue. As tiras Active são fáceis de manusear e oferecem ao usuário maior flexibilidade durante a realização dos seus testes e resultados precisos em até 5 segundos!",
        "caminhofoto": "https://zicard-accentiv.s3.us-east-1.amazonaws.com/zicard/TIRAS_ACTIVE_50_BOX_vs2022_CML.png",
        "pontos_qtd_1": 6500,
        "pontos_qtd_2": 11000,
        "pontos_qtd_3": 15000,
        "sku": 67811
      }
]
}
}
•	ConsultarSaldo
Este método é utilizado para consultar o saldo disponível do participante.

o	Request
{
  "action": "ConsutarSaldo",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response 
{
  "success": 1,
  "message": " Consullta realizada com sucesso.",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    “saldo”: “1340”,
    "proximoPasso": "Atualizar saldo no site"
  }
}

•	MeusPontos
Este método é utilizado para consultar as transações do usuário com a pontuação creditada a ele.

o	Request
{
  "action": "MeusPontos",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response 
{
  "success": 1,
  "message": "Consulta realizada com sucesso!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "saldo": "16969",
    "transacoes": [
      {
        "datacompra": "06/04/2025",
        "loja_nome": "PAGUE MENOS - 469 - MATERLANDIA",
        "produto_nome": "ACCU-CHEK ACTIVE",
        "tr_qtde_produto": 20,
        "tr_pontos": 19340
      },
      {
        "datacompra": "06/04/2025",
        "loja_nome": "PAGUE MENOS - 239 - LIMOEIRO",
        "produto_nome": "ACCU-CHEK ACTIVE",
        "tr_qtde_produto": 2,
        "tr_pontos": 1453
      },
      {
        "datacompra": "06/04/2025",
        "loja_nome": "FARMACIA EXTRAFARMA -843- 7 DE SETEMBRO",
        "produto_nome": "ACCU-CHEK GUIDE",
        "tr_qtde_produto": 2,
        "tr_pontos": 1709
      },
      {
        "datacompra": "06/04/2025",
        "loja_nome": "PAGUE MENOS - 1096 - ARACAJU",
        "produto_nome": "ACCU-CHEK GUIDE",
        "tr_qtde_produto": 1,
        "tr_pontos": 967
      }
    ]
  }
}

•	MeusVouchers
Este método é utilizado para consultar os vouchers que o participante resgatou assim como as informações de onde ele utilizou na compra do produto escolhido.

o	Request
{
  "action": "MeusVouchers",
  "body": {
    "idparticipante": 537894257
  }
}

o	Response
    {
  "success": 1,
  "message": "Consulta realizada com sucesso!:",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "saldo": "10469",
    "resgates": [
      {
        "dataresgate": "24/06/2025",
        "datautilzacao": "24/06/2025",
        "loja": "PAGUE MENOS - 282 - PARNAMIRIM",
        "produto": "ACCU-CHEK ACTIVE",
        "qtde": 1,
        "pontos": 6500,
        "dataviginicio": "25/06/2025",
        "datavigfim": "05/07/2025",
        "status": "Utilizado"
      },
      {
        "dataresgate": "26/06/2025",
        "datautilzacao": "",
        "loja": "",
        "produto": "ACCU-CHEK GUIDE",
        "qtde": 1,
        "pontos": 6500,
        "dataviginicio": "26/06/2025",
        "datavigfim": "26/06/2026",
        "status": "Emitido"
      }
    ]
  }
}

•	ResgatarVoucher
Este método deve ser utilizado para fazer o resgate de voucher do participante após a escolha do produto e respectiva quantidade.

o	Request
{
  "action": "ResgatarVoucher",
  "body": {
    "idparticipante": 537894257,
    “idproduto”: 2,
    “qtde”: 1
  }
}

o	Response
    {
  "success": 1,
  "message": "Resgate registrado com sucesso na base local!",
  "data": {
    "idparticipante": "537894257",
    "nome": "ANDRESSA RODRIGUES DA SILVA",
    "codigovoucher": "CODVOUCHER906",
    "viginicio": "26/06/2025",
    "figfim": "26/06/2026",
    "proximoPasso": "Exibir dados resgate."
  }
}
