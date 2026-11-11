// World 2 content: Scripture-first lessons on the Holy Spirit. Verse text is KJV, copied unchanged from a public-domain KJV source.
// `teaching` fields follow the private teaching manual's wording as written. DRAFT: pastoral review is required before publishing.
// Tongues lesson: it teaches only what the cited verses say. Puzzle ids continue World 1's p-numbering so the puzzle count stays accurate.
export const world2 = {
  id: 2, name: 'The Holy Spirit', color: 'lagoon', medal: 'world2',
  tagline: 'Fellowship with the Spirit',
  welcome: { child: 'The Holy Spirit is with us always!', teen: 'Welcome to the second world. We will learn who the Holy Spirit is and how to walk in fellowship with Him, step by step.' },
  objectives: ['Understand that the Holy Spirit is Jesus in us', 'Grow in fellowship with the Holy Spirit', 'Learn the seven-fold Spirit named in Isaiah 11:2', 'See what Scripture says about speaking in tongues'],
  lessons: [
    {
      id: 'l5', title: 'Jesus in us', ref: 'Jn 14:16-18',
      verse: 'And I will pray the Father, and he shall give you another Comforter, that he may abide with you for ever; Even the Spirit of truth; whom the world cannot receive, because it seeth him not, neither knoweth him: but ye know him; for he dwelleth with you, and shall be in you. I will not leave you comfortless: I will come to you.',
      intro: 'The Holy Spirit is Jesus in us. Jesus promised "another Comforter" (Greek: allos parakletos). Allos means one of the same kind; heteros means another which is different. So the Holy Ghost is exactly like Jesus in every way.',
      introKid: 'The Holy Spirit is Jesus with us! He never leaves us.',
      support: [
        { ref: 'Jn 16:13', text: 'Howbeit when he, the Spirit of truth, is come, he will guide you into all truth: for he shall not speak of himself; but whatsoever he shall hear, that shall he speak: and he will shew you things to come.' },
      ],
      puzzles: [
        { id: 'p23', learn: 'Allos means "another of the same kind". Jesus promised another Comforter exactly like Himself (Jn 14:16).', type: 'wordbuild', answer: 'ALLOS', clue: 'The Greek word for "another of the same kind" (Jn 14:16)' },
        { id: 'p24', learn: 'Allos is one of the same kind and heteros is another which is different. The Holy Ghost is exactly like Jesus in every way, and He is the Spirit of truth (Jn 16:13).', type: 'match', pairs: [['Allos', 'One of the same kind'], ['Heteros', 'Another which is different'], ['The Holy Ghost is', 'Exactly like Jesus in every way'], ['The Spirit of truth', 'Guides us into all truth (Jn 16:13)']] },
        { id: 'p25', learn: 'Jesus said the Father would give another Comforter, who would abide with us for ever (Jn 14:16).', lead: 'Jesus promised that the Father would give His followers someone to stay with them. Find the verse that says it.', afterLearn: 'You found it: another Comforter, that he may abide with you for ever (Jn 14:16).', type: 'complete', ref: 'Jn 14:16', extra: ['leave', 'soon'],
          text: 'And I will pray the Father, and he shall give you another [[Comforter]], that he may [[abide]] with you for [[ever]];' },
        { id: 'p26', learn: 'The Holy Spirit never leaves us. Jesus said, "I will not leave you comfortless" (Jn 14:18).', type: 'reorder', ref: 'Jn 14:18', words: ['I', 'will', 'not', 'leave', 'you', 'comfortless'] },
      ],
      truth: {
        teaching: 'The Holy Spirit is Jesus in us (Jn 14:16-18). "Another Comforter" is Greek allos parakletos: allos means one of the same kind, and heteros means another which is different. The Holy Ghost is exactly like Jesus in every way. 1. He never leaves us. 2. He is the Spirit of truth (reality). He guides us into all the spiritual realities Jesus obtained for us (Jn 16:13).',
        kid: 'The Holy Spirit is Jesus with us, and He never leaves us!',
        deeper: ['Jn 14:16-18', 'Jn 16:13'], key: 'Comforter',
        reflection: 'What does it mean to you that the Holy Spirit never leaves you?',
      },
    },
    {
      id: 'l6', title: 'Fellowship with the Spirit', ref: '2 Cor 13:14',
      verse: 'The grace of the Lord Jesus Christ, and the love of God, and the communion of the Holy Ghost, be with you all. Amen.',
      intro: 'Communion (Greek: koinonia) means fellowship, association, community, joint participation and intimacy. Our fellowship with the Holy Spirit brings us into the experience of His ministry in our lives.',
      introKid: 'We can be close friends with the Holy Spirit!',
      support: [
        { ref: 'Jn 14:16', text: 'And I will pray the Father, and he shall give you another Comforter, that he may abide with you for ever;' },
      ],
      puzzles: [
        { id: 'p27', learn: 'Koinonia means fellowship and joint participation. It is the word translated "communion" in 2 Cor 13:14.', type: 'wordbuild', answer: 'KOINONIA', clue: 'The Greek word for communion and fellowship (2 Cor 13:14)' },
        { id: 'p28', learn: 'In fellowship we discover the Holy Spirit as our Comforter, Counselor, Helper, Intercessor, Advocate, Strengthener and Standby.', type: 'wordsearch', words: ['SPIRIT', 'HELPER', 'ADVOCATE', 'STANDBY', 'TRUTH'], seed: 23 },
        { id: 'p29', learn: 'The grace of the Lord Jesus Christ, the love of God, and the communion of the Holy Ghost be with us (2 Cor 13:14).', lead: 'Paul ends a letter by asking for three things to be with the believers. Find where he says it.', afterLearn: 'You found it: the grace, the love, and the communion of the Holy Ghost (2 Cor 13:14).', type: 'complete', ref: '2 Cor 13:14', extra: ['power', 'peace'],
          text: 'The [[grace]] of the Lord Jesus Christ, and the [[love]] of God, and the [[communion]] of the Holy Ghost, be with you all. Amen.' },
        { id: 'p30', learn: 'Communion belongs to the Holy Ghost: fellowship with Him is part of what Paul asks for (2 Cor 13:14).', type: 'detective', ref: '2 Cor 13:14', question: 'Whose communion does this verse name?', segments: [{ t: 'The grace of the Lord Jesus Christ,' }, { t: 'and the love of God,' }, { t: 'and the communion of the Holy Ghost,', ev: true }, { t: 'be with you all. Amen.' }] },
      ],
      truth: {
        teaching: 'Communion (Greek: koinonia) means fellowship, association, community, joint participation, intercourse and intimacy (2 Cor 13:14, Jn 14:16). Our fellowship with the Holy Spirit brings us into the experience of His ministry in our lives, and we discover Him as our: 1. Comforter 2. Counselor 3. Helper 4. Intercessor 5. Advocate 6. Strengthener 7. Standby.',
        kid: 'We can be close friends with the Holy Spirit. He is our Comforter, Helper, and Strengthener!',
        deeper: ['2 Cor 13:14', 'Jn 14:16'], key: 'communion',
        reflection: 'Which of these names of the Holy Spirit means the most to you right now?',
      },
    },
    {
      id: 'l7', title: 'The seven Spirits of God', ref: 'Isa 11:2',
      verse: 'And the spirit of the LORD shall rest upon him, the spirit of wisdom and understanding, the spirit of counsel and might, the spirit of knowledge and of the fear of the LORD;',
      intro: 'There is a seven-fold manifestation of the Holy Spirit in a believer\'s life, to help the believer take charge of his life and environment and also to facilitate the work of the ministry.',
      introKid: 'The Holy Spirit helps us in seven wonderful ways.',
      support: [],
      puzzles: [
        { id: 'p31', learn: 'The Spirit of the Lord is the Spirit of dominion. The Spirit of Wisdom gives counsel from the mind of God. The Spirit of Understanding helps us understand our hope and inheritance. The Spirit of Counsel gives direction in life.', type: 'match', pairs: [['The Spirit of the Lord', 'The Spirit of dominion'], ['The Spirit of Wisdom', 'Counsel from the mind of God to overcome specific obstacles'], ['The Spirit of Understanding', 'Understanding the hope you are called to and your inheritance'], ['The Spirit of Counsel', 'Direction in life to make the right decisions']] },
        { id: 'p32', learn: 'The Spirit of Might is extraordinary strength to do the things of God. The Spirit of Knowledge is revelation concerning an issue. The Spirit of the Fear of the Lord is order, discipline and reverence.', type: 'match', pairs: [['The Spirit of Might', 'Extraordinary strength to do the things of God'], ['The Spirit of Knowledge', 'Revelation concerning an issue, past, present or future'], ['The Spirit of the Fear of the Lord', 'Order, discipline and reverence']] },
        { id: 'p33', learn: 'Isaiah 11:2 names the spirit of the LORD, wisdom, understanding, counsel, might, knowledge, and the fear of the LORD.', lead: 'The prophet Isaiah describes how the Spirit of the LORD would rest on the promised King. Find where he lists the seven.', afterLearn: 'You found it: wisdom and understanding, counsel and might, knowledge and the fear of the LORD (Isa 11:2).', type: 'complete', ref: 'Isa 11:2', extra: ['courage', 'patience'],
          text: 'And the spirit of the LORD shall rest upon him, the spirit of [[wisdom]] and [[understanding]], the spirit of [[counsel]] and [[might]], the spirit of [[knowledge]] and of the fear of the LORD;' },
      ],
      truth: {
        teaching: 'The Seven Spirits of God (Isa 11:2): there is a seven-fold manifestation of the Holy Spirit in a believer\'s life to help the believer take charge of his life, environment, and also to facilitate the work of the ministry. 1. The Spirit of the Lord: the Spirit of dominion. 2. The Spirit of Wisdom: counsel from the mind of God to overcome specific obstacles. 3. The Spirit of Understanding: you are able to understand the hope you have been called to, your inheritance and the power at work in you. 4. The Spirit of Counsel: direction in life to make the right decisions and choices every time. 5. The Spirit of Might: extraordinary strength to do the things of God. 6. The Spirit of Knowledge: revelation concerning an issue, the past, present or future. 7. The Spirit of the Fear of the Lord: order, discipline and reverence.',
        kid: 'The Holy Spirit gives us wisdom, understanding, counsel, might, knowledge, and reverence for the Lord.',
        deeper: ['Isa 11:2'], key: 'wisdom',
        reflection: 'Which of the seven would you most like to grow in, and why?',
      },
    },
    {
      id: 'l8', title: 'Speaking in tongues', ref: 'Acts 2:4',
      verse: 'And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.',
      intro: 'The Bible shows believers who were filled with the Holy Ghost speaking with other tongues, as the Spirit gave them utterance. Let us look at what each verse says.',
      introKid: 'The Bible tells us about people who spoke with other tongues when the Holy Spirit filled them.',
      support: [
        { ref: '1 Cor 14:2', text: 'For he that speaketh in an unknown tongue speaketh not unto men, but unto God: for no man understandeth him; howbeit in the spirit he speaketh mysteries.' },
        { ref: '1 Cor 14:14', text: 'For if I pray in an unknown tongue, my spirit prayeth, but my understanding is unfruitful.' },
        { ref: 'Acts 8:17', text: 'Then laid they their hands on them, and they received the Holy Ghost.' },
        { ref: 'Acts 19:6', text: 'And when Paul had laid his hands upon them, the Holy Ghost came on them; and they spake with tongues, and prophesied.' },
      ],
      puzzles: [
        { id: 'p34', learn: 'The Holy Ghost filled them, and they began to speak with other tongues as the Spirit gave them utterance (Acts 2:4).', lead: 'On the day this verse describes, believers were filled and began to speak. Find the verse that tells what happened.', afterLearn: 'You found it: filled with the Holy Ghost, they began to speak with other tongues as the Spirit gave them utterance (Acts 2:4).', type: 'complete', ref: 'Acts 2:4', extra: ['silent', 'fearful'],
          text: 'And they were all [[filled]] with the Holy Ghost, and began to speak with other [[tongues]], as the Spirit gave them [[utterance]].' },
        { id: 'p35', learn: 'A person who speaks in an unknown tongue speaks not unto men, but unto God (1 Cor 14:2).', type: 'detective', ref: '1 Cor 14:2', question: 'According to this verse, who does a person speak to when speaking in an unknown tongue?', segments: [{ t: 'For he that speaketh in an unknown tongue' }, { t: 'speaketh not unto men, but unto God:', ev: true }, { t: 'for no man understandeth him;' }, { t: 'howbeit in the spirit he speaketh mysteries.' }] },
        { id: 'p36', learn: 'These verses describe speaking in tongues: they began to speak (Acts 2:4), unto God (1 Cor 14:2), my spirit prayeth (1 Cor 14:14), and they spake with tongues (Acts 19:6).', type: 'match', pairs: [['Acts 2:4', 'They began to speak with other tongues'], ['1 Cor 14:2', 'He speaketh not unto men, but unto God'], ['1 Cor 14:14', 'My spirit prayeth'], ['Acts 19:6', 'They spake with tongues, and prophesied']] },
      ],
      truth: {
        teaching: 'Speaking in tongues: 1. To speak in tongues is to have your spirit pray by the inspiration of the Holy Spirit (1 Cor 14:14). 2. When you speak in tongues, you speak directly and privately to God (1 Cor 14:2). 3. The Holy Spirit fills you and gives you utterance, but you must speak yourself (Acts 2:4). Read also Acts 8:17 and Acts 19:6.',
        kid: 'When the Holy Spirit filled believers, they spoke with other tongues, and they spoke to God.',
        deeper: ['Acts 2:4', '1 Cor 14:2', '1 Cor 14:14', 'Acts 8:17', 'Acts 19:6'], key: 'tongues',
        reflection: 'What stands out to you in what these verses say about speaking in tongues?',
      },
    },
  ],
  quiz: [
    { id: 'q9', q: 'In John 14:16, Jesus promises "another Comforter". What does the Greek word allos mean?', options: [
      { t: 'One of the same kind', ok: true, why: 'Yes. Allos means one of the same kind, so the Holy Ghost is exactly like Jesus in every way (Jn 14:16-18).' },
      { t: 'Another which is different', why: 'Not quite. That is heteros. Allos means one of the same kind.' },
      { t: 'A lesser helper', why: 'Not quite. Allos means one of the same kind as Jesus.' }] },
    { id: 'q10', q: 'According to John 14:16, how long will the Comforter abide with you?', options: [
      { t: 'For ever', ok: true, why: 'Yes. He may abide with you for ever (Jn 14:16).' },
      { t: 'Only while you pray', why: 'Not quite. Jesus said He will abide with you for ever.' },
      { t: 'Until you are grown', why: 'Not quite. Jesus said He will abide with you for ever.' }] },
    { id: 'q11', q: 'What does John 16:13 call the Holy Spirit?', options: [
      { t: 'The Spirit of truth', ok: true, why: 'Yes. When the Spirit of truth is come, he will guide you into all truth (Jn 16:13).' },
      { t: 'The Spirit of the world', why: 'Not quite. John 16:13 calls Him the Spirit of truth.' },
      { t: 'The Spirit of the law', why: 'Not quite. John 16:13 calls Him the Spirit of truth.' }] },
    { id: 'q12', q: 'The Greek word koinonia is translated "communion" in 2 Corinthians 13:14. What does it mean?', options: [
      { t: 'Fellowship and joint participation', ok: true, why: 'Yes. Koinonia means fellowship, association, community, joint participation and intimacy.' },
      { t: 'A church building', why: 'Not quite. Koinonia means fellowship and joint participation.' },
      { t: 'A secret meeting', why: 'Not quite. Koinonia means fellowship and joint participation.' }] },
    { id: 'q13', q: 'Which of these is named in Isaiah 11:2?', options: [
      { t: 'The spirit of wisdom and understanding', ok: true, why: 'Yes. The spirit of wisdom and understanding, counsel and might, knowledge and the fear of the LORD (Isa 11:2).' },
      { t: 'The spirit of fear and doubt', why: 'Not quite. Isaiah 11:2 names the fear of the LORD, not fear and doubt.' },
      { t: 'The spirit of pride and power', why: 'Not quite. Isaiah 11:2 does not name pride.' }] },
    { id: 'q14', q: 'The teaching says one of the seven Spirits is "extraordinary strength to do the things of God". Which is it?', options: [
      { t: 'The Spirit of Might', ok: true, why: 'Yes. The Spirit of Might is extraordinary strength to do the things of God.' },
      { t: 'The Spirit of Knowledge', why: 'Not quite. The Spirit of Knowledge is revelation concerning an issue.' },
      { t: 'The Spirit of Counsel', why: 'Not quite. The Spirit of Counsel is direction in life to make the right decisions.' }] },
    { id: 'q15', q: 'In Acts 2:4, what did the Spirit give them?', options: [
      { t: 'Utterance', ok: true, why: 'Yes. They began to speak with other tongues, as the Spirit gave them utterance (Acts 2:4).' },
      { t: 'A written letter', why: 'Not quite. Acts 2:4 says the Spirit gave them utterance.' },
      { t: 'A new name', why: 'Not quite. Acts 2:4 says the Spirit gave them utterance.' }] },
    { id: 'q16', q: 'According to 1 Corinthians 14:2, who does a person speak to when speaking in an unknown tongue?', options: [
      { t: 'God', ok: true, why: 'Yes. He speaketh not unto men, but unto God (1 Cor 14:2).' },
      { t: 'Men', why: 'Not quite. The verse says not unto men, but unto God.' },
      { t: 'No one', why: 'Not quite. The verse says he speaketh unto God.' }] },
  ],
  bookplate: { title: 'The Holy Spirit', caption: 'World 2 bookplate', image: 'world-2-bookplate/bookplate' },
};
