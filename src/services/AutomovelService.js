const automovelRepository = require('../repositories/AutomovelRepository');
const { AppError } = require('../middlewares/errorHandler');

class AutomovelService {
  // Criar automóvel
  async criar(automovelData) {
    // Verificar se placa já existe
    if (automovelRepository.placaExiste(automovelData.placa)) {
      throw new AppError('Já existe um automóvel com esta placa', 409);
    }

    const automovel = automovelRepository.criar(automovelData);
    return automovel;
  }

  // Buscar automóvel por ID
  async buscarPorId(id) {
    const automovel = automovelRepository.buscarPorId(id);

    if (!automovel) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    return automovel;
  }

  // Listar automóveis
  async listar(filtros = {}) {
    return automovelRepository.listar(filtros);
  }

  // Atualizar automóvel
  async atualizar(id, dadosAtualizacao) {
    // Verificar se automóvel existe
    const automovelExistente = automovelRepository.buscarPorId(id);
    if (!automovelExistente) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    // Se estiver atualizando a placa, verificar se não conflita
    if (
      dadosAtualizacao.placa &&
      automovelRepository.placaExiste(dadosAtualizacao.placa, id)
    ) {
      throw new AppError('Já existe outro automóvel com esta placa', 409);
    }

    const automovelAtualizado = automovelRepository.atualizar(
      id,
      dadosAtualizacao
    );
    return automovelAtualizado;
  }

  // Excluir automóvel
  async excluir(id) {
    const excluido = automovelRepository.excluir(id);

    if (!excluido) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    return { message: 'Automóvel excluído com sucesso' };
  }
}

module.exports = new AutomovelService();
