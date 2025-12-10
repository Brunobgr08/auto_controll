const motoristaService = require('../services/MotoristaService');
const logger = require('../utils/logger');

class MotoristaController {
  // Criar motorista
  async criar(req, res, next) {
    try {
      logger.info('Criando novo motorista', { body: req.body });

      const motorista = await motoristaService.criar(req.body);

      logger.info('Motorista criado com sucesso', { id: motorista.id });
      res.status(201).json(motorista);
    } catch (error) {
      next(error);
    }
  }

  // Buscar motorista por ID
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Buscando motorista por ID', { id });

      const motorista = await motoristaService.buscarPorId(id);

      res.status(200).json(motorista);
    } catch (error) {
      next(error);
    }
  }

  // Listar motoristas
  async listar(req, res, next) {
    try {
      const { nome } = req.query;
      const filtros = {};

      if (nome) filtros.nome = nome;

      logger.info('Listando motoristas', { filtros });

      const motoristas = await motoristaService.listar(filtros);

      res.status(200).json(motoristas);
    } catch (error) {
      next(error);
    }
  }

  // Atualizar motorista
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Atualizando motorista', { id, body: req.body });

      const motoristaAtualizado = await motoristaService.atualizar(
        id,
        req.body
      );

      logger.info('Motorista atualizado com sucesso', { id });
      res.status(200).json(motoristaAtualizado);
    } catch (error) {
      next(error);
    }
  }

  // Excluir motorista
  async excluir(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Excluindo motorista', { id });

      const resultado = await motoristaService.excluir(id);

      logger.info('Motorista excluído com sucesso', { id });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MotoristaController();
