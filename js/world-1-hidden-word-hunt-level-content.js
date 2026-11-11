// Hunt clues use only objects clearly painted in the approved World 1 scene.
const hunt = {
  id: 'wh01', type: 'wordhunt', lessonId: 'l3', insertAfter: 'st03', title: 'A garden of new life', ref: '1 Pet 2:2',
  learn: 'First Peter 2:2 compares believers to newborn babes who desire the Word and grow.',
  afterLearn: 'You explored the garden, then connected its clues with 1 Peter 2:2: the Word helps believers grow.',
  targets: [
    { id: 'doorway', label: 'Sunlit doorway', word: 'BORN', clue: 'Find the sunlit doorway at the end of the garden path.', hint: 'Look near the bright stone entrance.', learning: 'Jesus teaches about the new birth in John 3.', portrait: { x: 77, y: 19, width: 22, height: 15 }, landscape: { x: 11, y: 34, width: 15, height: 25 } },
    { id: 'seedling', label: 'Seedling in the garden bed', word: 'GROW', clue: 'Now find the young plant growing in its stone garden bed.', hint: 'Look for the small green sprout among the paths.', learning: 'First Peter 2:2 connects the Word with growth.', portrait: { x: 28, y: 65, width: 24, height: 17 }, landscape: { x: 49, y: 60, width: 17, height: 21 } },
    { id: 'bible', label: 'Bible on the stone stand', word: 'WORD', clue: 'Find the Bible resting on its stone stand.', hint: 'Look near the lower path for the blue book.', learning: 'The passage connects new life and growth with the Word.', portrait: { x: 34, y: 90, width: 26, height: 15 }, landscape: { x: 92, y: 44, width: 15, height: 22 } },
  ],
  question: 'According to the lesson, what helps believers grow?',
  choices: [
    { text: 'The Word of God.', correct: true, feedback: 'First Peter 2:2 connects desire for the Word with growth.' },
    { text: 'Waiting until a person is older.', feedback: 'The passage compares believers to newborn babes who need nourishment.' },
    { text: 'Earning the new birth through perfect behavior.', feedback: 'The lesson teaches that growth follows the new birth; it does not earn it.' },
  ],
};

export function attachWorld1HiddenWordHunt(world) {
  const lesson = world.lessons.find(item => item.id === hunt.lessonId);
  const index = lesson?.puzzles.findIndex(item => item.id === hunt.insertAfter) ?? -1;
  if (lesson && index >= 0 && !lesson.puzzles.some(item => item.id === hunt.id)) lesson.puzzles.splice(index + 1, 0, hunt);
}

export { hunt as world1HiddenWordHunt };
