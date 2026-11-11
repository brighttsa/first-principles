// World 1 content: Scripture-first lessons on the new birth. Every teaching points to the cited Bible verses.
// `teaching` fields are the lesson summaries, written to point the learner to the cited Scripture.
// `verse` fields are KJV (public domain). DRAFT: verify wording and get pastoral review before publishing.
import { attachWorld1GameplayExtensions } from './world-1-gameplay-extensions.js';
export const world1 = {
  id: 1, name: 'Born Again', color: 'sun',
  tagline: 'Born from above',
  welcome: { child: 'A new life begins when we are born from above!', teen: 'Welcome to the first world. We will open the Bible and learn what it means to be born again, step by step.' },
  objectives: ['Understand what "born again" means', 'See how water and the Spirit bring new birth', 'Discover your new life in Christ', 'Tell what the new birth is, and what it is not'],
  lessons: [
    {
      id: 'l1', title: 'Born from above', ref: 'Jn 3:3',
      verse: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.',
      intro: 'Jesus told Nicodemus something wonderful: a person must be born again. The Greek words are gennao anothen, and they mean to be born from above, from heaven.',
      introKid: 'Jesus said we can be born again. It means a new life that comes from heaven!',
      support: [
        { ref: 'Jn 3:6', text: 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.' },
        { ref: 'Jn 3:7', text: 'Marvel not that I said unto thee, Ye must be born again.' },
      ],
      puzzles: [
        { id: 'p1', learn: 'Anothen means "from above". Jesus says the new birth comes from heaven, from God (Jn 3:3).', type: 'wordbuild', answer: 'ANOTHEN', clue: 'The Greek word for "from above" in John 3:3' },
        { id: 'p2', learn: 'No one can see the kingdom of God without being born again (Jn 3:3).', lead: 'Jesus told a man named Nicodemus that without a new birth, no one can see the kingdom of God. Find where He says it.', afterLearn: 'You found it in Jesus\' words to Nicodemus: Except a man be born again, he cannot see the kingdom of God (Jn 3:3).', type: 'complete', ref: 'Jn 3:3', extra: ['enter', 'saved'],
          text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be [[born]] [[again]], he cannot [[see]] the kingdom of God.' },
        { id: 'p11', learn: 'Jesus told Nicodemus: Ye must be born again (Jn 3:7).', type: 'reorder', ref: 'Jn 3:7', words: ['Ye', 'must', 'be', 'born', 'again'] },
        { id: 'p17', learn: 'Without the new birth a person cannot see the kingdom of God (Jn 3:3). Being born again opens our eyes to spiritual things.', type: 'detective', ref: 'Jn 3:3', question: 'According to Jesus, what can a person not do unless he is born again?', segments: [{ t: 'Jesus answered and said unto him, Verily, verily, I say unto thee,' }, { t: 'Except a man be born again,' }, { t: 'he cannot see the kingdom of God.', ev: true }] },
      ],
      truth: {
        teaching: 'To be born again means to be born from above (heaven). Greek: gennao anothen. Because we are born from above, we can appreciate spiritual things (Jn 3:3).',
        kid: 'Born again means a new life from God, from above! When we are born again, we can see and love the things of God.',
        deeper: ['Jn 3:3', 'Jn 3:5-6'], key: 'again',
        reflection: 'What do you think it means that this new life comes "from above"?',
      },
    },
    {
      id: 'l2', title: 'Water and the Spirit', ref: 'Jn 3:5-6',
      fieldLesson: {
        goal: 'Use Jesus’ words to explain where new life comes from.',
        childGoal: 'Find out where our new life comes from.',
      },
      verse: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God. That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.',
      intro: 'Scripture teaches that to be born again is to be born of water and the Spirit. Water here is the word of God, and the Spirit is the Holy Spirit.',
      introKid: 'We are born again by God\'s Word and by His Spirit.',
      support: [
        { ref: 'Eph 5:26', text: 'That he might sanctify and cleanse it with the washing of water by the word,' },
        { ref: '1 Pet 1:23', text: 'Being born again, not of corruptible seed, but of incorruptible, by the word of God, which liveth and abideth for ever.' },
        { ref: 'Tit 3:5', text: 'Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost;' },
      ],
      puzzles: [
        { id: 'p3', learn: 'Water is the word of God (Eph 5:26). Flesh gives flesh and the Spirit gives spirit (Jn 3:6). We are saved by His mercy, not by works (Tit 3:5).', type: 'match', pairs: [['Water (Jn 3:5)', 'The word of God'], ['Born of the flesh', 'Is flesh'], ['Born of the Spirit', 'Is spirit'], ['Saved not by works but by', 'His mercy']] },
        { id: 'p4', learn: 'To enter the kingdom of God we must be born of water and of the Spirit (Jn 3:5).', lead: 'Scripture teaches that to enter the kingdom of God, a person must be born of two things. Find where Jesus says it.', afterLearn: 'You found it in Jesus\' own words: born of water and of the Spirit (Jn 3:5).', type: 'complete', ref: 'Jn 3:5', extra: ['flesh', 'see'],
          text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of [[water]] and of the [[Spirit]], he cannot [[enter]] into the kingdom of God.' },
        { id: 'p12', learn: 'Natural birth gives natural life; the Spirit gives spiritual life (Jn 3:6).', type: 'reorder', ref: 'Jn 3:6', words: ['That', 'which', 'is', 'born', 'of', 'the', 'Spirit', 'is', 'spirit'] },
        { id: 'p15', type: 'detective', ref: 'Jn 3:5-6',
          scenario: 'Maya thinks that being born into her family and being born of the Spirit mean the same thing.',
          question: 'Which two phrases would you show Maya to compare the kind of life each birth produces?',
          hint: 'Look for the two parts that compare what is born of the flesh with what is born of the Spirit.',
          learn: 'Jesus distinguishes natural birth from spiritual birth. Natural life comes from natural birth, and spiritual life comes from the Spirit (Jn 3:6).',
          afterLearn: 'Maya sees the difference now. Being born into a family gives us natural life. The Holy Spirit gives us spiritual life (Jn 3:6).',
          reply: {
            question: 'What would you say to Maya?',
            hint: 'Use the two phrases you found. Which reply explains where both kinds of life come from?',
            options: [
              { t: 'Being born into a family gives you natural life. The Spirit gives you spiritual life.', ok: true },
              { t: 'Being born into a family gives you natural life. Spiritual life comes as you get older.', why: 'Jesus says spiritual life comes from the Spirit. Look for the reply that tells Maya where each kind of life comes from.' },
              { t: 'The Spirit gives you natural life at birth. Your family gives you spiritual life.', why: 'That reply swaps the two sources. Go back to the phrases you found and check which kind of life comes from the Spirit.' },
            ],
          },
          segments: [{ t: 'Jesus answered, Verily, verily, I say unto thee,' }, { t: 'Except a man be born of water and of the Spirit,' }, { t: 'he cannot enter into the kingdom of God.' }, { t: 'That which is born of the flesh is flesh;', ev: true }, { t: 'and that which is born of the Spirit is spirit.', ev: true }] },
        { id: 'p18', learn: 'Our citizenship is in heaven (Phil 3:20). The new birth makes us part of the kingdom of God (Jn 3:5).', type: 'detective', ref: 'Phil 3:20', question: 'A friend asks where believers belong. Which words would you show them to explain what Paul means by “conversation” here?', segments: [{ t: 'For our conversation is in heaven;', ev: true }, { t: 'from whence also we look for the Saviour,' }, { t: 'the Lord Jesus Christ:' }] },
      ],
      truth: {
        teaching: 'To be born again is to be born of water and the Spirit. Water is the word of God (Eph 5:26, Jn 15:3, 1 Pet 1:23). The Spirit: Tit 3:5. Born of water and the Spirit, we are citizens of the Kingdom of God (Jn 3:5, Phil 3:20).',
        kid: 'God\'s Word is like water that cleans, and His Spirit gives new life. When we are born again, heaven becomes our home country.',
        deeper: ['Eph 5:26', 'Jn 15:3', '1 Pet 1:23', 'Tit 3:5'], key: 'Spirit',
        reflection: 'How would you explain to a friend what it means to be born of water and of the Spirit? Which words in John 3:5–6 would you show them?',
      },
    },
    {
      id: 'l3', title: 'A new creature', ref: '2 Cor 5:17',
      verse: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
      intro: 'The Bible lists many benefits of the new birth: you become a new creature, dead to sin and alive to God, a child of God, with eternal life, which is the very life of God.',
      introKid: 'When we belong to Jesus, we are brand new on the inside!',
      support: [
        { ref: 'Rom 6:11', text: 'Likewise reckon ye also yourselves to be dead indeed unto sin, but alive unto God through Jesus Christ our Lord.' },
        { ref: 'Jn 1:13', text: 'Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.' },
        { ref: '1 Cor 6:17', text: 'But he that is joined unto the Lord is one spirit.' },
        { ref: '1 Pet 2:2', text: 'As newborn babes, desire the sincere milk of the word, that ye may grow thereby:' },
        { ref: 'Rom 6:23', text: 'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.' },
        { ref: 'Eph 1:3', text: 'Blessed be the God and Father of our Lord Jesus Christ, who hath blessed us with all spiritual blessings in heavenly places in Christ:' },
        { ref: 'Eph 1:22', text: 'And hath put all things under his feet, and gave him to be the head over all things to the church,' },
        { ref: '1 Jn 3:2', text: 'Beloved, now are we the sons of God, and it doth not yet appear what we shall be: but we know that, when he shall appear, we shall be like him; for we shall see him as he is.' },
        { ref: '1 Jn 5:11-13', text: 'And this is the record, that God hath given to us eternal life, and this life is in his Son. He that hath the Son hath life; and he that hath not the Son of God hath not life. These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life, and that ye may believe on the name of the Son of God.' },
      ],
      puzzles: [
        { id: 'p5', learn: 'In Christ we are a new creature, and old things are passed away (2 Cor 5:17).', lead: 'Scripture says that anyone joined to Jesus is made new, and the old life is gone. Find the verse that says it.', afterLearn: 'You found it: if any man be in Christ, he is a new creature (2 Cor 5:17).', type: 'complete', ref: '2 Cor 5:17', extra: ['church', 'finished'],
          text: 'Therefore if any man be in [[Christ]], he is a new [[creature]]: old things are [[passed]] away; behold, all things are become new.' },
        { id: 'p6', learn: 'These key words describe the new birth and the new life God gives.', type: 'wordsearch', words: ['BORN', 'WATER', 'SPIRIT', 'ETERNAL', 'CREATURE'], seed: 11 },
        { id: 'p7', learn: 'We live by the Word (1 Pet 2:2), our spirit is joined to His Spirit (1 Cor 6:17), and we are children of God (Jn 1:13).', type: 'match', pairs: [['We need daily', 'The Word of God'], ['Our spirit is joined to', 'God\'s Spirit'], ['Born of God means we are', 'Children of God'], ['Eternal life is', 'The very life of God']] },
        { id: 'p13', learn: 'In Christ, everything becomes new (2 Cor 5:17).', type: 'reorder', ref: '2 Cor 5:17', words: ['all', 'things', 'are', 'become', 'new'] },
        { id: 'p19', learn: 'John 1:13 says we are born not of blood, nor of the will of the flesh, nor of the will of man, but of God. Each part carries a benefit.', type: 'match', pairs: [['Not born of blood', 'We have divine health'], ['Not born of flesh', 'We are not slaves to sin'], ['Not born of the will of man', 'God has a purpose for your life'], ['Born of God', 'We are legitimate children of God']] },
        { id: 'p20', learn: 'Scripture shows more benefits of the new birth: authority (Eph 1:20-23), the blessings of God (Eph 1:3), the hope of resurrection (1 Jn 3:2), and eternal life (1 Jn 5:11-13).', type: 'match', pairs: [['Authority over the devil', 'Eph 1:22: all things under his feet'], ['Blessed, with access to the promises of God', 'Eph 1:3: all spiritual blessings'], ['The hope of resurrection', '1 Jn 3:2: we shall be like him'], ['Eternal life, the very life of God', '1 Jn 5:11: God hath given to us eternal life']] },
        { id: 'p21', type: 'detective', ref: 'Rom 6:23',
          scenario: 'Sam thinks he has to earn eternal life by doing enough good things.',
          question: 'Which words show that eternal life is a gift and tell us through whom it comes?',
          hint: 'Compare wages with a gift. Then read to the end to see through whom the gift comes.',
          learn: 'Romans 6:23 contrasts the wages of sin with the gift of eternal life through Jesus Christ. Eternal life is given through Him.',
          segments: [{ t: 'For the wages of sin is death;' }, { t: 'but the gift of God is eternal life', ev: true }, { t: 'through Jesus Christ our Lord.', ev: true }] },
      ],
      truth: {
        teaching: 'Benefits: your bad past of being a sinner who had the nature of the devil and was destined to die is completely changed (Rom 5:12, Eph 2:1-3, Jn 8:44, Rom 3:23, Rom 6:23, 1 Cor 15:22); you become a new creature (2 Cor 5:17); dead to sin and alive to God (Rom 6:11); not born of blood, we have divine health; not born of flesh, we are not slaves to sin; not born of the will of man, God has a purpose for your life; born of God, we are legitimate children of God (Jn 1:13); authority over the devil (Eph 1:20-23); blessed, with access to the promises of God (Eph 1:3, 1 Pet 1:3, Rom 8:17, 1 Pet 2:24, 1 Cor 3:21); eternal life, the very life of God (Jn 3:16, 1 Jn 5:11-13); the hope of resurrection (1 Jn 3:2).',
        kid: 'You are God\'s child with a brand-new life! God has a purpose for your life, and one day we will be like Jesus.',
        deeper: ['Rom 6:11', 'Jn 1:13', 'Rom 6:23', 'Eph 1:3', 'Eph 1:20-23', '1 Jn 3:2', '1 Jn 5:11-13', '1 Pet 2:2'], key: 'creature',
        reflection: 'What does "all things are become new" mean for you today?',
      },
    },
    {
      id: 'l4', title: 'How to be born again', ref: 'Rom 10:9-10',
      verse: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved. For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.',
      intro: 'Scripture shows the way: agree you are a sinner, then believe and confess the Lordship of Jesus Christ. It also names things people mistake for the new birth.',
      introKid: 'To be born again, we believe in Jesus and say that He is Lord.',
      support: [
        { ref: 'Rom 3:23', text: 'For all have sinned, and come short of the glory of God;' },
        { ref: 'Jn 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      ],
      puzzles: [
        { id: 'p22', learn: 'The first step to being born again is to agree you are a sinner. Scripture says all have sinned (Rom 3:23).', type: 'detective', ref: 'Rom 3:23', question: 'According to this verse, who has sinned?', segments: [{ t: 'For all have sinned,', ev: true }, { t: 'and come short of the glory of God;' }] },
        { id: 'p8', learn: 'With the heart man believeth unto righteousness (Rom 10:10).', type: 'wordbuild', answer: 'BELIEVE', clue: 'With the heart man ___ unto righteousness (Rom 10:10)' },
        { id: 'p9', learn: 'Confess Jesus as Lord, believe God raised Him from the dead, and you shall be saved (Rom 10:9).', lead: 'Scripture names two things a person does, one with the mouth and one with the heart, and promises salvation. Find where it says so.', afterLearn: 'You found it: confess with your mouth and believe in your heart, and you shall be saved (Rom 10:9).', type: 'complete', ref: 'Rom 10:9', extra: ['doubt', 'earn'],
          text: 'That if thou shalt [[confess]] with thy mouth the [[Lord]] Jesus, and shalt [[believe]] in thine heart that God hath [[raised]] him from the dead, thou shalt be saved.' },
        { id: 'p10', learn: 'New birth comes by believing and confessing Jesus as Lord, not by anything we do (Rom 10:9-10).', type: 'truthsort', cards: [
          { t: 'Being baptized in water makes you born again.', truth: false, why: 'This is a common misconception. "Water" in John 3:5 is the word of God (Eph 5:26).' },
          { t: 'Speaking in tongues is what makes you born again.', truth: false, why: 'This is a common misconception. New birth comes by believing and confessing Jesus as Lord (Rom 10:9-10).' },
          { t: 'You must be sinless before you can be born again.', truth: false, why: 'A common misconception. New birth begins with agreeing you are a sinner and believing in Jesus.' },
          { t: 'Believing and confessing the Lordship of Jesus Christ is how to be born again.', truth: true, why: 'Yes: Rom 10:9-10 is the way to be born again.' },
          { t: 'Being born in a church family makes you born again.', truth: false, why: 'A common misconception. Being born in a church is not the same as being born again.' },
          { t: 'Born again means born from above.', truth: true, why: 'Yes: gennao anothen, born from above (heaven), Jn 3:3.' },
          { t: 'Going to church on Sundays makes you born again.', truth: false, why: 'A common misconception. Church attendance is good, but it does not make you born again.' },
          { t: 'Befriending a man of God makes you born again.', truth: false, why: 'A common misconception. Knowing a man of God is good, but new birth comes by believing and confessing Jesus as Lord (Rom 10:9-10).' },
          { t: 'We need the Word of God daily to grow, because we are born of the Word.', truth: true, why: 'Yes: 1 Pet 2:2 and 1 Pet 1:23 as Scripture teaches.' },
        ] },
        { id: 'p14', learn: 'Salvation comes by confessing the Lord Jesus and believing in the heart (Rom 10:9).', type: 'reorder', ref: 'Rom 10:9', words: ['confess', 'with', 'thy', 'mouth', 'the', 'Lord', 'Jesus'] },
        { id: 'p16', learn: 'Two things go together: confessing with the mouth and believing in the heart (Rom 10:9).', type: 'detective', ref: 'Rom 10:9', question: 'What two things does this verse say lead to being saved?', segments: [{ t: 'That if thou shalt confess with thy mouth the Lord Jesus,', ev: true }, { t: 'and shalt believe in thine heart that God hath raised him from the dead,', ev: true }, { t: 'thou shalt be saved.' }] },
      ],
      truth: {
        teaching: 'How to be born again: 1. Agree you are a sinner (Rom 3:23). 2. Believe and confess the Lordship of Jesus Christ (Rom 10:9-10). It is not water baptism, speaking in tongues, being sinless, being born in a church, or going to church on Sundays.',
        kid: 'First, agree with God that we have sinned. Then believe in your heart and say with your mouth that Jesus is Lord.',
        deeper: ['Rom 3:23', 'Rom 10:9-10', 'Jn 3:16'], key: 'confess',
        reflection: 'In your own words, what does it mean to confess Jesus as Lord?',
      },
    },
  ],
  quiz: [
    { id: 'q1', q: 'What do the Greek words "gennao anothen" mean?', options: [
      { t: 'Born from above (heaven)', ok: true, why: 'Yes. Scripture teaches born from above, from heaven (Jn 3:3).' },
      { t: 'Baptized in water', why: 'Not quite. Water baptism is not what the words mean.' },
      { t: 'Taught by a pastor', why: 'Not quite. The words describe a birth, not a class.' }] },
    { id: 'q2', q: 'In John 3:5, what does "water" mean here?', options: [
      { t: 'The word of God', ok: true, why: 'Yes. Eph 5:26, Jn 15:3 and 1 Pet 1:23 teach this.' },
      { t: 'Baptism in a river', why: 'Being baptized in water is a common misconception.' },
      { t: 'A church building', why: 'Not quite. Scripture points to the word of God.' }] },
    { id: 'q3', q: 'According to Scripture, which is how a person is born again?', options: [
      { t: 'Going to church every Sunday', why: 'This is a common misconception. Church is important, but it does not make you born again.' },
      { t: 'Believing and confessing the Lordship of Jesus Christ', ok: true, why: 'Yes: Rom 10:9-10.' },
      { t: 'Being sinless first', why: 'This is a common misconception.' }] },
    { id: 'q4', q: 'Why does a new believer need the Word of God daily?', options: [
      { t: 'Because we are born of the Word, and it helps us grow', ok: true, why: 'Yes: 1 Pet 2:2, 1 Pet 1:23.' },
      { t: 'To earn a place in the kingdom', why: 'Not quite. The new birth is a gift, and the Word helps us grow.' },
      { t: 'Only to prepare for a test', why: 'Not quite. We feed on the Word to grow, like newborn babes.' }] },
    { id: 'q5', q: 'The Bible says eternal life is...', options: [
      { t: 'Only life after we die', why: 'Scripture teaches it is the very life of God, with a quality for now as well (Jn 10:10).' },
      { t: 'The very life of God', ok: true, why: 'Yes. We become partakers of the divine nature (2 Pet 1:4).' },
      { t: 'A reward for good behavior', why: 'Not quite. It is a gift of the new birth (Jn 3:16).' }] },
    { id: 'q6', q: 'According to John 1:13, believers are born...', options: [
      { t: 'Of God', ok: true, why: 'Yes. Born not of blood, nor of the will of the flesh, nor of the will of man, but of God (Jn 1:13).' },
      { t: 'Of the will of man', why: 'Not quite. John 1:13 says not of the will of man, but of God.' },
      { t: 'Of blood', why: 'Not quite. John 1:13 says not of blood, but of God.' }] },
    { id: 'q7', q: 'What is the gift of God, according to Romans 6:23?', options: [
      { t: 'Eternal life through Jesus Christ our Lord', ok: true, why: 'Yes. The wages of sin is death, but the gift of God is eternal life (Rom 6:23).' },
      { t: 'Wages for good work', why: 'Not quite. The wages of sin is death; the gift of God is something else.' },
      { t: 'A place in a church', why: 'Not quite. Romans 6:23 names eternal life as the gift.' }] },
    { id: 'q8', q: 'Jo reads the Bible every day. She asks whether reading it each day is what makes her born again. What would you tell her?', options: [
      { t: 'Reading Scripture brings the new birth. Believing in Jesus helps you grow afterward.', why: 'Romans 10:9–10 points to believing and confessing Jesus as Lord. Reading Scripture helps us grow (1 Pet 2:2).' },
      { t: 'Believe in Jesus and confess Him as Lord. Keep reading Scripture so you can grow.', ok: true, why: 'Romans 10:9–10 explains believing and confessing Jesus as Lord. First Peter 2:2 explains how the Word helps believers grow.' },
      { t: 'Read Scripture until you have grown enough. Then you are ready to believe in Jesus.', why: 'Romans 10:9–10 does not ask you to grow enough first. First Peter 2:2 describes growth after birth.' }],
      evidence: {
        q: 'Which pair of passages supports both parts of your reply to Jo?',
        refs: ['Jn 3:3', 'Rom 10:9-10', '1 Pet 2:2'],
        options: [
          { t: 'John 3:3 and Romans 10:9–10', why: 'These passages show why a new birth is needed and what believing and confessing have to do with salvation. Find the passage that explains growth, too.' },
          { t: 'John 3:3 and 1 Peter 2:2', why: 'These passages cover the need for a new birth and growth after birth. Find the passage that also speaks about believing and confessing Jesus as Lord.' },
          { t: 'Romans 10:9–10 and 1 Peter 2:2', ok: true, why: 'Romans 10:9–10 connects salvation with believing and confessing Jesus as Lord. First Peter 2:2 shows how the Word helps believers grow.' }],
      },
    },
  ],
  bookplate: { title: 'Born Again', caption: 'World 1 bookplate' },
};
attachWorld1GameplayExtensions(world1);
