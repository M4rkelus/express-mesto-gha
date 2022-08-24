const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  cardValidate,
  cardIdValidate,
} = require('../middlewares/validation');

router.get('/', getCards); // Get all cards
router.post('/', cardValidate, createCard); // Create new card
router.delete('/:cardId', cardIdValidate, deleteCard); // Delete card by ID
router.put('/:cardId/likes', cardIdValidate, likeCard); // Put like on card
router.delete('/:cardId/likes', cardIdValidate, dislikeCard); // Remove like from card

module.exports = router;
