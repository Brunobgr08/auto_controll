const automovelService = require('../services/AutomovelService');
const logger = require('../utils/logger');

class AutomovelController {
  // Criar automóvel
  async criar(req, res, next) {
    try {
      logger.info('Criando novo automóvel', { body: req.body });

      const automovel = await automovelService.criar(req.body);

      logger.info('Automóvel criado com sucesso', { id: automovel.id });
      res.status(201).json(automovel);
    } catch (error) {
      next(error);
    }
  }

  // Buscar automóvel por ID
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Buscando automóvel por ID', { id });

      const automovel = await automovelService.buscarPorId(id);

      res.status(200).json(automovel);
    } catch (error) {
      next(error);
    }
  }

  // Listar automóveis
  async listar(req, res, next) {
    try {
      const { cor, marca } = req.query;
      const filtros = {};

      if (cor) filtros.cor = cor;
      if (marca) filtros.marca = marca;

      logger.info('Listando automóveis', { filtros });

      const automoveis = await automovelService.listar(filtros);

      res.status(200).json(automoveis);
    } catch (error) {
      next(error);
    }
  }

  // Atualizar automóvel
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Atualizando automóvel', { id, body: req.body });

      const automovelAtualizado = await automovelService.atualizar(
        id,
        req.body
      );

      logger.info('Automóvel atualizado com sucesso', { id });
      res.status(200).json(automovelAtualizado);
    } catch (error) {
      next(error);
    }
  }

  // Excluir automóvel
  async excluir(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Excluindo automóvel', { id });

      const resultado = await automovelService.excluir(id);

      logger.info('Automóvel excluído com sucesso', { id });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AutomovelController();
