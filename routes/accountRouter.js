import express from 'express';
import { accountModel } from '../models/accountModel.js';

const router = express.Router();

// Not for use
router.post('/', async (req, res, next) => {
  try {
    const newStudent = new accountModel(req.body);
    await newStudent.save();
    res.send(newStudent);
  } catch (err) {
    next(err);
  }
});

/**
 * 4. Crie um endpoint para registrar um depósito em uma conta. Esse endpoint deverá
receber como parâmetros a “agencia”, o número da conta e o valor do depósito. Ele
deverá atualizar o “balance” da conta, incrementando-o com o valor recebido como
parâmetro. O endpoint deverá validar se a conta informada existe, caso não exista
deverá retornar um erro, caso exista retornar o saldo atual da conta 
*/
router.put('/deposit', async (req, res, next) => {
  //..agencia, numero da conta, valor de deposito
  try {
    const { agencia, conta, value } = req.body;
    if (!agencia || !conta || value == null) {
      throw new Error('Dados insuficientes para o deposito.');
    }
    const updatedAccount = await accountModel.findOneAndUpdate(
      {
        agencia,
        conta,
      },
      { $inc: { balance: value } },
      { new: true, useFindAndModify: false }
    );
    if (updatedAccount) {
      const { name, balance } = updatedAccount;
      res.send({ agencia, conta, name, balance });
    } else {
      throw new Error('Conta nao encontrada.');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 5. Crie um endpoint para registrar um saque em uma conta. Esse endpoint deverá
receber como parâmetros a “agência”, o número da conta e o valor do saque. Ele
deverá atualizar o “balance” da conta, decrementando-o com o valor recebido com
parâmetro e cobrando uma tarifa de saque de (1). O endpoint deverá validar se a
conta informada existe, caso não exista deverá retornar um erro, caso exista retornar
o saldo atual da conta. Também deverá validar se a conta possui saldo suficiente
para aquele saque, se não tiver deverá retornar um erro, não permitindo assim que
o saque fique negativo.
 */
router.put('/withdraw', async (req, res, next) => {
  try {
    //..agencia, numero da conta, valor do saque
    const { agencia, conta, value } = req.body;
    if (!agencia || !conta || value == null) {
      throw new Error('Dados insuficientes para o saque.');
    }
    const dataAccount = await accountModel.findOne({
      agencia: agencia,
      conta: conta,
    });
    if (dataAccount) {
      if (dataAccount.balance <= value + 1) {
        throw new Error('Saldo insuficiente para o saque.');
      }

      const updatedBalance = {
        balance: dataAccount.balance - (value + 1),
      };
      const updatedAccount = await accountModel.findOneAndUpdate(
        {
          agencia,
          conta,
        },
        updatedBalance,
        { new: true }
      );
      const { name, balance } = updatedAccount;
      res.send({ agencia, conta, name, balance });
    } else {
      throw new Error('Conta nao encontrada.');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 6. Crie um endpoint para consultar o saldo da conta. Esse endpoint deverá receber
como parâmetro a “agência” e o número da conta, e deverá retornar seu “balance”.
Caso a conta informada não exista, retornar um erro.

 */
router.get('/', async (req, res, next) => {
  //..agencia, numero da conta
  try {
    const { agencia, conta } = req.query;
    if (!agencia || !conta) {
      throw new Error('Dados insuficientes para a consulta.');
    }
    const dataAccount = await accountModel.findOne({
      agencia: agencia,
      conta: conta,
    });
    if (dataAccount) {
      const { name, balance } = dataAccount;
      res.send({ agencia, conta, name, balance });
    } else {
      throw new Error('Conta nao encontrada.');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 7. Crie um endpoint para excluir uma conta. Esse endpoint deverá receber como
parâmetro a “agência” e o número da conta e retornar o número de contas ativas
para esta agência.
 */
router.delete('/delete', async (req, res, next) => {
  //..agencia, conta
  try {
    const { agencia, conta } = req.query;
    const result = await accountModel.findOneAndDelete({
      agencia,
      conta,
    });
    if (result) {
      const dataAccounts = await accountModel.find({ agencia: agencia });
      const numAccounts = dataAccounts.length;
      res.send({ agencia, numAccounts }); //return num de contas ativas na agencia
    } else {
      throw new Error('Conta nao encontrada.');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 8. Crie um endpoint para realizar transferências entre contas. Esse endpoint deverá
receber como parâmetro o número da “conta” origem, o número da “conta” destino e
o valor de transferência. Esse endpoint deve validar se as contas são da mesma
agência para realizar a transferência, caso seja de agências distintas o valor de tarifa
de transferência (8) deve ser debitado na conta origem. O endpoint deverá retornar
o saldo da conta origem.

 */
router.put('/transfer', async (req, res, next) => {
  // query origem
  // body destino
  try {
    const transferFee = 8;
    const { agencia: origAgencia, conta: origConta } = req.query;
    const { agencia: destAgencia, conta: destConta, value } = req.body;
    const origAccount = await accountModel.findOne({
      agencia: origAgencia,
      conta: origConta,
    });
    console.log(origAccount);
    if (origAccount) {
      const { _id: origId, balance: origBalance } = origAccount;
      if (origBalance >= value + transferFee) {
        const destAccount = await accountModel.findOne({
          agencia: destAgencia,
          conta: destConta,
        });
        const { _id: destId, balance: destBalance } = destAccount;
        await accountModel.findOneAndUpdate(
          { _id: destId },
          {
            balance: destBalance + value,
          }
        );
        const updatedAccount = await accountModel.findOneAndUpdate(
          { _id: origId },
          {
            balance: origBalance - (value + transferFee),
          },
          { new: true }
        );

        res.send(updatedAccount);
      } else {
        throw new Error('Saldo insuficiente para tranferencia.');
      }
    }
    throw new Error('Conta de origem nao encontrada.');
  } catch (err) {
    next(err);
  }
});

/**
 * 9. Crie um endpoint para consultar a média do saldo dos clientes de determinada
agência. O endpoint deverá receber como parâmetro a “agência” e deverá retornar
o balance médio da conta.
 */
router.get('/average', async (req, res, next) => {
  try {
    const { agencia } = req.query;
    console.log(agencia);
    if (!agencia) {
      throw new Error('Dados insuficientes para a consulta.');
    }
    const accountsByAgencia = await accountModel.aggregate([
      { $match: { agencia: parseInt(agencia, 10) } },
      { $group: { _id: '$agencia', media: { $avg: '$balance' } } },
    ]);
    if (accountsByAgencia.length > 0) {
      const { _id, media } = accountsByAgencia[0];
      res.send({ agencia: _id, media });
    } else {
      throw new Error('Agencia nao encontrada.');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 10. Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint
deverá receber como parâmetro um valor numérico para determinar a quantidade de
clientes a serem listados, e o endpoint deverá retornar em ordem crescente pelo
saldo a lista dos clientes (agência, conta, saldo).
 */
router.get('/poorer', async (req, res, next) => {
  try {
    const { limit } = req.query;
    if (!limit) {
      throw new Error('Dados insuficientes para a consulta.');
    }
    const poorerClients = await accountModel.aggregate([
      { $project: { _id: 0, agencia: 1, conta: 1, balance: 1 } },
      { $sort: { balance: 1 } },
      { $limit: parseInt(limit, 10) },
    ]);
    res.send(poorerClients);
  } catch (err) {
    next(err);
  }
});

/**
 * 11. Crie um endpoint para consultar os clientes mais ricos do banco. O endpoint deverá
receber como parâmetro um valor numérico para determinar a quantidade de clientes
a serem listados, e o endpoint deverá retornar em ordem decrescente pelo saldo,
crescente pelo nome, a lista dos clientes (agência, conta, nome e saldo).
 */
router.get('/richer', async (req, res, next) => {
  try {
    const { limit } = req.query;
    if (!limit) {
      throw new Error('Dados insuficientes para a consulta.');
    }
    const richerClients = await accountModel.aggregate([
      { $project: { _id: 0, agencia: 1, conta: 1, balance: 1, name: 1 } },
      { $sort: { balance: -1 } },
      { $limit: parseInt(limit, 10) },
    ]);
    res.send(richerClients);
  } catch (err) {
    next(err);
  }
});

/**
 * 12. Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
agência para a agência private agencia=99. O endpoint deverá retornar a lista dos
clientes da agencia private
 */
router.put('/upgradePrivate', async (req, res, next) => {
  try {
    const agencies = await accountModel.distinct('agencia');

    const richerClients = await Promise.all(
      agencies.map(async (agenciaFilter) => {
        const richerClient = await accountModel.aggregate([
          { $match: { agencia: agenciaFilter } },
          { $sort: { balance: -1 } },
          { $limit: 1 },
        ]);
        const { _id } = richerClient[0];
        const updatedClient = await accountModel.findOneAndUpdate(
          { _id: _id },
          { $set: { agencia: 99 } },
          { new: true }
        );
        return { updatedClient };
      })
    );

    console.log(agencies);
    res.send(richerClients);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(`Ocorreu o erro: ${err}`);
});

export { router as accountRouter };
