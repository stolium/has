const en: Record<string, string> = {
  // Gate
  'gate.title': 'hideandseek',
  'gate.subtitle': 'A companion app for hide-and-seek. Choose your role to begin.',
  'gate.hider': "I'm the Hider",
  'gate.seeker': "I'm a Seeker",
  'gate.forceReset': 'Force Reset',
  'gate.confirmReset': 'This will end the current game. Are you sure?',
  'back': 'Back',

  // Seeker
  'seeker.menu': 'Seeker Menu',
  'seeker.hintActive': 'A hint is currently active. Dismiss the timer to ask another.',
  'seeker.askHint': 'Ask This Hint',
  'seeker.hintUsed': 'Used',
  'seeker.pickDraw': 'Pick {pick}, Draw {draw}',
  'seeker.hintHistory': 'Hint History ({count})',

  // Timer
  'timer.hintActive': 'Hint Active',
  'timer.locationReached': 'Location Reached',
  'timer.dismiss': 'Dismiss',
  'timer.answerReceived': 'Answer Received',
  'timer.timesUp': "Time's up! Ask the hider for their answer.",

  // Hider
  'hider.deck': 'Hider Deck',
  'hider.drawPile': 'Draw Pile',
  'hider.left': '{count} left',
  'hider.discardPile': 'Discard Pile',
  'hider.cards': '{count} cards',
  'hider.activeHand': 'Active Hand ({count})',
  'hider.emptyHand': 'No curses or powerups in hand. Start a draft to get cards.',

  // Draft
  'draft.title': 'Start Draft',
  'draft.description': "When seekers ask a hint, start a draft matching the hint's reward tier.",
  'draft.pick3draw2': 'Pick 3, Draw 2',
  'draft.pick2draw1': 'Pick 2, Draw 1',
  'draft.noCards': 'No cards available to draft.',
  'draft.phase': 'Draft Phase',
  'draft.selectCards': 'Select {count} Card',
  'draft.selectCardsPlural': 'Select {count} Cards',
  'draft.instructions': 'Time bonuses go to your score. Curses and powerups go to your hand. Unchosen cards return to the deck.',
  'draft.confirm': 'Confirm Selection ({current}/{total})',

  // Card actions
  'card.play': 'Play',
  'card.discard': 'Discard',
  'card.cost': 'Cost: {cost}',
  'card.confirmPlay': 'Activate "{name}"?\n\n{effect}',
  'card.confirmDiscard': 'Discard "{name}" without activating?',

  // Showcase
  'showcase.close': 'Done',

  // Discard overlay
  'discard.phase': 'Discard Phase',
  'discard.selectCards': 'Select {count} card(s) to discard',
  'discard.allCards': 'All cards will be discarded',
  'discard.selectTimeBonuses': 'Select time bonuses worth at least {min} minutes',
  'discard.confirmDiscard': 'Discard {count} Card(s)',
  'discard.confirmTimeBonuses': 'Discard {mins} Minutes',
  'discard.cancel': 'Cancel',
  'discard.noCards': 'No cards available to discard.',

  // Hand overflow
  'overflow.phase': 'Hand Limit Exceeded',
  'overflow.subtitle': 'You have too many cards. Discard {count} to get back to {max}.',
  'overflow.confirm': 'Discard {count} Card(s)',

  // Score
  'score.title': 'Time Bonus Score',
  'score.mins': 'mins',

  // Categories
  'category.radar': 'Radar',
  'category.thermometer': 'Thermometer',
  'category.photo': 'Photo',
  'category.location': 'Location Matching',
  'category.creative': 'Creative',

  // Types
  'type.curse': 'curse',
  'type.time_bonus': 'time bonus',
  'type.veto': 'veto',
  'type.randomize': 'randomize',

  // Timer labels
  'timerLabel.5 min': '5 min',
  'timerLabel.3 min': '3 min',
  'timerLabel.10 min': '10 min',
  'timerLabel.When location reached': 'When location reached',

  // Hint texts
  'hint.radar-5km': 'Radar 5km — is the hider inside a 5km zone from your current location?',
  'hint.radar-1500m': 'Radar 1500m — is the hider inside a 1500m zone from your current location?',
  'hint.radar-500m': 'Radar 500m — is the hider inside a 500m zone from your current location?',
  'hint.thermo-1km': 'Thermometer 1km — walk 1km to point B, is point B closer to the hider than point A?',
  'hint.thermo-300m': 'Thermometer 300m — walk 300m to point B, is point B closer to the hider than point A?',
  'hint.thermo-3min': 'Thermometer 3 min — walk for 3 minutes to point B, is point B closer to the hider than point A?',
  'hint.photo-highest-building': 'Send a photo of the highest building visible from your hiding location.',
  'hint.photo-selfie': 'Send a selfie with something in the background (not sky).',
  'hint.photo-red-white-shop': 'Send a photo of the closest "red and white" shop — door and entry must be visible.',
  'hint.loc-cinema-radar': 'Cinema radar — every cinema creates its own 800m radius radar. Is the hider inside any cinema radar?',
  'hint.loc-same-district': 'Is the hider in the same district as the seekers?',
  'hint.loc-electric-transport': "Your closest building's address street — does it have electric transport on it?",
  'hint.loc-lenta': 'Is your closest Lenta shop the same as mine?',
  'hint.loc-runway': 'Is your closest runway the same as mine?',
  'hint.loc-street-letter': 'Does your street name start with the same letter as mine?',
  'hint.creative-non-square': 'Draw the closest non-square building.',

  // Card texts — Curses
  'card.curse-move.name': 'Curse of the Move Card',
  'card.curse-move.castingCost': 'Discard 2 cards',
  'card.curse-move.effect': 'Gives the hider 45–60 minutes to pack up and completely change locations.',

  'card.curse-hide-seek-ception.name': 'Curse of the Hide-and-Seek-Ception',
  'card.curse-hide-seek-ception.castingCost': 'Seekers must be off-transit and at least 500 feet from a station',
  'card.curse-hide-seek-ception.effect': 'One seeker hides 500 feet away; the other seeker must find them before proceeding.',

  'card.curse-drained-brain.name': 'Curse of the Drained Brain',
  'card.curse-drained-brain.castingCost': 'Discard your entire hand',
  'card.curse-drained-brain.effect': 'Hider chooses 3 questions; seekers are banned from asking them for the rest of the run.',

  'card.curse-gilded-inquiry.name': 'Curse of the Gilded Inquiry',
  'card.curse-gilded-inquiry.castingCost': "The seekers' next question is free",
  'card.curse-gilded-inquiry.effect': "Hider secretly picks a question. If seekers ask it, it's auto-vetoed and hider draws 3 cards.",

  'card.curse-prosperous-home.name': 'Curse of the Prosperous Home',
  'card.curse-prosperous-home.castingCost': 'Discard 20+ minutes of time bonuses',
  'card.curse-prosperous-home.effect': "Permanently expands the hider's zone radius by 50%. (Removed in endgame).",

  'card.curse-gamblers-feet.name': "Curse of the Gambler's Feet",
  'card.curse-gamblers-feet.castingCost': 'Roll a die (even number = curse fails)',
  'card.curse-gamblers-feet.effect': 'For 1 hour, seekers must roll a die before taking steps, moving only that many paces.',

  'card.curse-bird-guide.name': 'Curse of the Bird Guide',
  'card.curse-bird-guide.castingCost': 'Film a bird',
  'card.curse-bird-guide.effect': 'Seekers must film a single wild bird for up to 15 minutes continuous uncut frame.',

  'card.curse-zoologist.name': 'Curse of the Zoologist',
  'card.curse-zoologist.castingCost': 'Take a photo of a wild animal',
  'card.curse-zoologist.effect': 'Seekers must find and photograph an animal in that same biological category.',

  'card.curse-frozen-dot.name': 'Curse of the Frozen Dot',
  'card.curse-frozen-dot.castingCost': 'Seekers must be at least 10 miles away',
  'card.curse-frozen-dot.effect': 'Drops a pin 1,000 feet from seekers. If they walk within 250 feet of it in 15 mins, they freeze for 30 mins.',

  'card.curse-hidden-hangman.name': 'Curse of the Hidden Hangman',
  'card.curse-hidden-hangman.castingCost': 'Discard 2 cards',
  'card.curse-hidden-hangman.effect': 'Seekers must beat the hider in a 5-letter game of Hangman before moving or asking questions.',

  'card.curse-overflowing-chalice.name': 'Curse of the Overflowing Chalice',
  'card.curse-overflowing-chalice.castingCost': 'Discard 1 card',
  'card.curse-overflowing-chalice.effect': 'For the next 3 questions, the hider draws an extra card from the deck.',

  'card.curse-impressionable-consumer.name': 'Curse of the Impressionable Consumer',
  'card.curse-impressionable-consumer.castingCost': "Seekers' next question is free",
  'card.curse-impressionable-consumer.effect': 'Seekers must physically buy a product or enter a location they spot on a real-world advertisement.',

  'card.curse-town-hall.name': 'Town Hall Census Curse',
  'card.curse-town-hall.castingCost': "Seekers' next question is free",
  'card.curse-town-hall.effect': "Seekers must go to a local town hall and guess its jurisdiction's population within 25%.",


  'card.curse-district-population.name': 'District Census Curse',
  'card.curse-district-population.castingCost': "Seekers' next question is free",
  'card.curse-district-population.effect': 'Seekers must guess current district jurisdiction\'s population within 25%. If they fail - 5 minutes freeze.',


  'card.curse-of-right-turn.name': 'Curse of right turn',
  'card.curse-of-right-turn.castingCost': "Discard 2 cards",
  'card.curse-of-right-turn.effect': 'Seekers must turn only right on each named cross next 20 minutes.',


  'card.curse-long-distance-die.name': 'Long-Distance Die Roll',
  'card.curse-long-distance-die.castingCost': 'None',
  'card.curse-long-distance-die.effect': 'Seekers must roll a physical die 100 feet away using only gravity/momentum to land a 5 or 6.',

  // Card texts — Time Bonuses
  'card.tb-5.name': '+5 Minutes',
  'card.tb-5.effect': 'Adds 5 minutes to your final score.',
  'card.tb-10.name': '+10 Minutes',
  'card.tb-10.effect': 'Adds 10 minutes to your final score.',
  'card.tb-15.name': '+15 Minutes',
  'card.tb-15.effect': 'Adds 15 minutes to your final score.',

  // Card texts — Veto & Randomize
  'card.veto.name': 'Veto Question',
  'card.veto.effect': 'Refuse to answer a question. You still receive card rewards.',

  'card.randomize.name': 'Randomize Question',
  'card.randomize.effect': 'Seekers must re-roll and pick a different hint.',
};

