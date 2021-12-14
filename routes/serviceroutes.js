const express = require('express');
const controller = require('../controllers/serviceController');
const {isGuest,isLoggedIn,isAuthor,isnotHost,isrsvpcreator} = require('../middlewares/auth')
const {validateId,validateService,validationResult} = require('../middlewares/validator')

const router = express.Router();

//GET /petservices: send all stories to the user

router.get('/', controller.index);

//GET /petservices/new: send html form for creating a new story

router.get('/createservice',isLoggedIn, controller.new);

//GET /petservices/:id: send details of story identified by id
router.get('/:id',validateId, controller.show);
//POST /petservices: create a new story

router.post('/',isLoggedIn,validateService,validationResult, controller.create);

//GET /petservices/:id/edit: send html form for editing an exising story
router.get('/:id/edit',validateId,isLoggedIn,isAuthor, controller.edit);

router.post('/rsvpevent',isLoggedIn,isnotHost, controller.rsvpevent);

router.delete('/rsvpdelete/:id',isLoggedIn,isrsvpcreator,controller.rsvpdelete);

// //PUT /petservices/:id: update the story identified by id
router.put('/:id',validateId,isLoggedIn,isAuthor,validateService,validationResult,controller.update);

//DELETE /petservices/:id, delete the story identified by id
router.delete('/:id',validateId,isLoggedIn,isAuthor, controller.delete);

module.exports = router;