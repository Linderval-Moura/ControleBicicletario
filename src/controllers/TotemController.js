const Totem = require("../models/TotemModel"); // Certifique-se de importar o modelo Totem correto
const Bicicleta = require("../models/bicicletaModel");
const Tranca = require("../models/tranca");
const Response = require("../utils/responses");

class TotemController {
  constructor() {}

  // Método para cadastrar um novo totem
  async cadastrarTotem(req, res) {
    try {
      // Extrai dados da requisição
      const totemData = {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano_aquisicao: req.body.ano_aquisicao,
        localizacao: req.body.localizacao,
        descricao: req.body.descricao
      };

      // Verifica se todos os campos obrigatórios foram fornecidos
      if (!totemData.marca || !totemData.modelo || 
          !totemData.ano_aquisicao || !totemData.localizacao || 
          !totemData.descricao
      ) {
        return Response.sendInvalidData(res, "Dados inválidos, campos obrigatórios não foram fornecidos!");
      };

      // Cria um novo totem no banco de dados usando o modelo Totem
      const novoTotem = await Totem.create(totemData);
      // Retorna o novo totem criado em JSON
      Response.sendSucess(res, 'Dados cadastrados', novoTotem);
    } catch (error) {
      // Tratamento de erro em caso de falha na criação do totem
      Response.sendServerError(res, 'Erro no servidor, totem não cadastrado!');
    }
  }

  // Método para listar todos os totens
  async listarTotens(req, res) {
    try {
      // Recupera todos os totens do banco de dados
      const totens = await Totem.findAll({
        order: [['id', 'ASC']]
      });

      // Retorna a lista de totens em JSON
      return Response.sendSucess(res, null, totens);
    } catch (error) {
      // Tratamento de erro em caso de falha ao listar os totens
      Response.sendServerError(res, 'Erro no servidor, totens não listados!');
    }
  }

  // Método para recuperar um totem por ID
  async recuperarTotem(req, res) {
    try {
      // Recupera o ID do totem a partir dos parâmetros da requisição
      const { idTotem } = req.params;

      // Busca o totem no banco de dados pelo ID
      const totem = await Totem.findByPk(idTotem);

      // Se o totem não for encontrado, retorna um erro 404 (Not Found)
      if (!totem) {
        return Response.sendNotFound(res, "Dados inválidos, totem não encontrado");
      }

      // Retorna o totem encontrado em JSON
      Response.sendSucess(res, totem);
    } catch (error) {
      // Tratamento de erro em caso de falha ao recuperar o totem
      Response.sendServerError(res, 'Erro no servidor, totem não recuperado!');
    }
  }

  // Método para atualizar um totem por ID
  async atualizarTotem(req, res) {
    try {
      // Recupera o ID do totem a partir dos parâmetros da requisição
      const { idTotem } = req.params;

      // Extrai dados da requisição seguindo regra 2
      const totem = {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano_aquisicao: req.body.ano_aquisicao,
        localizacao: req.body.localizacao,
        descricao: req.body.descricao
      };

      // Se o totem não for encontrado, retorna um erro 404
      if (!totem) {
        return Response.sendNotFound(res, 'Dados invalidos, Totem não encontrado');
      }
      // Atualiza o totem no banco de dados pelo ID
      const totemAtualizado = await Totem.update(totem, {
        where: { id: idTotem }, returning: true, // Retorna o registro atualizado
      });

      if (!totemAtualizado) {
        return Response.sendNotFound(res, 'Dados invalidos, Totem não encontrado');
      }

      // Retorna o totem atualizado em JSON
      Response.sendSucess(res, 'Dados atualizados', totemAtualizado);
    } catch (error) {
      // Tratamento de erro em caso de falha ao atualizar o totem
      Response.sendServerError(res, 'Erro no servidor, totem não atualizado');
    }
  }

  // Método para deletar um totem por ID
  async deletarTotem(req, res) {
    try {
      // Recupera o ID do totem a partir dos parâmetros da requisição
      const { idTotem } = req.params;

      // Verificar se totem possui trancas associadas
      const relacao = await RelacaoTotemTranca.findOne({
        where: {totem_id},
      });

      // Apenas totens sem trancas podem ser excluídos
      if (idTotem === relacao) {
        return Response.sendNotFound(res, 'Não é permitido excluir um totem com trancas associadas');
      }

      // Remove o totem do banco de dados pelo ID
      const deletado = await Totem.destroy({
        where: { id: idTotem},
      });

      // Se o totem não for encontrado, retorna um erro 404
      if (!deletado) {
        return Response.sendNotFound(res, 'Dados invalidos, totem não encontrado');
      }

      // Retorna uma mensagem de sucesso
      Response.sendSucess(res, 'Totem deletado com sucesso');
    } catch (error) {
      // Tratamento de erro em caso de falha ao deletar o totem
      Response.sendServerError(res, 'Erro no servidor, totem não deletado');
    }
  }

  async listarTrancasEmTotem (req, res) {
    try {
      
      const { idTotem } = req.params;
  
      // Busca totem pelo ID com as trancas associadas
      const totem = await Totem.findByPk(idTotem, {
        include: [{ model: Tranca, as: "trancas" }],
      });
  
      // Se o totem não for encontrado, retorne um erro
      if (!totem) {
        return Response.sendNotFound(res, "Totem não encontrado");
      }
  
      // Retorna trancas associadas ao totem em JSON
      const trancas = totem.trancas || [];
      Response.sendSucess(res, "Trancas encontradas", trancas);
    } catch (error) {
      // Tratamento de erro em caso de falha ao listar as trancas do totem
      Response.sendServerError(res, "Erro no servidor, trancas não listadas");
    }
  }

  async listarbicicletasEmTotem (req, res) {
    try {
      // Recupera o ID do totem a partir dos parâmetros da requisição
      const { idTotem } = req.params;
  
      // Verifica se o totem existe no banco de dados
      const totem = await Totem.findByPk(idTotem);
  
      if (!totem) {
        return Response.sendNotFound(res, "Totem não encontrado");
      }
  
      const bicicletas = await totem.getBicicletas();
  
      // Retorna a lista de bicicletas em JSON
      Response.sendSucess(res, null, bicicletas);
    } catch (error) {
      // Tratamento de erro em caso de falha ao listar as bicicletas do totem
      Response.sendServerError(res, "Erro no servidor, bicicletas não listadas");
    }
  }
}

module.exports = TotemController;
