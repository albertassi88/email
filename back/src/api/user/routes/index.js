const express = require('express');
const controler = require('../controllers');
const checkToken = require('../../../services/jwt'); 
const multer = require('../../../services/multer'); 

const router = express.Router();

router.get('/', checkToken, controler.getUser);
router.get('/:id', checkToken, controler.getUserId);
router.post('/', controler.postUser);
router.post('/auth', controler.postAuthUser);
router.post('/sendEmail/:id', checkToken, controler.postSendEmail);
router.post('/newPassword', controler.postNewPassword);
router.post('/forgetEmail', controler.postForgetEmail);
router.put('/:id', multer.array('upload'), checkToken, controler.putUser);
router.put('/client/:userId', checkToken, controler.atualizarClient);
router.put('/update/:id', checkToken, controler.atualizarUser);
router.put('/updateTicket/:id', multer.array('upload'), controler.putAddTicket);
router.delete('/client/:userId', checkToken, controler.deleteClient);
router.delete('/ticket/:id', checkToken, controler.deleteTicket);


module.exports = router;
