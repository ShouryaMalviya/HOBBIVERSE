-- ============================================================================
-- HOBBIVERSE: SEED DATA MIGRATION
-- Migration: 20261019000002_seed_data.sql
-- Description: Seeds the core 8 categories, 8 beginner hobbies, structured steps,
-- kindred circles, community gathering events, and anti-streak challenges.
-- ============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, description, accent_family, activity_count)
VALUES
  ('art-craft', 'Art & Craft', 'Tactile mediums, pigments, bookbinding, paper arts, and sculptural craft.', 'art-craft', 14),
  ('outdoors-nature', 'Outdoors & Nature', 'Foraging, birding, nature sketching, gardening, and botanical preservation.', 'outdoors-nature', 12),
  ('music', 'Music & Acoustic', 'Fingerstyle guitar, ambient synths, ukulele, rhythm, and gentle songcraft.', 'music', 10),
  ('cooking', 'Cooking & Baking', 'Slow fermentation, handmade pasta, seasonal preserves, and herbal tisanes.', 'cooking', 15),
  ('movement', 'Movement & Wellbeing', 'Restorative mobility, somatic stretching, walking meditation, and tai chi basics.', 'movement', 9),
  ('mindful', 'Mindful Moments', 'Tea rituals, breathwork, quiet journaling, and sensory grounding practices.', 'mindful', 11),
  ('reading-writing', 'Reading & Writing', 'Slow reading, flash fiction, margin notation, personal essays, and poetry craft.', 'reading-writing', 8),
  ('social-games', 'Social & Games', 'Cooperative board games, puzzle nights, quiet book circles, and tabletop adventures.', 'social-games', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  accent_family = EXCLUDED.accent_family,
  activity_count = EXCLUDED.activity_count;

-- 2. Hobbies
INSERT INTO public.hobbies (
  id, slug, title, category_id, category_name, summary, description,
  first_step_prompt, time_estimate, estimated_minutes, difficulty, cost_range,
  location_type, social_type, energy_level, materials_needed, skills_practiced,
  ways_to_adapt, tags, is_featured, editorial_collection
)
VALUES
  (
    'hobby-1',
    'botanical-watercolor',
    'Botanical Watercolor Painting',
    'art-craft',
    'Art & Craft',
    'Learn pigment transparency, leaf washes, and delicate organic brushwork on cold-press paper.',
    'Botanical watercolor focuses on observing organic foliage, understanding pigment granulation, and layering wet-on-dry glazes to create quiet leaf studies.',
    'Mix your first puddle of sap green and paint three rounded leaf silhouettes on scrap paper.',
    '15–20 min',
    20,
    'beginner',
    '$15–$30 for student starter kit',
    'indoor',
    'both',
    'calm',
    ARRAY['Student watercolor set (3 basic pans)', 'Round watercolor brush (size 6 or 8)', 'Cold-press paper pad (140lb/300gsm)', 'Two small water jars & cotton rag'],
    ARRAY['Water control', 'Color blending', 'Observational brush control'],
    '{"solo": "Paint in quiet morning daylight with a hot cup of herbal tea.", "social": "Trade completed leaf postcards with a pen pal or atelier circle member."}'::jsonb,
    ARRAY['painting', 'botanical', 'relaxing', 'paper', 'beginner'],
    true,
    'try-in-15'
  ),
  (
    'hobby-2',
    'sourdough-baking',
    'Artisan Sourdough Rhythm',
    'cooking',
    'Cooking & Baking',
    'Cultivate wild yeast fermentation, master hydration folding, and bake crusty rustic loaves.',
    'Sourdough baking is a mindful rhythm connecting flour, water, salt, and wild ambient cultures. A rewarding weekend craft with minimal active hands-on time.',
    'Feed a spoonful of flour and water in a clean glass jar and track the bubble rise over 4 hours.',
    '15 min hands-on',
    15,
    'easy',
    '$10–$20 for flour and banneton',
    'indoor',
    'both',
    'medium',
    ARRAY['Unbleached bread flour & whole wheat flour', 'Glass jar with loose lid', 'Digital kitchen scale', 'Dutch oven or heavy lidded pot'],
    ARRAY['Dough fermentation', 'Stretch & fold mechanics', 'Hydration intuition'],
    '{"solo": "Bake a weekly loaf on Sunday mornings as a nourishing kitchen ritual.", "social": "Gift half your warm loaf to a neighbor or share starter discard recipes in the club."}'::jsonb,
    ARRAY['baking', 'fermentation', 'kitchen', 'weekend', 'routine'],
    true,
    'hands-on-weekends'
  ),
  (
    'hobby-3',
    'fingerstyle-guitar',
    'Fingerstyle Acoustic Guitar',
    'music',
    'Music & Acoustic',
    'Gentle alternate bass picking, warm nylon/steel tones, and soothing melodic motifs.',
    'Fingerstyle guitar emphasizes individual string picking with thumb and fingertips instead of plectrum strumming, creating a warm piano-like acoustic voice.',
    'Place your right hand thumb on the 6th string and index on the 3rd string, alternating a slow two-beat pulse.',
    '15 min',
    15,
    'beginner',
    '$80–$150 beginner acoustic guitar',
    'indoor',
    'both',
    'calm',
    ARRAY['Acoustic or nylon string guitar', 'Clip-on tuner', 'Simple chord chart'],
    ARRAY['Thumb-index independence', 'Frethand arching', 'Rhythmic pacing'],
    '{"solo": "Play in low lamplight before bed as a relaxing analog decompression.", "social": "Join the acoustic circle audio room to strum alongside kindred pickers."}'::jsonb,
    ARRAY['guitar', 'acoustic', 'fingerstyle', 'relaxing', 'music'],
    true,
    'try-in-15'
  ),
  (
    'hobby-4',
    'pressed-flower-botany',
    'Pressed Flower Botany & Specimen Art',
    'outdoors-nature',
    'Outdoors & Nature',
    'Collect fallen blooms, press in heavy vintage books, and mount framed archival specimen cards.',
    'Preserving botanical specimens turns quiet neighborhood walks into mindful treasure hunts, documenting the shifting seasons through dried flora.',
    'Gather 3 fallen leaves or blossoms on your next short stroll and press them between parchment sheets in a heavy book.',
    '20 min',
    20,
    'beginner',
    '$5–$15 for parchment & frames',
    'flexible',
    'both',
    'calm',
    ARRAY['Heavy hardcover books or wooden flower press', 'Absorbent parchment paper', 'Blunt tweezers', 'Acid-free specimen backing cards'],
    ARRAY['Botanical observation', 'Gentle preservation handling', 'Composition layout'],
    '{"solo": "Catalogue local flora in a personal bound field naturalist notebook.", "social": "Exchange pressed herbarium cards in botanical postal swaps."}'::jsonb,
    ARRAY['botany', 'foraging', 'nature', 'craft', 'preserving'],
    true,
    'explore-outdoors'
  ),
  (
    'hobby-5',
    'restorative-morning-mobility',
    'Restorative Morning Somatic Mobility',
    'movement',
    'Movement & Wellbeing',
    'Unguarded joint mobility, floor somatic waves, and gentle postural resets without strain.',
    'Restorative mobility strips away competitive fitness expectations, focusing on lubricated joint circles, breath integration, and spinal ease.',
    'Lie on a soft rug or mat, hug knees gently toward your chest, and take five slow belly breaths.',
    '10–15 min',
    12,
    'beginner',
    'Free / Minimal',
    'indoor',
    'solo',
    'calm',
    ARRAY['Comfortable non-restrictive clothing', 'Soft floor rug or yoga mat', 'Folded wool blanket for knee/head support'],
    ARRAY['Joint mobilization', 'Diaphragmatic breathing', 'Body awareness'],
    '{"solo": "Perform in the first quiet 10 minutes of waking before turning on screens.", "social": "Practice alongside a housemate or gentle morning room call."}'::jsonb,
    ARRAY['mobility', 'morning', 'breathwork', 'stretching', 'gentle'],
    false,
    'try-in-15'
  ),
  (
    'hobby-6',
    'gongfu-tea-ritual',
    'Mindful Gongfu Tea Ritual',
    'mindful',
    'Mindful Moments',
    'Appreciate loose leaf oolong, steep small clay pots, and cultivate sensory focus through steam and aroma.',
    'Gongfu tea brewing emphasizes multiple short steepings of full leaf teas, transforming a warm beverage into an intimate sensory grounding meditation.',
    'Heat water to a gentle simmer, preheat a single small cup, and inhale the clean steam for 60 seconds.',
    '15 min',
    15,
    'beginner',
    '$20–$40 for gaiwan and sample oolong leaves',
    'indoor',
    'both',
    'calm',
    ARRAY['Gaiwan or small ceramic brewing vessel', 'Fairness pitcher / small pouring beaker', 'Two small porcelain tasting cups', 'High mountain oolong or white tea leaves'],
    ARRAY['Temperature sensitivity', 'Sensory taste profiling', 'Calm presence'],
    '{"solo": "Brew three consecutive steeps in complete silence between deep work sprints.", "social": "Host an intimate afternoon tea tasting for a close friend."}'::jsonb,
    ARRAY['tea', 'mindful', 'sensory', 'ritual', 'calm'],
    true,
    'creative-reset'
  ),
  (
    'hobby-7',
    'pocket-flash-fiction',
    'Pocket Flash Fiction Writing',
    'reading-writing',
    'Reading & Writing',
    'Distill evocative scenes into 100-word micro stories using sensory observation and concise prose.',
    'Flash fiction strips away sprawling chapter outlines to focus on a single evocative moment: a train window reflection, a thrifted coat pocket clue, or a recipe margin note.',
    'Write three sentences describing a small sound you heard today that most people ignored.',
    '15 min',
    15,
    'beginner',
    'Minimal / Notebook and ink pen',
    'flexible',
    'both',
    'calm',
    ARRAY['Pocket notebook or blank journal', 'Reliable smooth gel or fountain pen'],
    ARRAY['Concise prose', 'Sensory detail', 'Emotional resonance'],
    '{"solo": "Keep a daily 100-word micro journal of street observations.", "social": "Share short stories in the atelier writer circle for friendly encouragement."}'::jsonb,
    ARRAY['writing', 'fiction', 'stories', 'journal', 'creative'],
    false,
    'creative-reset'
  ),
  (
    'hobby-8',
    'cooperative-tabletop',
    'Modern Cooperative Board Games',
    'social-games',
    'Social & Games',
    'Collaborate with friends or play solo against puzzle mechanisms without cutthroat competition.',
    'Cooperative board gaming shifts focus from beating your friends to working together against designed game puzzles—solving mysteries, balancing ecosystems, or escaping islands.',
    'Read through a 4-page rules summary and test run one practice round of a solo puzzle turn.',
    '30–45 min',
    40,
    'easy',
    '$20–$40 for a modular card puzzle game',
    'indoor',
    'both',
    'medium',
    ARRAY['One cooperative small-box game (e.g., Sprawlopolis, Regicide, or The Crew)', 'Flat tabletop surface', 'Quiet music playlist'],
    ARRAY['Tactical cooperation', 'Pattern matching', 'Constructive communication'],
    '{"solo": "Tackle solo puzzle scenarios over evening tea as an engaging brain rest.", "social": "Host an unplugged weekend game night with seasonal warm cider."}'::jsonb,
    ARRAY['games', 'cooperative', 'puzzles', 'social', 'unplugged'],
    false,
    'hands-on-weekends'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category_id = EXCLUDED.category_id,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  materials_needed = EXCLUDED.materials_needed,
  steps = EXCLUDED.steps,
  ways_to_adapt = EXCLUDED.ways_to_adapt;

-- 3. Structured Steps for Each Seed Hobby
INSERT INTO public.hobby_steps (id, hobby_id, step_order, title, estimated_minutes, description, instructions, supplies_needed)
VALUES
  ('step-1-1', 'hobby-1', 1, 'Puddle Consistency & Wet-on-Dry Test', 15, 'Learn the difference between tea-consistency and milk-consistency pigment washes.', ARRAY['Dip your brush in clean water and wake up a small pan of olive or sap green.', 'Pull pigment onto your palette until it pools like weak tea.', 'Lay down a smooth square on your dry paper without scrubbing.'], ARRAY['Paint pan', 'Brush', 'Paper', 'Water jar']),
  ('step-1-2', 'hobby-1', 2, 'Single-Stroke Leaf Silhouette', 15, 'Use tip pressure to taper stems into plump leaf bellies.', ARRAY['Start on the brush tip with light touch for the stem.', 'Press down gently to splay the belly of the brush.', 'Lift back to the very tip to taper into the leaf apex.'], NULL),
  ('step-1-3', 'hobby-1', 3, 'Vein Layering & Wet-in-Wet Bleeds', 20, 'Drop a secondary pigment into still-damp leaves to create natural color gradation.', ARRAY['Paint a fresh leaf with golden ochre pigment.', 'While still glossy wet, touch a drop of deep indigo into the base.', 'Watch the pigments bloom naturally without manual blending.'], NULL),

  ('step-2-1', 'hobby-2', 1, 'The 4-Hour Starter Rise Test', 15, 'Observe fermentation vigor before mixing your main dough.', ARRAY['Stir 20g active starter with 40g water and 40g flour in a clean jar.', 'Place a rubber band at the initial filling level.', 'Observe bubble formation and aroma after 3–4 hours at room temperature.'], NULL),
  ('step-2-2', 'hobby-2', 2, 'Autolyse & Coil Folds', 20, 'Develop gluten strength gently without tedious hand kneading.', ARRAY['Mix flour and water and let rest for 30 minutes to autolyse.', 'Add salt and starter, working through dough with wet hands.', 'Perform 3 sets of gentle coil folds spaced 45 minutes apart.'], NULL),

  ('step-3-1', 'hobby-3', 1, 'Thumb & Index Independence', 15, 'Establish the steady anchor pulse of alternating fingerpicking.', ARRAY['Place thumb on low E string and index on G string.', 'Pick thumb on beat 1, index on beat 2, in a steady relaxed tempo.', 'Keep your wrist softly curved without tension.'], NULL),

  ('step-4-1', 'hobby-4', 1, 'The Afternoon Foraging Walk', 20, 'Discover interesting pressed specimens on nearby sidewalks.', ARRAY['Walk a familiar route and look for flat-laying wildflowers and interesting weeds.', 'Choose blooms that are free from morning dew.', 'Place them gently between folded scrap paper in your pocket.'], NULL),

  ('step-5-1', 'hobby-5', 1, 'Somatic Wave & Pelvic Clock', 12, 'Release lower back and hip stiffness with effortless oscillations.', ARRAY['Lie supine with knees bent and feet flat on the floor.', 'Gently rock the pelvis between 12 o''clock and 6 o''clock.', 'Exhale as lower back flattens; inhale as back softly arches.'], NULL),

  ('step-6-1', 'hobby-6', 1, 'Vessel Warming & Leaf Awakening', 15, 'Open tightly rolled oolong leaves with steam.', ARRAY['Pour boiling water into the empty porcelain gaiwan to warm it.', 'Pour out the warm water into your cups.', 'Place 4g of dry leaves in the hot damp gaiwan and inhale the awakened aroma.'], NULL),

  ('step-7-1', 'hobby-7', 1, 'The 100-Word Micro Scene', 15, 'Craft a self-contained narrative in exactly 100 words.', ARRAY['Pick a single object on your desk as the focal anchor.', 'Write a beginning, a moment of realization, and an ending.', 'Edit out unnecessary adverbs until the count lands around 100.'], NULL),

  ('step-8-1', 'hobby-8', 1, 'Solo Practice Scenario', 20, 'Walk through an introductory scenario without timer stress.', ARRAY['Set up the cards for the beginner layout according to the rulebook.', 'Take three turns experimenting with resource combination.', 'Take note of how the puzzle challenges solo problem solving.'], NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  instructions = EXCLUDED.instructions;

-- 4. Kindred Circles / Groups
INSERT INTO public.groups (id, slug, name, description, category, member_count, guidelines)
VALUES
  ('group-1', 'botanical-artists', 'Botanical Sketch & Watercolor Circle', 'A gentle corner for observational plant artists, pressed flower crafters, and leaf wash enthusiasts.', 'art-craft', 52, ARRAY['Share work-in-progress without perfectionism.', 'Offer supportive observations over harsh critique.', 'Celebrate small consistent efforts.']),
  ('group-2', 'sourdough-bakers', 'Sourdough & Hearth Fermenters', 'Troubleshooting hydration, sharing starter tips, and celebrating blistered crusts.', 'cooking', 74, ARRAY['No shaming beginner baking mishaps.', 'Share recipes with grams where possible.']),
  ('group-3', 'acoustic-circle', 'Acoustic Fingerstyle & Folk', 'Slow tempo fingerpicking enthusiasts, tab exchanges, and acoustic tone discussions.', 'music', 38, ARRAY['All skill levels welcome.', 'Encourage relaxed tempo practice.'])
ON CONFLICT (slug) DO NOTHING;

-- 5. Atelier Events
INSERT INTO public.events (id, slug, title, description, category, scheduled_date, time_label, format, participants_count, participation_prompt)
VALUES
  ('event-1', 'acoustic-song-circle', 'Acoustic Song Circle & Tea', 'Bring your instrument or listen in. A quiet virtual studio session with 10 minutes of sharing at the end.', 'music', 'Saturday, Oct 17', '4:00 PM (Local)', 'online', 16, 'Bring any acoustic instrument or a cup of warm tea.'),
  ('event-2', 'weekend-leaf-printing', 'Sunday Morning Botanical Leaf Pressing', 'Gather leaves from your morning walk and join us live for gentle specimen pressing and card making.', 'art-craft', 'Sunday, Oct 18', '10:00 AM (Local)', 'online', 22, 'Have 2–3 pressed leaves and cardstock nearby.'),
  ('event-3', 'sourdough-crumb-clinic', 'Sourdough Crumb & Hydration Clinic', 'Troubleshoot sticky dough, coil folds, and scoring angles in a friendly open-floor video studio.', 'cooking', 'Sunday, Oct 18', '11:00 AM (Local)', 'online', 24, 'Bring a photo or question about your latest starter or loaf.'),
  ('event-4', 'co-op-tabletop-twilight', 'Cooperative Board Game Twilight', 'Join a gentle online table session playing Sprawlopolis or Forbidden Island together over audio.', 'social-games', 'Tuesday, Oct 20', '6:30 PM (Local)', 'online', 18, 'No prior rules knowledge required; we teach in 5 minutes.')
ON CONFLICT (slug) DO NOTHING;

-- 6. Anti-Streak Challenges
INSERT INTO public.challenges (id, slug, title, description, category, duration_days, target_sessions_count)
VALUES
  ('chal-1', 'gentle-first-three', 'Gentle First Three Sessions', 'Log any 3 creative hobby sessions of 15+ minutes at your own pace.', 'art-craft', 14, 3),
  ('chal-2', 'sensory-reset-five', 'Five Days of Sensory Reset', 'Spend 10 minutes daily with tea, sketching, or acoustic music.', 'mindful', 7, 5),
  ('chal-3', 'weekend-bread-craft', 'Weekend Hearth Exploration', 'Bake or prep any dough, flatbread, or starter feeding twice this month at an easy pace.', 'cooking', 21, 2)
ON CONFLICT (slug) DO NOTHING;