const ru: Record<string, string> = {
  // Gate
  'gate.title': 'хайднсик',
  'gate.subtitle': 'Приложение-компаньон для пряток. Выберите свою роль.',
  'gate.hider': 'Я прячусь',
  'gate.seeker': 'Я ищу',
  'gate.forceReset': 'Сбросить игру',
  'gate.confirmReset': 'Текущая игра будет завершена. Вы уверены?',
  'back': 'Назад',

  // Seeker
  'seeker.menu': 'Меню искателя',
  'seeker.hintActive': 'Подсказка активна. Завершите её, чтобы задать другую.',
  'seeker.askHint': 'Выбрать подсказку',
  'seeker.hintUsed': 'Использовано',
  'seeker.pickDraw': 'Взять {pick}, Оставить {draw}',
  'seeker.hintHistory': 'История подсказок ({count})',

  // Timer
  'timer.hintActive': 'Подсказка активна',
  'timer.locationReached': 'Точка достигнута',
  'timer.dismiss': 'Закрыть',
  'timer.answerReceived': 'Ответ получен',
  'timer.timesUp': 'Время вышло! Спросите ответ у прячущегося.',

  // Hider
  'hider.deck': 'Колода прячущегося',
  'hider.drawPile': 'Колода',
  'hider.left': 'осталось {count}',
  'hider.discardPile': 'Сброс',
  'hider.cards': '{count} карт',
  'hider.activeHand': 'Рука ({count})',
  'hider.emptyHand': 'Нет проклятий или бонусов. Начните драфт, чтобы получить карты.',

  // Draft
  'draft.title': 'Начать драфт',
  'draft.description': 'Когда искатели задают подсказку, начните драфт с соответствующим уровнем награды.',
  'draft.pick3draw2': 'Взять 3, Оставить 2',
  'draft.pick2draw1': 'Взять 2, Оставить 1',
  'draft.noCards': 'Нет доступных карт для драфта.',
  'draft.phase': 'Фаза драфта',
  'draft.selectCards': 'Выберите {count} карту',
  'draft.selectCardsPlural': 'Выберите {count} карты',
  'draft.instructions': 'Бонусы времени идут в счёт. Проклятия и усиления идут в руку. Невыбранные карты возвращаются в колоду.',
  'draft.confirm': 'Подтвердить выбор ({current}/{total})',

  // Card actions
  'card.play': 'Играть',
  'card.discard': 'Сбросить',
  'card.cost': 'Цена: {cost}',
  'card.confirmPlay': 'Активировать "{name}"?\n\n{effect}',
  'card.confirmDiscard': 'Сбросить "{name}" без активации?',

  // Showcase
  'showcase.close': 'Готово',

  // Discard overlay
  'discard.phase': 'Фаза сброса',
  'discard.selectCards': 'Выберите {count} карт(ы) для сброса',
  'discard.allCards': 'Все карты будут сброшены',
  'discard.selectTimeBonuses': 'Выберите бонусы времени на минимум {min} минут',
  'discard.confirmDiscard': 'Сбросить {count} карт(ы)',
  'discard.confirmTimeBonuses': 'Сбросить {mins} минут',
  'discard.cancel': 'Отмена',
  'discard.noCards': 'Нет карт для сброса.',

  // Hand overflow
  'overflow.phase': 'Превышен лимит руки',
  'overflow.subtitle': 'Слишком много карт. Сбросьте {count}, чтобы вернуться к {max}.',
  'overflow.confirm': 'Сбросить {count} карт(ы)',

  // Score
  'score.title': 'Бонус времени',
  'score.mins': 'мин',

  // Categories
  'category.radar': 'Радар',
  'category.thermometer': 'Термометр',
  'category.photo': 'Фото',
  'category.location': 'Совпадение локации',
  'category.creative': 'Творческое',

  // Types
  'type.curse': 'проклятие',
  'type.time_bonus': 'бонус времени',
  'type.veto': 'вето',
  'type.randomize': 'рандом',

  // Timer labels
  'timerLabel.5 min': '5 мин',
  'timerLabel.3 min': '3 мин',
  'timerLabel.10 min': '10 мин',
  'timerLabel.When location reached': 'При достижении точки',

  // Hint texts
  'hint.radar-5km': 'Радар 5 км — прячущийся находится в зоне 5 км от вашего текущего местоположения?',
  'hint.radar-1500m': 'Радар 1500 м — прячущийся находится в зоне 1500 м от вашего текущего местоположения?',
  'hint.radar-500m': 'Радар 500 м — прячущийся находится в зоне 500 м от вашего текущего местоположения?',
  'hint.thermo-1km': 'Термометр 1 км — пройдите 1 км до точки Б, точка Б ближе к прячущемуся, чем точка А?',
  'hint.thermo-300m': 'Термометр 300 м — пройдите 300 м до точки Б, точка Б ближе к прячущемуся, чем точка А?',
  'hint.thermo-3min': 'Термометр 3 мин — идите 3 минуты до точки Б, точка Б ближе к прячущемуся, чем точка А?',
  'hint.photo-highest-building': 'Отправьте фото самого высокого здания, видимого с вашего укрытия.',
  'hint.photo-selfie': 'Отправьте селфи с чем-то на заднем плане (не небо).',
  'hint.photo-red-white-shop': 'Отправьте фото ближайшего магазина «Красное и Белое» — дверь и вход должны быть видны.',
  'hint.loc-cinema-radar': 'Радар кинотеатров — каждый кинотеатр создаёт свой радар радиусом 800 м. Прячущийся в зоне какого-нибудь кинотеатра?',
  'hint.loc-underground-passage-radar': 'Радар подземных переходов — каждый подземный переход создаёт свой радар радиусом 800 м. Прячущийся в зоне какого-нибудь подземного перехода?',
  'hint.loc-same-district': 'Прячущийся в том же районе, что и искатели?',
  'hint.loc-electric-transport': 'Улица ближайшего к вам здания — есть ли на ней электротранспорт?',
  'hint.loc-lenta': 'Ваша ближайшая «Лента» — та же, что и моя?',
  'hint.loc-runway': 'Ваша ближайшая взлётная полоса — та же, что и моя?',
  'hint.loc-street-letter': 'Название вашей улицы начинается на ту же букву, что и моей?',
  'hint.creative-non-square': 'Нарисуйте ближайшее не квадратное здание.',

  // Card texts — Curses
  'card.curse-move.name': 'Проклятие переезда',
  'card.curse-move.castingCost': 'Сбросьте 2 карты',
  'card.curse-move.effect': 'Даёт прячущемуся 45–60 минут, чтобы собраться и сменить локацию.',

  'card.curse-hide-seek-ception.name': 'Проклятие прятки-в-прятках',
  'card.curse-hide-seek-ception.castingCost': 'Искатели должны быть вне транспорта и минимум в 150 м от остановки',
  'card.curse-hide-seek-ception.effect': 'Один искатель прячется в 150 м; другой должен найти его, прежде чем продолжить.',

  'card.curse-drained-brain.name': 'Проклятие опустошённого разума',
  'card.curse-drained-brain.castingCost': 'Сбросьте всю руку',
  'card.curse-drained-brain.effect': 'Прячущийся выбирает 3 вопроса; искателям запрещено задавать их до конца игры.',

  'card.curse-gilded-inquiry.name': 'Проклятие золотого вопроса',
  'card.curse-gilded-inquiry.castingCost': 'Следующий вопрос искателей бесплатен',
  'card.curse-gilded-inquiry.effect': 'Прячущийся тайно выбирает вопрос. Если искатели его зададут — автоматическое вето и прячущийся тянет 3 карты.',

  'card.curse-prosperous-home.name': 'Проклятие процветающего дома',
  'card.curse-prosperous-home.castingCost': 'Сбросьте 20+ минут бонусов времени',
  'card.curse-prosperous-home.effect': 'Навсегда увеличивает радиус зоны прячущегося на 50%. (Снимается в эндгейме).',

  'card.curse-gamblers-feet.name': 'Проклятие ног игрока',
  'card.curse-gamblers-feet.castingCost': 'Бросьте кубик (чётное = проклятие не срабатывает)',
  'card.curse-gamblers-feet.effect': 'В течение 1 часа искатели должны бросать кубик перед каждым шагом, двигаясь только на выпавшее число шагов.',

  'card.curse-bird-guide.name': 'Проклятие орнитолога',
  'card.curse-bird-guide.castingCost': 'Снимите птицу',
  'card.curse-bird-guide.effect': 'Искатели должны снять одну дикую птицу на видео до 15 минут непрерывной съёмки.',

  'card.curse-zoologist.name': 'Проклятие зоолога',
  'card.curse-zoologist.castingCost': 'Сфотографируйте дикое животное',
  'card.curse-zoologist.effect': 'Искатели должны найти и сфотографировать животное той же биологической категории.',

  'card.curse-frozen-dot.name': 'Проклятие замороженной точки',
  'card.curse-frozen-dot.castingCost': 'Искатели должны быть минимум в 16 км',
  'card.curse-frozen-dot.effect': 'Ставит метку в 300 м от искателей. Если они подойдут к ней на 75 м за 15 минут — заморозка на 30 минут.',

  'card.curse-hidden-hangman.name': 'Проклятие виселицы',
  'card.curse-hidden-hangman.castingCost': 'Сбросьте 2 карты',
  'card.curse-hidden-hangman.effect': 'Искатели должны обыграть прячущегося в «Виселицу» (5 букв), прежде чем двигаться или задавать вопросы.',

  'card.curse-overflowing-chalice.name': 'Проклятие переполненной чаши',
  'card.curse-overflowing-chalice.castingCost': 'Сбросьте 1 карту',
  'card.curse-overflowing-chalice.effect': 'На следующие 3 вопроса прячущийся тянет дополнительную карту из колоды.',

  'card.curse-impressionable-consumer.name': 'Проклятие впечатлительного покупателя',
  'card.curse-impressionable-consumer.castingCost': 'Следующий вопрос искателей бесплатен',
  'card.curse-impressionable-consumer.effect': 'Искатели должны купить товар или зайти в место, которое они видят на реальной рекламе.',

  'card.curse-town-hall.name': 'Проклятие городской переписи',
  'card.curse-town-hall.castingCost': 'Следующий вопрос искателей бесплатен',
  'card.curse-town-hall.effect': 'Искатели должны пойти в местную администрацию и угадать население района с точностью 25%.',

  'card.curse-district-population.name': 'Проклятие районной переписи переписи',
  'card.curse-district-population.castingCost': 'Следующий вопрос искателей бесплатен',
  'card.curse-district-population.effect': 'Искатели должны угадать население района в котором находятся с точностью 25%. Если искатели проваливают испытание - 5 минутный фриз.',

  'card.curse-long-distance-die.name': 'Дальний бросок кубика',
  'card.curse-long-distance-die.castingCost': 'Нет',
  'card.curse-long-distance-die.effect': 'Искатели должны бросить кубик на расстоянии 30 м, используя только гравитацию, чтобы выпало 5 или 6.',


  'card.curse-of-right-turn.name': 'Проклятье правкого поворота',
  'card.curse-of-right-turn.castingCost': 'Сбросьте 2 карты',
  'card.curse-of-right-turn.effect': 'Искатели должны поворачивать только направо на всех перекрестках именованных улиц следующие 20 минутю',


  // Card texts — Time Bonuses
  'card.tb-5.name': '+5 минут',
  'card.tb-5.effect': 'Добавляет 5 минут к вашему итоговому счёту.',
  'card.tb-10.name': '+10 минут',
  'card.tb-10.effect': 'Добавляет 10 минут к вашему итоговому счёту.',
  'card.tb-15.name': '+15 минут',
  'card.tb-15.effect': 'Добавляет 15 минут к вашему итоговому счёту.',

  // Card texts — Veto & Randomize
  'card.veto.name': 'Вето на вопрос',
  'card.veto.effect': 'Откажитесь отвечать на вопрос. Вы всё равно получаете награду картами.',

  'card.randomize.name': 'Рандомный вопрос',
  'card.randomize.effect': 'Искатели должны перебросить и выбрать другую подсказку.',
};

export const translations: Record<string, Record<string, string>> = { en, ru };
