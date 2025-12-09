const automovelRepository = require('../repositories/AutomovelRepository');
const motoristaRepository = require('../repositories/MotoristaRepository');
const { AppError } = require('./errorHandler');

const validateAutomovelExists = async (req, res, next) => {
  try {
    const { automovelId } = req.params;

    if (automovelId) {
      const automovel = automovelRepository.buscarPorId(automovelId);
      if (!automovel) {
        throw new AppError('Automóvel não encontrado', 404);
      }

      // Adicionar o automóvel ao request para uso posterior
      req.automovel = automovel;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateMotoristaExists = async (req, res, next) => {
  try {
    const { motoristaId } = req.params;

    if (motoristaId) {
      const motorista = motoristaRepository.buscarPorId(motoristaId);
      if (!motorista) {
        throw new AppError('Motorista não encontrado', 404);
      }

      // Adicionar o motorista ao request para uso posterior
      req.motorista = motorista;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateAutomovelExists,
  validateMotoristaExists,
};