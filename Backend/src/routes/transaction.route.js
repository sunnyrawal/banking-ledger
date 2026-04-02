const {Router} = require('express');
const authMiddleware = require('../middlewares/auth.middleware')

const transctionRoutes = Router();


/**
 * - POST /api/transactions
 * - Craete a new transaction
 */

transctionRoutes.post('/', authMiddleware.authMiddleware  )

module.exports = transctionRoutes;