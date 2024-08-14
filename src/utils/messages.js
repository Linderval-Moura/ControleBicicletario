class Messages {
    POST_TRANCA_200 = 'Dados cadastrados';
    POST_TRANCA_422 = 'Dados inválidos';

    GET_TRANCA_ID_200 = 'Tranca encontrada';
    GET_TRANCA_ID_404 = 'Não encontrado';

    PUT_TRANCA_ID_200 = 'Dados cadastrados';
    PUT_TRANCA_ID_404 = 'Não encontrado';
    PUT_TRANCA_ID_422 = 'Dados inválidos';

    DELETE_TRANCA_ID_200 = 'Tranca removida';
    DELETE_TRANCA_ID_404 = 'Não encontrado';
    DELETE_TRANCA_ID_422 = 'Dados inválidos';

    GET_TRANCA_BICICLETA_200 = 'Tranca encontrada';
    GET_TRANCA_BICICLETA_404 = 'Bicicleta não encontrada';
    GET_TRANCA_BICICLETA_422 = 'Id da tranca inválido';

    POST_TRANCA_TRANCAR_200 = 'Ação bem sucedida';
    POST_TRANCA_TRANCAR_404 = 'Não encontrado';
    POST_TRANCA_TRANCAR_422 = 'Dados inválidos ou tranca já se encontra trancada';

    POST_TRANCA_DESTRANCAR_200 = 'Ação bem sucedida';
    POST_TRANCA_DESTRANCAR_404 = 'Não encontrado';
    POST_TRANCA_DESTRANCAR_422 = 'Dados inválidos';

    POST_TRANCA_STATUS_200 = 'Ação bem sucedida';
    POST_TRANCA_STATUS_404 = 'Não encontrado';
    POST_TRANCA_STATUS_422 = 'Dados inválidos';

    POST_TRANCA_INTEGRAR_200 = 'Dados cadastrados';
    POST_TRANCA_INTEGRAR_422 = 'Dados inválidos';

    POST_TRANCA_RETIRAR_200 = 'Dados cadastrados';
    POST_TRANCA_RETIRAR_422 = 'Dados inválidos (ex status inválido da tranca)';

    SERVER_INTERNAL_ERROR = 'Erro desconhecido';
    NOT_GREATER_THAN_ZERO = 'O numero precisa ser maior que zero';
    INVALID_STATUS = 'Status inválido';

    BICICLETA_EM_USO = 'Esta bicicleta nao esta em uso';
    BICICLETA_NAO_ENCONTRADA = 'Bicicleta nao encontrada';
    TOTEM_NAO_ENCONTRADO = 'Totem nao encontrado';
    TRANCA_NAO_ENCONTRADA = 'Tranca nao encontrada';
    DADOS_CADASTRADOS = 'Dados cadastrados';
    STATUS_INVALIDO = 'O estado passado nao e um estado valido';
    TOTEM_LOTADO = 'O totem passado esta lotado';
    TRANCA_NAO_PERTENCE = 'O totem passado nao possui esta tranca';
    TRANCA_ESTADO_INCOMPATIVEL = 'O estado da tranca nao e compativel com esta acao';
    BICICLETAS_DIFERENTES = 'A bicicleta recebida e a bicicleta existente na tranca diferem entre si';
    
}

module.exports = Messages;