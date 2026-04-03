const {Router} = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller');

const transctionRoutes = Router();


/**
 * - POST /api/transactions
 * - Craete a new transaction
 */

transctionRoutes.post('/', authMiddleware.authMiddleware ,transactionController.createTransaction);

module.exports = transctionRoutes;