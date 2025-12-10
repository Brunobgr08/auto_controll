const utilizacaoService = require('../services/UtilizacaoService');
const logger = require('../utils/logger');

class UtilizacaoController {
  // Criar utilização
  async criar(req, res, next) {
    try {
      logger.info('Criando nova utilização', { body: req.body });

      const utilizacao = await utilizacaoService.criar(req.body);

      logger.info('Utilização criada com sucesso', { id: utilizacao.id });
      res.status(201).json(utilizacao);
    } catch (error) {
      next(error);
    }
  }

  // Buscar utilização por ID
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Buscando utilização por ID', { id });

      const utilizacao = await utilizacaoService.buscarPorId(id);

      res.status(200).json(utilizacao);
    } catch (error) {
      next(error);
    }
  }

  // Listar utilizações
  async listar(req, res, next) {
    try {
      const { ativa } = req.query;
      const filtros = {};

      if (ativa !== undefined) {
        filtros.ativa = ativa === 'true' || ativa === true;
      }

      logger.info('Listando utilizações', { filtros });

      const utilizacoes = await utilizacaoService.listar(filtros);

      res.status(200).json(utilizacoes);
    } catch (error) {
      next(error);
    }
  }

  // Finalizar utilização
  async finalizar(req, res, next) {
    try {
      const { id } = req.params;
      const { dataTermino } = req.body;

      logger.info('Finalizando utilização', { id, dataTermino });

      const utilizacao = await utilizacaoService.finalizar(id, dataTermino);

      logger.info('Utilização finalizada com sucesso', { id });
      res.status(200).json(utilizacao);
    } catch (error) {
      next(error);
    }
  }

  // Excluir utilização
  async excluir(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Excluindo utilização', { id });

      const resultado = await utilizacaoService.excluir(id);

      logger.info('Utilização excluída com sucesso', { id });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // Verificar se automóvel está em uso
  async verificarAutomovelEmUso(req, res, next) {
    try {
      const { automovelId } = req.params;
      logger.info('Verificando se automóvel está em uso', { automovelId });

      const resultado = await utilizacaoService.automovelEstaEmUso(automovelId);

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // Verificar se motorista está em uso
  async verificarMotoristaEmUso(req, res, next) {
    try {
      const { motoristaId } = req.params;
      logger.info('Verificando se motorista está em uso', { motoristaId });

      const resultado = await utilizacaoService.motoristaEstaEmUso(motoristaId);

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UtilizacaoController();
