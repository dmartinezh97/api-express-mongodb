const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const docsValidation = require('../../validations/docs.validation');
const docsController = require('../../controllers/docs.controller');

const router = express.Router();

router
  .route('/new')
  .post(auth('docs'), upload.single('file'), validate(docsValidation.createDoc), docsController.createDoc);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Docs
 *   description: Relacionado con los documentos
 */

/**
 * @swagger
 * /docs/new:
 *   post:
 *     summary: Subir un documento nuevo
 *     description: Solo usuarios registrados pueden crear nuevos documentos.
 *     tags: [Docs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: must be unique
 *             example:
 *               name: Documento sobre la historia de la programación
 *               file: Documento_sobre_la_historia_de_la_programación.pdf
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */