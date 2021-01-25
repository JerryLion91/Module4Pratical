import express from 'express';
import { accountModel } from '../models/accountModel';

const router = express.Router();
/**
 *  4. endpoint para deposito
 *  5. endpoint para saque
 *  6. endpoint para consulta
 *  7. endpoint para exlusao da conta
 *  8. endpoint para tranferencias
 *  9. endpoint para consultar media do saldo
 * 10. endpoint para colsultar menor saldo
 * 11. endpoint para consulta os client mais ricos
 * 12. endpoint com agencia private
 */

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
router.put(async (req, res, next) => {
  try {
    //..
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
router.put(async (req, res, next) => {
  try {
    //..
  } catch (err) {
    next(err);
  }
});

/**
 * 6. Crie um endpoint para consultar o saldo da conta. Esse endpoint deverá receber
como parâmetro a “agência” e o número da conta, e deverá retornar seu “balance”.
Caso a conta informada não exista, retornar um erro.

 */
router.get(async (req, res, next) => {
  try {
    //..
  } catch (err) {
    next(err);
  }
});

/**
 * 7. Crie um endpoint para excluir uma conta. Esse endpoint deverá receber como
parâmetro a “agência” e o número da conta e retornar o número de contas ativas
para esta agência.
 */
router.delete(async (req, res, next) => {
  try {
    //..
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
router.put(async (req, res, next) => {
  try {
    //..
  } catch (err) {
    next(err);
  }
});

/**
 * 9. Crie um endpoint para consultar a média do saldo dos clientes de determinada
agência. O endpoint deverá receber como parâmetro a “agência” e deverá retornar
o balance médio da conta.

 */
router.get(async (req, res, next) => {
  try {
    //..
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
router.get(async (req, res, next) => {
  try {
    //..
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
router.get(async (req, res, next) => {
  try {
    //..
  } catch (err) {
    next(err);
  }
});

/**
 * 12. Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
agência para a agência private agencia=99. O endpoint deverá retornar a lista dos
clientes da agencia private
 */
router.put(async (req, res, next) => {
  try {
    //..
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(500).send(`Ocorreu o erro: ${err}`);
});
