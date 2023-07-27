const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { title } = req.body
    const { id } = req.user

    collection_name = convertirTituloASlug(title)

    const pathUserWithCollection = getUserPathWithCollection(id, collection_name)

    fs.mkdirSync(pathUserWithCollection, { recursive: true })
    cb(null, pathUserWithCollection)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //new Date().toISOString() + "-" + 
    // cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });

const docsValidation = require('../../validations/doc.validation');
const docsController = require('../../controllers/doc.controller');
const { getUserPathWithCollection } = require('../../utils/generatePath');
const { convertirTituloASlug } = require('../../utils/stringUtils');

const router = express.Router();

router
  .route('/new')
  .post(auth('docs'), upload.array('file'), validate(docsValidation.createDoc), docsController.createDoc);

router
  .route('/ask')
  .post(auth('docs'), validate(docsValidation.askDoc), docsController.askDoc);

router
  .route('/')
  .get(auth('getDocs'), docsController.getDocs);

router
  .route('/info')
  .post(auth('getDocs'), validate(docsValidation.infoDoc), docsController.getInfo);


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