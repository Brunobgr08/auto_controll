const motoristaRepository = require('../repositories/MotoristaRepository');
const { AppError } = require('../middlewares/errorHandler');

class MotoristaService {
  // Criar motorista
  async criar(motoristaData) {
    // Verificar se motorista com mesmo nome já existe
    if (motoristaRepository.motoristaExiste(motoristaData.nome)) {
      throw new AppError('Já existe um motorista com este nome', 409);
    }

    const motorista = motoristaRepository.criar(motoristaData);
    return motorista;
  }

  // Buscar motorista por ID
  async buscarPorId(id) {
    const motorista = motoristaRepository.buscarPorId(id);

    if (!motorista) {
      throw new AppError('Motorista não encontrado', 404);
    }

    return motorista;
  }

  // Listar motoristas
  async listar(filtros = {}) {
    return motoristaRepository.listar(filtros);
  }

  // Atualizar motorista
  async atualizar(id, dadosAtualizacao) {
    // Verificar se motorista existe
    const motoristaExistente = motoristaRepository.buscarPorId(id);
    if (!motoristaExistente) {
      throw new AppError('Motorista não encontrado', 404);
    }

    // Se estiver atualizando o nome, verificar se não conflita
    if (
      dadosAtualizacao.nome &&
      motoristaRepository.motoristaExiste(dadosAtualizacao.nome, id)
    ) {
      throw new AppError('Já existe outro motorista com este nome', 409);
    }

    const motoristaAtualizado = motoristaRepository.atualizar(
      id,
      dadosAtualizacao
    );
    return motoristaAtualizado;
  }

  // Excluir motorista
  async excluir(id) {
    // TODO: Verificar se motorista está em utilização antes de excluir
    // (será implementado na Issue #12)

    const excluido = motoristaRepository.excluir(id);

    if (!excluido) {
      throw new AppError('Motorista não encontrado', 404);
    }

    return { message: 'Motorista excluído com sucesso' };
  }
}

module.exports = new MotoristaService();
