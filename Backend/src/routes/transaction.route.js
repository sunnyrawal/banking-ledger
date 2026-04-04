const {Router} = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller');

const transctionRoutes = Router();


/**
 * - POST /api/transactions
 * - Craete a new transaction
 */

transctionRoutes.post('/', authMiddleware.authMiddleware ,transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system account to a user account
 */

transctionRoutes.post('/system/initial-funds', authMiddleware.systemAuthMiddleware ,transactionController.createInitialFundsTransaction);



module.exports = transctionRoutes;