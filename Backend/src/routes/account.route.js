const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const accountController = require('../controllers/account.controller')
const router = express.Router();

/**
 * -POST  /api/accounts
 * - Create a new account for the authenticated user
 */
router.post('/',authMiddleware.authMiddleware , accountController.createAccountController)


/**
 * - GET /api/accounts
 * - Get all accounts of the authenticated user
 */
router.get('/', authMiddleware.authMiddleware , accountController.getAccountsController)


/**
 * - GET /api/accounts/balance/:accountId
 * - Get the balance of the authenticated user's accounts
 */

router.get('/balance/:accountId', authMiddleware.authMiddleware , accountController.getAccountBalanceController)



module.exports = router;