<h1 align="center">
   Sistema de controle de bicicletário - Microsservice Equipamento.
</h1>

# Instalação:
1. Clone o repositório:
```
git clone https://github.com/Linderval-Moura/ControleBicicletario.git
```

2.	Instale as dependências com `npm`
```
npm install 
```

3. Configure o .env para o servidor que deseja utilizar

4. Faça as migrações para o servidor:
```
npx sequelize-cli db:migration
```

5. Rode o servidor pelo src ou pelo dist:
```
- node ./src\server.js
- node .\dist\server.js
```

6. Utilize o Insomnia ou postman para enviar as requisições
```
- https://insomnia.rest/download
- https://www.postman.com/
```

# Teconologias:
```
- Node
- Sequelize
- Express
- PostGRES (banco de dados)
```
