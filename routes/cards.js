const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // Get all cards
router.post('/', createCard); // Create new card
router.delete('/:cardId', deleteCard); // Delete card by ID
router.put('/:cardId/likes', likeCard); // Put like on card
router.delete('/:cardId/likes', dislikeCard); // Remove like from card

module.exports = router;
