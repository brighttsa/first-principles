// Optional World 1 capstone: Scripture-focused activities that connect birth, eternal life, and salvation.
// KJV phrase pieces below were checked against Bible.com KJV references on 2026-11-10; readers display the full passage.
export const CHAPTER_CHALLENGE_COMPLETE_KEY = 'w1.chapterChallenge.complete';
export const chapterChallengeDoneKey = (id) => `w1.chapterChallenge.${id}`;

export const world1ChapterChallenge = [
  {
    id: 'cc-new-creature', type: 'wordgarden', levelNumber: 1, levelLabel: 'Word Garden · Chapter Challenge', title: 'Find the new life',
    learningObjective: 'Connect the words in 2 Corinthians 5:17 with its teaching.',
    clue: 'Find two words that describe what happens in Christ.', letters: 'NEWCREATURE',
    targetWords: ['NEW', 'CREATURE'], validWords: ['NEW', 'CREATURE', 'CREATE', 'TREE', 'TRUE', 'CURE', 'EAT', 'TEAR', 'NEAR'],
    bonusWords: ['CREATE', 'TREE', 'TRUE', 'CURE', 'EAT', 'TEAR', 'NEAR'], keyWord: 'CREATURE',
    keyDiscovery: 'Read how 2 Corinthians 5:17 describes the new creature in Christ.', ref: '2 Cor 5:17',
    question: 'What does this verse describe for someone in Christ?',
    choices: [
      { text: 'A new creature; old things pass away and all things become new.', correct: true, feedback: 'Yes. The verse describes a new creature in Christ.' },
      { text: 'A person must learn every rule before becoming new.', feedback: 'Look again at what the verse says happens in Christ.' },
      { text: 'Only outward actions change; the old life stays the same.', feedback: 'The verse says old things pass away and all things become new.' },
    ],
    learn: '2 Corinthians 5:17 describes a new creature in Christ and a new beginning.',
    afterLearn: 'In Christ, this passage describes a new creature and a new beginning (2 Cor 5:17).',
    misconception: 'The verse points to what is new in Christ.',
    hint: 'Start with the shorter word, then find the eight-letter word.',
  },
  {
    id: 'cc-eternal-life', type: 'scripturetrail', trailTitle: 'Restore the promise', ref: '1 Jn 5:11',
    words: ['God', 'hath', 'given', 'to', 'us', 'eternal', 'life'],
    clue: 'Restore the phrase that tells what God has given.',
    question: 'According to this verse, where is this life?',
    choices: [
      { text: 'In his Son.', correct: true, feedback: 'Right. The verse says this life is in his Son.' },
      { text: 'In earning enough good deeds.', feedback: 'Read the verse again. It tells what God has given and where this life is.' },
      { text: 'In being born into a particular family.', feedback: 'Look at the last words of the verse for where this life is.' },
    ],
    learn: 'First John 5:11 says God has given eternal life, and this life is in his Son.',
    afterLearn: 'The verse connects the gift of eternal life with the Son (1 Jn 5:11).',
    hint: 'The phrase begins with God and ends with life.',
  },
  {
    id: 'cc-salvation-in-practice', type: 'detective', ref: 'Rom 10:9',
    scenario: 'A friend asks what Romans 10:9 says about being saved.',
    question: 'Which two parts of the verse answer your friend?',
    hint: 'Look for what is done with the mouth and what is believed in the heart.',
    segments: [
      { t: 'that if thou shalt confess with thy mouth the Lord Jesus,', ev: true },
      { t: 'and shalt believe in thine heart that God hath raised him from the dead,', ev: true },
      { t: 'thou shalt be saved.' },
    ],
    reply: {
      question: 'Which reply uses both parts of the verse?',
      hint: 'Choose the answer that includes both confessing and believing.',
      options: [
        { t: 'Confess Jesus as Lord and believe that God raised him from the dead.', ok: true },
        { t: 'Only say the words, without believing in your heart.', why: 'The verse also says to believe in your heart that God raised him from the dead.' },
        { t: 'Earn salvation by doing enough good deeds.', why: 'Read the two phrases you found. They describe confessing Jesus and believing in his resurrection.' },
      ],
    },
    learn: 'Romans 10:9 connects confessing the Lord Jesus and believing God raised him from the dead with salvation.',
    afterLearn: 'You used both parts of Romans 10:9 to explain the passage to your friend.',
  },
];

export function attachWorld1ChapterChallenge(world) { world.chapterChallenge = world1ChapterChallenge; }
