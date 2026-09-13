# DIGITAL FLOWER GIFT
# MASTER SPECIFICATION
# Version 1.0

---

## 0. DOCUMENT PURPOSE

This document is the single source of truth for implementing the Digital Flower Gift web application.

The application is a mobile-first web experience where one person creates a digital flower gift for another person.

The giver creates the flower and gives the recipient a private link.

The recipient opens the link in a mobile browser and takes care of the flower over time.

The flower grows progressively over approximately 30 calendar days.

The recipient waters, gives sunlight, and gives love to the flower.

The flower must never permanently die.

After 30 days, the flower blooms and displays a personalized bloom message.

The experience should feel emotional, warm, simple, private, and gift-like.

This is NOT a social network.

This is NOT a game platform.

This is NOT an AI-generation application.

This is NOT a messaging application.

The core experience is:

RECEIVE → CARE → RETURN → GROW → WAIT → BLOOM


==================================================
1. PROJECT IDENTITY
==================================================

Project name:

Digital Flower Gift

Suggested internal project name:

digital-flower-gift

Application type:

Mobile-first web application / PWA-ready web application

Primary use:

A person creates a digital flower gift and sends a private link to another person.

Example:

Giver:
"Create a flower for Maria."

The application generates a private URL such as:

/g/7kF3pQx9Vn2Lm8Ra...

The giver shares that URL.

Recipient opens it.

Recipient sees:

"Maria's Flower"

The flower grows over time through daily care.

After Day 30:

The flower blooms and reveals the personalized bloom message.


==================================================
2. NON-NEGOTIABLE PRODUCT PRINCIPLES
==================================================

The implementation MUST follow these principles.

### 2.1 New standalone project

This is a completely new project.

Do NOT modify:

- Delish Studio
- Pinster
- Sulat
- unrelated repositories
- unrelated directories

Do not clone another application into this project.

Do not reuse another project's application code unless explicitly necessary for a dependency or standard configuration.

The current project directory is expected to be dedicated exclusively to Digital Flower Gift.


### 2.2 Mobile-first

The primary user is expected to use a smartphone.

The application must work well at:

- 360px
- 375px
- 390px
- 412px
- larger mobile screens
- tablets
- desktop browsers

Do not design desktop-first and shrink it down.

Design mobile-first and progressively enhance.


### 2.3 Simple

The recipient should understand what to do immediately.

The application should not feel like a complicated dashboard.

Avoid:

- unnecessary navigation
- excessive settings
- complex menus
- unnecessary accounts
- unnecessary onboarding
- excessive statistics


### 2.4 Emotional

The application should feel like receiving a small digital gift.

Visual direction:

- warm
- soft
- romantic
- gentle
- clean
- premium
- personal
- calm

Avoid:

- generic SaaS dashboards
- neon colors
- excessive gradients
- clutter
- cheap clip-art aesthetics
- overly technical UI
- excessive gamification


### 2.5 Flower is the visual focus

The flower should be the main visual element.

The interface should support the flower rather than compete with it.


==================================================
3. TECHNOLOGY STACK
==================================================

Preferred stack:

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS OR clean lightweight CSS
- Supabase PostgreSQL
- Vercel deployment

Recommended supporting libraries:

- Zod for validation
- a small UUID/random utility if needed
- standard Web APIs where possible

Do not add dependencies unnecessarily.

Prefer built-in browser and Next.js functionality where practical.


==================================================
4. APPLICATION ARCHITECTURE
==================================================

Use a clean full-stack Next.js architecture.

Suggested structure:

app/
  page.tsx
  create/
    page.tsx
  preview/
    page.tsx
  g/
    [token]/
      page.tsx
  api/
    gifts/
      route.ts
    gifts/
      [token]/
        route.ts
        care/
          route.ts

components/
  flower/
  gift/
  care/
  ui/

lib/
  db/
  flower/
  care/
  rewards/
  security/
  validation/
  time/

types/

tests/

supabase/
  migrations/

Exact structure may differ if a better architecture is justified.

Do not over-engineer.


==================================================
5. MAIN USER FLOWS
==================================================

There are two primary flows.

FLOW A:

GIVER CREATES GIFT

FLOW B:

RECIPIENT CARES FOR FLOWER


--------------------------------------------------
5.1 FLOW A — GIVER CREATES GIFT
--------------------------------------------------

The giver visits the landing page.

They should immediately understand:

"Create a flower someone can grow."

The giver selects:

1. Flower type
2. Flower name
3. Recipient name
4. Personal message
5. Bloom message
6. Optional giver name
7. Start date

The application previews the gift.

The giver confirms.

The server creates the gift.

The server generates a secure random private token.

The application displays the private gift URL.

The giver can:

- copy the link
- use Web Share API if available
- optionally display a QR code if implemented

No recipient account is required.


--------------------------------------------------
5.2 FLOW B — RECIPIENT
--------------------------------------------------

Recipient opens:

/g/[token]

The server retrieves the gift.

The recipient sees:

- flower
- flower name
- recipient name
- personal message
- current growth stage
- current health
- care actions
- progress toward bloom
- streak
- XP
- unlocked rewards

The recipient can perform daily care.

Primary action:

WATER

Optional actions:

SUNLIGHT

LOVE


==================================================
6. LANDING PAGE
==================================================

The landing page should explain the concept quickly.

Suggested messaging:

"Give someone a flower that grows with them."

Supporting copy:

"Create a digital flower, write a personal message, and send a private link. They care for it a little each day. After 30 days, it blooms."

Primary CTA:

"Create a Flower"

Secondary information can explain:

- daily care
- growth
- 30-day bloom
- private link

Do not require an account for MVP.


==================================================
7. CREATE GIFT FORM
==================================================

Fields:

### Flower type

Required.

MVP may provide a controlled list such as:

- Rose
- Sunflower
- Tulip
- Daisy
- Lavender
- Custom/simple flower

The implementation may use a smaller controlled set if visual assets are easier.

Do not implement an AI-generated flower system.

### Flower name

Required.

Examples:

- Sunny
- Rosie
- Bloom
- Luna

Validation:

- trim whitespace
- reasonable maximum length
- reject empty value

Suggested maximum:

50 characters.


### Recipient name

Required.

Suggested maximum:

80 characters.


### Personal message

Required.

This message is shown before or alongside the growing flower.

Suggested maximum:

500 characters.


### Bloom message

Required.

This is revealed when the flower reaches Day 30.

Suggested maximum:

500 characters.


### Giver name

Optional.

Suggested maximum:

80 characters.


### Start date

Required.

Default:

Current calendar date.

The UI should make the selected date clear.

The server must validate it.

Do not trust client-calculated growth.


==================================================
8. GIFT PREVIEW
==================================================

Before final creation, show a preview.

Preview should display:

- selected flower
- flower name
- recipient name
- personal message
- approximate visual appearance
- start date
- bloom message indication

The giver should be able to go back and edit.

The preview should NOT create the permanent gift until confirmation.


==================================================
9. GIFT CREATION
==================================================

When the giver confirms:

1. Validate all input on the server.
2. Sanitize/escape user-provided text appropriately.
3. Generate cryptographically secure random token.
4. Insert gift into database.
5. Return gift URL.

The token must NOT be:

- sequential
- based on name
- based on timestamp
- generated using Math.random()
- predictable
- derived from recipient information


==================================================
10. PRIVATE TOKEN REQUIREMENTS
==================================================

Private gift URLs are security-sensitive.

Use a cryptographically secure random generator.

In Node.js use an appropriate secure mechanism such as:

crypto.randomBytes()

or an equivalent Web Crypto API implementation.

The resulting token must be URL-safe.

Recommended:

at least 128 bits of entropy.

A token can look conceptually like:

/g/k8P2mQ7vX4nL9rT3...

Do not expose internal database IDs as the public URL.

Do not use:

/g/1
/g/2
/g/maria
/g/maria-rose
/g/20260913


==================================================
11. DATABASE
==================================================

Preferred database:

Supabase PostgreSQL.

The server must be authoritative for:

- gift data
- care events
- XP
- streak
- growth stage
- health
- rewards

The client must never be trusted to submit:

- XP amount
- growth stage
- health
- streak
- reward unlocks


--------------------------------------------------
11.1 gifts TABLE
--------------------------------------------------

Suggested schema:

gifts

id
- UUID
- primary key

public_token
- text
- unique
- indexed
- not null

recipient_name
- text
- not null

giver_name
- text
- nullable

flower_type
- text
- not null

flower_name
- text
- not null

personal_message
- text
- not null

bloom_message
- text
- not null

start_date
- date
- not null

created_at
- timestamp/timestamptz
- not null

updated_at
- timestamp/timestamptz
- not null

status
- text
- default active


--------------------------------------------------
11.2 care_events TABLE
--------------------------------------------------

care_events

id
- UUID
- primary key

gift_id
- UUID
- foreign key -> gifts.id

care_date
- date
- not null

care_type
- text
- not null

xp_awarded
- integer
- not null

created_at
- timestamp/timestamptz
- not null

Required uniqueness:

(gift_id, care_date, care_type)

This prevents duplicate care actions from repeatedly awarding XP.


--------------------------------------------------
11.3 rewards TABLE
--------------------------------------------------

rewards

id
- UUID
- primary key

gift_id
- UUID
- foreign key -> gifts.id

reward_key
- text
- not null

unlocked_at
- timestamp/timestamptz
- not null

Unique:

(gift_id, reward_key)


--------------------------------------------------
11.4 OPTIONAL notification preferences
--------------------------------------------------

If notifications are implemented:

notification_preferences

id
- UUID
- primary key

gift_id
- UUID

enabled
- boolean

preferred_time
- optional

timezone
- optional

Do not make notifications a requirement for the MVP.


==================================================
12. FLOWER GROWTH SYSTEM
==================================================

Growth is time-based.

The flower must progress according to calendar dates.

Growth must not depend solely on user activity.

Care improves health and engagement but does not permanently prevent growth.

Growth should continue even if the recipient misses days.


--------------------------------------------------
12.1 DAY CALCULATION
--------------------------------------------------

Use calendar-day difference.

Do NOT use:

current timestamp - start timestamp

as the sole growth calculation.

The system should calculate:

calendar difference between start_date and current calendar date.

Suggested definition:

difference = 0

means Day 1.

difference = 1

means Day 2.

difference = 29

means Day 30.

Therefore:

Day 1 = difference 0
Day 2 = difference 1
...
Day 30 = difference 29


--------------------------------------------------
12.2 STAGES
--------------------------------------------------

Stage 1:

Day 0/1

Visual concept:

SEED

The flower begins as a seed planted in soil.


Stage 2:

Days 1–3

Visual:

SPROUT

A small green shoot emerges.


Stage 3:

Days 4–7

Visual:

YOUNG PLANT

Small leaves and a stronger stem.


Stage 4:

Days 8–14

Visual:

GROWING PLANT

Larger plant with additional leaves.


Stage 5:

Days 15–21

Visual:

BUD

A visible flower bud appears.


Stage 6:

Days 22–29

Visual:

PRE-BLOOM

The bud becomes larger and begins showing flower color.


Stage 7:

Day 30

Visual:

BLOOM

The flower opens.


Stage 8:

After Day 30

Visual:

MATURE FLOWER / GARDEN

The flower remains alive and mature.


==================================================
13. FLOWER MUST NEVER PERMANENTLY DIE
==================================================

Critical requirement.

There is NO permanent DEAD state.

The flower may become:

HEALTHY

THIRSTY

WILTING

REVIVING

But never permanently dead.


==================================================
14. HEALTH SYSTEM
==================================================

Health is determined server-side.

Suggested states:

HEALTHY

THIRSTY

WILTING

REVIVING


--------------------------------------------------
14.1 HEALTHY
--------------------------------------------------

Flower has received recent care.

Visual:

healthy leaves
upright stem
bright flower


--------------------------------------------------
14.2 THIRSTY
--------------------------------------------------

The recipient has missed enough care that the flower should communicate that it needs attention.

Visual:

slightly drooping leaves
subtle dry appearance


--------------------------------------------------
14.3 WILTING
--------------------------------------------------

After a longer period without care.

Visual:

more noticeable drooping
slightly faded appearance

The flower is still alive.


--------------------------------------------------
14.4 REVIVING
--------------------------------------------------

When the recipient returns after neglect and performs care.

Visual:

subtle recovery animation.

After sufficient care it returns to HEALTHY.


==================================================
15. MISSED DAYS
==================================================

Missing days can affect:

- streak
- health
- visual state

Missing days must NOT:

- permanently kill flower
- erase growth
- erase XP
- erase rewards
- restart the flower from Day 1


==================================================
16. CARE ACTIONS
==================================================

There are three care actions.

### WATER

Required primary care action.

Icon:

💧

XP:

+10


### SUNLIGHT

Optional.

Icon:

☀️

XP:

+5


### LOVE

Optional.

Icon:

❤️

XP:

+5


==================================================
17. DAILY XP
==================================================

Daily XP:

Water:

+10

Sunlight:

+5

Love:

+5

Daily visit:

+5

Maximum XP per calendar day:

20 XP


--------------------------------------------------
17.1 XP RULES
--------------------------------------------------

The server determines XP.

The client cannot submit arbitrary XP.

If water is performed:

+10

If sunlight is performed:

+5

If love is performed:

+5

A valid daily visit:

+5

Total cannot exceed:

20 XP/day.


==================================================
18. DUPLICATE CARE PROTECTION
==================================================

A care action may only award XP once per calendar day.

Example:

User waters at 9:00 AM.

Award:

+10 XP

User presses Water again at 9:01 AM.

Result:

No additional +10 XP.

The UI should communicate that the action has already been completed today.

Database uniqueness should enforce this at the database level.

Do not rely only on client-side button disabling.


==================================================
19. STREAK SYSTEM
==================================================

A care streak counts consecutive calendar days where the recipient performed at least one valid care action.

Example:

Day 1 care

Day 2 care

Day 3 care

Day 4 care

Day 5 care

Day 6 care

Day 7 care

Result:

🔥 7 Day Care Streak


If a day is missed:

The streak resets.

Example:

Day 1 care
Day 2 care
Day 3 care
Day 4 missed
Day 5 care

New streak:

1


The streak reset must NOT affect:

- growth
- XP already earned
- rewards already unlocked


==================================================
20. DAILY VISIT
==================================================

A valid visit may award:

+5 XP

However, total daily XP must never exceed 20.

Avoid implementing a system that allows unlimited refreshes to earn XP.

A visit should be counted at most once per calendar day.


==================================================
21. REWARDS
==================================================

Rewards are milestone-based.

Required MVP rewards:

Day 3:

"First Steps"


Day 7:

"One Week Together"


Day 14:

"First Bud"


Day 21:

"Almost There"


Day 30:

"First Bloom"


Future-ready rewards:

Day 60

Day 100


Rewards must be stored persistently.

The same reward must never unlock repeatedly.


--------------------------------------------------
21.1 REWARD PRESENTATION
--------------------------------------------------

Rewards should appear gently.

Examples:

"🌱 First Steps"

"You helped your flower take its first steps."


"🌿 One Week Together"

"Seven days of caring."


"🌸 First Bloom"

"Thirty days together."


Do not make the application feel like a competitive game.


==================================================
22. DAY 30 BLOOM EXPERIENCE
==================================================

Day 30 is the emotional climax.

The transition should be visually meaningful.

Suggested sequence:

1. Show mature bud.
2. Slight pause.
3. Bud begins opening.
4. Petals gradually unfold.
5. Flower becomes fully open.
6. Subtle particles or light effects appear.
7. Personalized bloom message appears.

Example:

"You helped Sunny grow for 30 days."

Then show the custom bloom message.

Example:

"Some things become more beautiful simply because we chose to care for them."

If the giver supplied a giver name, optionally show:

"With love, Alex"


--------------------------------------------------
22.1 BLOOM MESSAGE
--------------------------------------------------

The bloom message comes from the giver.

Do not generate it with AI.

Do not rewrite it automatically.

Preserve the giver's message while safely rendering it.


==================================================
23. POST-BLOOM MODE
==================================================

After Day 30:

The flower remains alive.

The application should not display:

"Game Over"

"Finished"

"Dead"

Instead:

The flower enters mature mode.

Possible messaging:

"Your flower is blooming."

"The garden is still growing."

The MVP may simply keep the full flower visible.


==================================================
24. VISUAL FLOWER IMPLEMENTATION
==================================================

The MVP does NOT require 3D.

Preferred implementation:

- CSS
- SVG
- React
- lightweight animations

The flower can be constructed using:

- SVG stems
- SVG leaves
- SVG petals
- CSS transitions
- CSS transforms
- subtle particles

Each growth stage should have a visually distinct state.

Do not use generic emoji as the primary flower rendering.

Emoji may be used for care-action icons.


==================================================
25. ANIMATION
==================================================

Animations should be:

- subtle
- smooth
- emotionally pleasant
- performant on mobile

Use:

- opacity
- transform
- scale
- rotation
- gentle floating
- petal opening

Avoid:

- excessive particle effects
- heavy WebGL
- expensive canvas effects
- large animation libraries unless necessary


==================================================
26. REDUCED MOTION
==================================================

Respect:

prefers-reduced-motion

If reduced motion is enabled:

- disable large transitions
- disable excessive particles
- reduce movement
- preserve state changes
- keep the experience understandable


==================================================
27. RECIPIENT PAGE
==================================================

Suggested structure:

--------------------------------------------------
Recipient greeting
--------------------------------------------------

"Maria's Flower"

or

"A flower for Maria"


--------------------------------------------------
Flower
--------------------------------------------------

Large central visual flower.


--------------------------------------------------
Flower information
--------------------------------------------------

Sunny

Day 12

Growing Plant


--------------------------------------------------
Personal message
--------------------------------------------------

"Every day, I hope this little flower reminds you..."


--------------------------------------------------
Progress
--------------------------------------------------

Day 12 of 30

[progress indicator]


--------------------------------------------------
Care actions
--------------------------------------------------

💧 Water

☀️ Sunshine

❤️ Love


--------------------------------------------------
Stats
--------------------------------------------------

🔥 7 Day Care Streak

XP: 120


--------------------------------------------------
Rewards
--------------------------------------------------

Unlocked milestones.


==================================================
28. CARE UI
==================================================

Water must be the primary action.

The button should be visually prominent.

Example:

[ 💧 Water ]

Secondary actions:

[ ☀️ Sunshine ]

[ ❤️ Love ]


After watering:

Button can become:

"Watered today"

Do not permanently disable the action without explaining why.

Allow the recipient to see that the action is already completed.


==================================================
29. CARE FEEDBACK
==================================================

After successful care:

show immediate feedback.

Example:

"+10 XP"

"Sunny looks happier."

For sunlight:

"+5 XP"

"Sunny enjoyed the sunshine."

For love:

"+5 XP"

"Sunny felt the love."


Keep feedback short.


==================================================
30. PRIVATE GIFT PAGE
==================================================

The recipient page is accessed through:

/g/[token]


The token is the authorization mechanism for viewing the gift.

There is no recipient login requirement for MVP.


==================================================
31. PRIVACY
==================================================

Gift links are private.

Do not expose gift contents publicly.

Do not include:

- recipient names
- personal messages
- bloom messages

in public search metadata.


==================================================
32. SEO
==================================================

Gift pages should be:

noindex

The application should not allow private gift pages to become publicly searchable.

Landing page may be indexable.

Create pages may be indexable or noindex depending on implementation.

Gift pages must specifically be noindex.


==================================================
33. SECURITY
==================================================

Security requirements:

### Input validation

Use Zod or equivalent validation.

Validate:

- flower type
- flower name
- recipient name
- giver name
- personal message
- bloom message
- start date
- care type


### Output escaping

Never use:

dangerouslySetInnerHTML

for user-provided content unless absolutely necessary and safely sanitized.

Prefer normal React text rendering.


### Server secrets

Never expose:

- Supabase service role key
- database credentials
- private API keys
- internal secrets

to browser/client code.


### Public endpoints

Rate-limit where practical.

The public gift URL should not allow arbitrary database manipulation.


### Server authority

Never accept from the client:

xp
health
streak
growthStage
rewardUnlocked


Calculate these on the server.


==================================================
34. API
==================================================

Suggested endpoints.


--------------------------------------------------
GET /api/gifts/[token]
--------------------------------------------------

Returns safe gift information.

Should include calculated:

- flower data
- current day
- stage
- health
- XP
- streak
- rewards
- today's care status

Do not expose:

- internal secrets
- database credentials
- unnecessary internal fields


--------------------------------------------------
POST /api/gifts
--------------------------------------------------

Creates a gift.

Request:

{
  "flowerType": "rose",
  "flowerName": "Sunny",
  "recipientName": "Maria",
  "giverName": "Alex",
  "personalMessage": "...",
  "bloomMessage": "...",
  "startDate": "2026-09-13"
}

Server generates:

- ID
- public token
- timestamps


--------------------------------------------------
POST /api/gifts/[token]/care
--------------------------------------------------

Request:

{
  "type": "water"
}

or:

{
  "type": "sunlight"
}

or:

{
  "type": "love"
}


The server:

1. validates token
2. validates care type
3. determines current calendar date
4. checks duplicate care
5. calculates XP
6. stores care event
7. recalculates streak
8. recalculates health
9. checks rewards
10. returns updated state


==================================================
35. TIMEZONE
==================================================

Time calculations are important.

Store timestamps in UTC where appropriate.

Calendar-based logic must use a clearly defined timezone.

The system must correctly support Asia/Manila.

Do not use raw 24-hour elapsed time for daily streak calculations.

A calendar day should be treated as a calendar day in the relevant user/gift timezone.

The architecture should allow future timezone support.

For MVP, a sensible approach is to associate the gift with a timezone at creation or use the recipient/client timezone carefully, while ensuring server calculations remain authoritative.

Do not allow the client to arbitrarily manipulate the server's date.


==================================================
36. START DATE
==================================================

The start date determines Day 1.

Example:

Start date:

September 13

September 13:

Day 1

September 14:

Day 2

...

October 12:

Day 30


The implementation must be consistent everywhere.


==================================================
37. FUTURE START DATES
==================================================

If a gift has a start date in the future:

The recipient should not see an already-grown flower.

Display an appropriate state such as:

"Your flower is waiting to be planted."

Countdown or exact future messaging may be implemented.

Do not allow negative growth stages.


==================================================
38. INVALID TOKENS
==================================================

If a gift token does not exist:

Return a friendly not-found page.

Do not expose database details.

Example:

"This flower could not be found."

Do not say:

"Supabase record 404"

or expose internal IDs.


==================================================
39. ERROR HANDLING
==================================================

The application must have friendly:

- loading states
- error states
- empty states
- not-found states
- validation errors
- network errors

Do not expose stack traces to users.


==================================================
40. ACCESSIBILITY
==================================================

Requirements:

- semantic HTML
- labels for form inputs
- keyboard accessibility
- visible focus states
- sufficient contrast
- touch targets around 44px or larger
- descriptive button labels
- screen-reader-friendly status messages
- reduced-motion support

Do not make care actions accessible only through color.


==================================================
41. RESPONSIVE DESIGN
==================================================

Test at:

360x800
375x812
390x844
412x915

Also test:

768px+
1024px+

The flower must remain visually prominent without causing horizontal scrolling.


==================================================
42. WEB SHARE
==================================================

After creating a gift:

If Web Share API is available:

navigator.share()

may be used.

Suggested share text:

"I made a flower for you 🌸"

The gift URL should be shared.

If Web Share is unavailable:

provide:

"Copy link"

button.

Never require Web Share.


==================================================
43. QR CODE
==================================================

QR code is optional.

If implemented:

- it should encode only the private gift URL
- it should not expose internal IDs
- it should work on mobile
- it should have sufficient contrast

Do not make QR functionality more important than the link.


==================================================
44. NOTIFICATIONS
==================================================

Notifications are optional and should NOT block MVP completion.

If implemented:

Maximum:

one routine reminder per day.

Possible messages:

"🌱 Sunny is waiting for you."

"💧 I think I'm a little thirsty today."

"☀️ Can we have some sunshine?"

"🌸 Something is changing..."


Only send routine reminders when care has not been completed for the day.

Do not spam users.


==================================================
45. PWA
==================================================

PWA support is optional but desirable.

If implemented:

- manifest
- icons
- installability
- mobile-friendly metadata

However:

The recipient must NEVER be required to install the app.

The normal browser link must work.


==================================================
46. NO ACCOUNT REQUIREMENT
==================================================

MVP must not require:

- Google login
- Apple login
- email signup
- password
- social account

The giver can create a gift directly.

The recipient can open the gift directly.


==================================================
47. NO AI
==================================================

Do NOT add AI features.

Specifically:

Do not implement:

- AI-generated flower
- AI-generated message
- AI-generated bloom message
- AI chatbot
- AI recommendations

The giver writes the messages.


==================================================
48. NO SOCIAL FEATURES
==================================================

Do not implement:

- followers
- friends
- comments
- public profiles
- likes
- public gardens
- leaderboards
- social feed


==================================================
49. NO PAYMENTS
==================================================

MVP must not include:

- Stripe
- subscriptions
- checkout
- donations
- premium tiers


==================================================
50. NO ADS
==================================================

Do not add advertising.

The experience should remain clean.


==================================================
51. NO BLOCKCHAIN
==================================================

Do not implement:

- NFTs
- cryptocurrency
- blockchain
- wallets


==================================================
52. NO 3D / AR / VR
==================================================

Do not over-engineer the flower.

MVP should use:

SVG/CSS/React.

Do not build:

- 3D flower engine
- AR
- VR
- WebGL flower simulation


==================================================
53. FLOWER STATE ENGINE
==================================================

Create centralized deterministic business logic.

Example conceptual API:

getFlowerDay(startDate, currentDate)

getGrowthStage(day)

getHealth(lastCareDate, currentDate)

calculateDailyXp(careEvents)

calculateStreak(careDates)

getUnlockedRewards(day)

getFlowerState(...)


Do not scatter growth rules across React components.


==================================================
54. PURE BUSINESS LOGIC
==================================================

Where possible, business logic should be implemented as pure functions.

Examples:

calculateFlowerDay()
getGrowthStage()
calculateXp()
calculateStreak()
getHealthState()
getRewards()


This makes the system easy to test.


==================================================
55. TESTING REQUIREMENTS
==================================================

Implement tests for core logic.

At minimum:

### Growth

Test:

Day 1
Day 3
Day 4
Day 7
Day 8
Day 14
Day 15
Day 21
Day 22
Day 29
Day 30
Day 31


### XP

Test:

water = 10
sunlight = 5
love = 5

Maximum daily XP = 20.


### Duplicate care

Same care type twice on same day:

Only one reward.


### Streak

Consecutive days.

Missing day.

Re-start after missing day.


### Missed care

Health changes.

Growth does not reset.


### Revival

Wilting flower receiving care should move toward healthy/reviving.


### Rewards

Day 3.

Day 7.

Day 14.

Day 21.

Day 30.


### Token

Tokens are:

- random
- unique
- URL safe

### Invalid token

Returns proper not-found behavior.


### Validation

Invalid:

empty name
oversized message
invalid flower type
invalid care type
invalid date


### Timezone

Test calendar boundaries.

Especially:

Asia/Manila.


==================================================
56. DATABASE TESTING
==================================================

Ensure uniqueness prevents duplicate:

(gift_id, care_date, care_type)

Test concurrent duplicate submissions if practical.

The server should remain correct even if two requests arrive nearly simultaneously.


==================================================
57. RATE LIMITING
==================================================

Public endpoints should have reasonable abuse protection.

At minimum consider rate limiting:

- gift creation
- care submission
- token lookup

Do not introduce an unnecessarily complex infrastructure system for MVP.

If Vercel/serverless constraints make a particular limiter inappropriate, use a simple architecture compatible with the chosen database/runtime.


==================================================
58. SERVER AUTHORITY
==================================================

Critical rule:

The browser is never the source of truth for game state.

The server/database determines:

- day
- growth
- health
- XP
- streak
- rewards
- care completion

The browser renders server state.


==================================================
59. DATA CONSISTENCY
==================================================

When a care action occurs:

Prefer transactional or safely ordered server operations.

Sequence:

validate
→ identify gift
→ determine date
→ check duplicate
→ insert event
→ calculate state
→ unlock reward if necessary
→ return state


If the operation fails:

Do not partially award XP.


==================================================
60. UI STATE AFTER CARE
==================================================

After care submission:

Immediately update the displayed state.

Show:

- action confirmation
- XP earned
- updated XP
- updated streak
- updated health
- updated reward status if applicable

Avoid requiring a full page refresh.


==================================================
61. GIFT CREATION RESULT
==================================================

After successful creation:

Show:

"Your flower is ready 🌸"

Then:

private URL

Buttons:

"Copy Link"

"Share"

Optional:

"Show QR"


Also show:

"Keep this link private."


==================================================
62. PRIVATE LINK WARNING
==================================================

Because the URL grants access to the gift, explain:

"This link is private. Anyone who has it can view and care for this flower."

Do not make the warning scary.

Keep it concise.


==================================================
63. GIVER EXPERIENCE
==================================================

The giver should feel that they are creating a meaningful gift.

Suggested progression:

Choose a flower
→ Name it
→ Choose recipient
→ Write message
→ Write bloom message
→ Preview
→ Create
→ Share


Avoid making the creation form feel like an administrative database form.


==================================================
64. RECIPIENT EXPERIENCE
==================================================

The recipient should feel:

"I received something made specifically for me."

The page should prioritize:

1. personalization
2. flower
3. care action
4. progress
5. message
6. rewards


==================================================
65. DESIGN SYSTEM
==================================================

Use a restrained visual system.

Suggested characteristics:

- soft background
- warm neutrals
- natural greens
- flower colors based on selected flower
- rounded cards
- subtle shadows
- generous spacing
- large readable typography

Do not use a generic startup template.


==================================================
66. TYPOGRAPHY
==================================================

Typography should be:

- readable
- warm
- modern
- accessible

Avoid overly decorative fonts for body text.

A subtle display font may be used for flower/gift titles if it remains readable.


==================================================
67. COLOR
==================================================

Use colors that support:

- soil
- leaves
- flowers
- warmth
- sunlight

Avoid excessively saturated UI colors.

Flower-specific accents may change based on selected flower.


==================================================
68. LOADING EXPERIENCE
==================================================

Loading states should preserve the visual character.

Avoid a generic blank white screen.

Possible:

subtle flower/seed loading animation.

But keep it lightweight.


==================================================
69. EMPTY / FUTURE STATE
==================================================

If the flower has not started yet:

Show seed state.

Example:

"Your flower will be planted soon."


==================================================
70. DATA PRIVACY
==================================================

Do not log personal messages unnecessarily.

Do not put message contents into analytics.

Do not put personal gift content into server logs.

Do not expose gift data in errors.


==================================================
71. LOGGING
==================================================

Server logs may contain:

- request status
- generic errors
- timing
- non-sensitive identifiers where appropriate

Do not log:

- private messages
- bloom messages
- full gift tokens
- database secrets


==================================================
72. ENVIRONMENT VARIABLES
==================================================

Expected environment variables may include:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

and/or server-only:

SUPABASE_SERVICE_ROLE_KEY

Exact names may be chosen consistently.

Never expose service role credentials to the client.

Provide:

.env.example


==================================================
73. SUPABASE
==================================================

Use Supabase PostgreSQL as the preferred persistent database.

Create migration files.

Do not rely on manually creating tables in the dashboard without migration files.

The repository should contain reproducible database schema/migration information.


==================================================
74. DATABASE SECURITY
==================================================

If Supabase Row Level Security is used:

Design policies carefully.

Do not accidentally expose all gifts publicly.

Server-side service-role access may be used for controlled server operations, but credentials must remain server-only.


==================================================
75. URL STRUCTURE
==================================================

Recommended:

/

Landing

/create

Gift creation

/preview

Preview

/g/[token]

Recipient gift


Potential future:

/g/[token]/...

Avoid unnecessary routes.


==================================================
76. METADATA
==================================================

Landing page may have normal SEO metadata.

Gift pages:

robots:

noindex

Do not put private message content into:

- title
- description
- Open Graph metadata
- Twitter metadata


==================================================
77. OPEN GRAPH
==================================================

Gift pages should NOT generate public metadata containing private content.

If an Open Graph image is implemented, do not leak the personal message.

For MVP it is acceptable to use generic metadata or no custom OG image for private pages.


==================================================
78. MOBILE PERFORMANCE
==================================================

The application must be fast on mobile devices.

Avoid:

- huge images
- unnecessary JavaScript
- huge libraries
- heavy animation engines
- unnecessary API calls

Flower visuals should be lightweight.


==================================================
79. OFFLINE / NETWORK FAILURE
==================================================

The recipient should receive a friendly message when network operations fail.

For example:

"Couldn't water your flower right now. Please try again."

Do not falsely show successful care when the server rejected the operation.


==================================================
80. IDEMPOTENCY
==================================================

Care operations must behave safely under:

- double taps
- network retries
- duplicate requests
- browser refreshes

Database constraints should provide an additional safety layer.


==================================================
81. CLIENT CACHING
==================================================

Do not allow stale client state to become authoritative.

After mutations:

refresh/revalidate server state appropriately.

Private gift data should not be accidentally cached publicly.


==================================================
82. NEXT.JS CACHING
==================================================

Be careful with Next.js caching.

Private gift pages should not accidentally be statically shared between different tokens.

Use appropriate dynamic rendering/cache settings.

Do not cache private gift data publicly.


==================================================
83. SECURITY REVIEW
==================================================

Before declaring the project complete, inspect for:

- exposed secrets
- predictable tokens
- SQL injection risk
- XSS
- unsafe HTML rendering
- missing validation
- unauthorized mutations
- excessive data exposure
- public caching of private pages
- duplicate care race conditions


==================================================
84. TEST COMMANDS
==================================================

The project should provide working scripts such as:

npm run dev

npm run build

npm run lint

npm run typecheck

npm run test


If the exact commands differ, document them in README.


==================================================
85. README
==================================================

Create a comprehensive README containing:

1. Project overview
2. Features
3. Architecture
4. Local setup
5. Environment variables
6. Supabase setup
7. Database migration instructions
8. Development commands
9. Testing
10. Production build
11. Vercel deployment
12. Security notes
13. Project structure


==================================================
86. VERCEL DEPLOYMENT
==================================================

The application should be Vercel-compatible.

Deployment requirements should include:

- project configuration
- environment variables
- Supabase URL
- Supabase keys
- production database configuration

Do not hardcode credentials.

The project must successfully run:

npm run build


before declaring it deployment-ready.


==================================================
87. VERCEL HOBBY COMPATIBILITY
==================================================

Prefer architecture compatible with Vercel Hobby/free-tier constraints.

Avoid unnecessary long-running servers.

Use serverless-compatible Next.js APIs.

Avoid requiring a permanent Node.js process.


==================================================
88. NO UNNECESSARY INFRASTRUCTURE
==================================================

Do not add:

- Redis unless truly required
- Kafka
- queues
- microservices
- Docker requirement
- Kubernetes
- separate backend server

The application should remain simple.


==================================================
89. ANALYTICS
==================================================

Analytics are optional.

If analytics are added:

Do not collect private message contents.

Do not collect unnecessary personal information.

MVP may omit analytics entirely.


==================================================
90. FLOWER TYPES
==================================================

The MVP may begin with a small number of flowers.

Recommended:

rose
sunflower
tulip
daisy
lavender

Each should have a recognizable visual identity.

Do not implement dozens of flower types before the core experience works.


==================================================
91. FLOWER CONFIGURATION
==================================================

Flower definitions should be centralized.

Example conceptual structure:

{
  id,
  name,
  colors,
  visual configuration
}

Growth-stage rendering should be reusable.


==================================================
92. FLOWER RENDERING ARCHITECTURE
==================================================

Prefer:

Flower component

with:

SeedStage
SproutStage
YoungPlantStage
GrowingPlantStage
BudStage
PreBloomStage
BloomStage
MatureStage


Or a similarly maintainable architecture.

Avoid one enormous component containing all visuals and logic.


==================================================
93. HEALTH VISUAL MODIFIERS
==================================================

Health should affect visual presentation.

Example:

HEALTHY:
normal leaves

THIRSTY:
slightly drooping

WILTING:
more drooping

REVIVING:
subtle upward movement/recovery

The growth stage and health state are separate concepts.

Example:

Day 18 + HEALTHY = healthy bud.

Day 18 + WILTING = wilting bud.

Do not confuse growth stage with health.


==================================================
94. GROWTH MUST BE MONOTONIC
==================================================

Growth stage should never go backward because of missed care.

Example:

Day 20 = Bud.

Even if user disappears for 20 days:

Day 40 = Mature Flower.

The flower does NOT return to seed.

Health can change.

Growth cannot reverse.


==================================================
95. XP MUST BE MONOTONIC
==================================================

Earned XP should never decrease.

Missing days do not remove XP.


==================================================
96. REWARDS MUST BE MONOTONIC
==================================================

Unlocked rewards remain unlocked.

Missing care cannot remove a reward.


==================================================
97. STREAK IS THE EXCEPTION
==================================================

Streak may reset.

That is intentional.

Only streak resets.

Growth, XP, and rewards remain.


==================================================
98. DAILY CARE RULE
==================================================

At least one valid care action makes the day a care day.

Example:

User only presses Love.

That day counts toward streak.

User does not need to perform all three actions.


==================================================
99. DAILY XP CAP
==================================================

The system must enforce:

maximum 20 XP/day.

Examples:

Water:

10

Sunlight:

5

Love:

5

Total:

20


Water + sunlight:

15


Water + love:

15


Sunlight + love:

10


All three:

20


Visit only:

5


==================================================
100. VISIT XP
==================================================

If implementing visit XP:

Only award +5 once per calendar day.

Do not award +5 every page reload.

Use a persistent mechanism such as a daily event record or equivalent.


==================================================
101. CARE EVENT TYPES
==================================================

Allowed values:

water
sunlight
love

Do not accept arbitrary strings.


==================================================
102. ERROR MESSAGES
==================================================

Use friendly errors.

Examples:

"Please choose a flower."

"Please enter a flower name."

"Please enter the recipient's name."

"Your message is too long."

"This flower could not be found."

"This action has already been completed today."

"We couldn't save that right now. Please try again."


==================================================
103. SECURITY ERROR MESSAGES
==================================================

Do not expose:

- SQL errors
- stack traces
- internal IDs
- database provider details
- service configuration


==================================================
104. FORM UX
==================================================

The creation form should be divided into logical sections if helpful.

Example:

ABOUT THE FLOWER

Flower type
Flower name


FOR SOMEONE SPECIAL

Recipient name
Giver name


YOUR MESSAGE

Personal message
Bloom message


WHEN SHOULD IT BEGIN?

Start date


Then:

Preview

Create Flower


==================================================
105. VALIDATION UX
==================================================

Validate both:

client-side

and

server-side.

Client-side validation improves UX.

Server-side validation provides security.

Never rely only on client-side validation.


==================================================
106. CHARACTER LIMITS
==================================================

Suggested:

Flower name:
50

Recipient:
80

Giver:
80

Personal message:
500

Bloom message:
500


The UI should show useful counters if appropriate.


==================================================
107. TEXT RENDERING
==================================================

Preserve line breaks where useful.

But do not render raw HTML from user input.

Use safe text rendering.


==================================================
108. GIFT ACCESS
==================================================

Anyone possessing the private URL can potentially access the gift.

This is intentional.

The URL is effectively the gift's private key.

Therefore:

token entropy is important.


==================================================
109. TOKEN STORAGE
==================================================

Store the token securely.

Prefer sufficiently long random tokens.

Index the token for lookup performance.


==================================================
110. TOKEN ENUMERATION
==================================================

The application must make enumeration impractical.

Never use:

1
2
3
4

as public gift identifiers.


==================================================
111. TOKEN RATE LIMITING
==================================================

Gift lookup should have reasonable protection against automated enumeration.

Rate limiting may be IP-based or otherwise appropriate to the deployment architecture.


==================================================
112. CREATE RATE LIMITING
==================================================

Gift creation should have basic abuse protection.

Do not allow trivial unlimited automated gift creation if it can be avoided without making the MVP overly complex.


==================================================
113. CARE RATE LIMITING
==================================================

Care endpoints should also have reasonable protection.

Database uniqueness remains the authoritative duplicate defense.


==================================================
114. SERVER TIME
==================================================

Business logic must use a trustworthy server-side time source.

Do not trust arbitrary client timestamps for XP/streak/growth.


==================================================
115. DATE BOUNDARIES
==================================================

Carefully test transitions around:

23:59
00:00

especially for:

Asia/Manila.


==================================================
116. FUTURE ARCHITECTURE
==================================================

The architecture should make future features possible without implementing them now.

Potential future:

- Day 60
- Day 100
- multiple flowers
- garden mode
- recipient timezone preference
- notifications
- flower themes
- gift history for authenticated givers

But do not implement these prematurely.


==================================================
117. WHAT NOT TO BUILD
==================================================

Do NOT build:

- user accounts
- login
- social feed
- chat
- comments
- likes
- followers
- payments
- subscriptions
- ads
- AI
- NFTs
- blockchain
- 3D
- AR
- VR
- multiplayer
- public flower directory
- leaderboard
- complex admin dashboard


==================================================
118. MVP PRIORITY
==================================================

Priority order:

P0:

Gift creation

Private token

Recipient page

Flower growth

Watering

Database persistence

P1:

Sunlight

Love

XP

Streak

Health

P2:

Rewards

Day-30 bloom

P3:

Share

PWA

Notifications

QR


If time is limited:

Finish P0 and P1 completely before optional P3 features.


==================================================
119. IMPLEMENTATION ORDER
==================================================

Recommended development order:

STEP 1

Initialize Next.js + TypeScript.


STEP 2

Configure styling.


STEP 3

Create environment configuration.


STEP 4

Create database schema/migrations.


STEP 5

Create flower business logic.


STEP 6

Create care business logic.


STEP 7

Create reward logic.


STEP 8

Create secure token generation.


STEP 9

Create gift creation API.


STEP 10

Create gift retrieval API.


STEP 11

Create care API.


STEP 12

Build landing page.


STEP 13

Build creation form.


STEP 14

Build preview.


STEP 15

Build recipient page.


STEP 16

Build flower visuals.


STEP 17

Build care interactions.


STEP 18

Build rewards.


STEP 19

Build bloom experience.


STEP 20

Add responsive/accessibility improvements.


STEP 21

Add tests.


STEP 22

Run:

typecheck
lint
test
build


STEP 23

Review security.


STEP 24

Fix issues.


STEP 25

Run everything again.


==================================================
120. DEVELOPMENT LOOP
==================================================

Follow:

IMPLEMENT
→ TYPECHECK
→ LINT
→ TEST
→ INSPECT
→ FIX
→ RETEST


Never declare completion simply because the application starts.


==================================================
121. QUALITY STANDARD
==================================================

The project should feel like a real polished product, not a demo.

Requirements:

- clean code
- typed code
- reusable components
- centralized business logic
- reliable database operations
- safe validation
- good mobile UX
- accessible controls
- meaningful animations
- friendly errors
- good documentation


==================================================
122. DO NOT OVERBUILD
==================================================

The goal is emotional simplicity.

If a feature does not contribute to:

RECEIVE
CARE
RETURN
GROW
WAIT
BLOOM

it probably does not belong in the MVP.


==================================================
123. ACCEPTANCE TEST — GIVER
==================================================

A user must be able to:

1. Open landing page.
2. Click Create Flower.
3. Choose a flower.
4. Enter flower name.
5. Enter recipient.
6. Enter personal message.
7. Enter bloom message.
8. Optionally enter giver name.
9. Choose start date.
10. Preview.
11. Create.
12. Receive private URL.
13. Copy/share URL.


==================================================
124. ACCEPTANCE TEST — RECIPIENT
==================================================

A recipient must be able to:

1. Open private URL.
2. See personalized flower.
3. See current growth stage.
4. Read personal message.
5. Water flower.
6. Receive XP.
7. See updated state.
8. Return on another day.
9. Continue growth.
10. Build streak.
11. Unlock milestones.
12. Reach Day 30.
13. Experience bloom.
14. See personalized bloom message.


==================================================
125. ACCEPTANCE TEST — MISSED DAYS
==================================================

Simulate:

several consecutive care days

then several missed days.

Expected:

- streak resets
- health worsens
- growth continues
- XP remains
- rewards remain
- flower remains alive

Then care again.

Expected:

- flower begins recovery
- health improves
- streak starts again


==================================================
126. ACCEPTANCE TEST — DUPLICATE CARE
==================================================

Water twice on same day.

Expected:

First:

+10 XP

Second:

0 additional XP

No duplicate care event.

No duplicate reward.


==================================================
127. ACCEPTANCE TEST — XP CAP
==================================================

Perform:

water
sunlight
love
visit

Expected:

maximum daily XP:

20

Never exceed 20.


==================================================
128. ACCEPTANCE TEST — GROWTH
==================================================

Verify:

Day 1 = Seed/Sprout beginning

Day 3 = Sprout

Day 4 = Young Plant

Day 7 = Young Plant

Day 8 = Growing Plant

Day 14 = Growing Plant

Day 15 = Bud

Day 21 = Bud

Day 22 = Pre-Bloom

Day 29 = Pre-Bloom

Day 30 = Bloom

Day 31 = Mature


The exact visual boundary may be refined, but the business logic must be deterministic and consistent.


==================================================
129. ACCEPTANCE TEST — PRIVATE LINK
==================================================

Create at least multiple gifts.

Verify:

tokens are different.

Verify:

tokens are not sequential.

Verify:

token is URL-safe.

Verify:

invalid token returns not-found.

Verify:

private page is noindex.


==================================================
130. ACCEPTANCE TEST — SECURITY
==================================================

Inspect application for:

- exposed secrets
- unsafe HTML
- predictable tokens
- unauthorized state modification
- private data leakage
- client-authoritative XP
- client-authoritative growth
- public caching of private pages


==================================================
131. ACCEPTANCE TEST — RESPONSIVE
==================================================

Verify at:

360px
375px
390px
412px

No:

- horizontal scrolling
- clipped buttons
- inaccessible controls
- overlapping text
- broken flower visuals


==================================================
132. ACCEPTANCE TEST — ACCESSIBILITY
==================================================

Verify:

- labels
- keyboard navigation
- focus
- semantic controls
- accessible status messages
- reduced motion


==================================================
133. BUILD ACCEPTANCE
==================================================

Before completion:

npm run typecheck

must pass.

npm run lint

must pass.

npm run test

must pass.

npm run build

must pass.


If scripts have different names, document the correct commands.


==================================================
134. FINAL CODE REVIEW
==================================================

After implementation, inspect the entire project.

Look for:

- duplicated logic
- unused code
- unnecessary dependencies
- weak validation
- security problems
- inconsistent date logic
- incorrect growth boundaries
- duplicate care vulnerabilities
- UI inconsistencies
- mobile layout problems


==================================================
135. FINAL REPORT
==================================================

At the end of implementation, OpenCode must report:

### Project

Project path.

### Architecture

Framework and major architectural decisions.

### Files

Important files created.

### Database

Tables and migrations.

### APIs

All endpoints.

### Growth

Exact growth logic.

### Health

Health logic.

### Care

Water/sunlight/love behavior.

### XP

XP rules and cap.

### Streak

Streak logic.

### Rewards

Reward milestones.

### Bloom

Day-30 bloom implementation.

### Security

Token generation, validation, privacy, rate limiting.

### Tests

Tests executed and results.

### Build

Build result.

### Deployment

Vercel requirements.

### Remaining Issues

Anything incomplete.

### Commands

Exact commands to:

- install
- configure
- run locally
- test
- build
- deploy


==================================================
136. AGENT OPERATING RULES
==================================================

The coding agent must follow these rules.

RULE 1:

Inspect before changing.


RULE 2:

This is a new standalone Digital Flower Gift project.


RULE 3:

Never modify unrelated projects.


RULE 4:

Do not perform destructive commands such as:

rm -rf

unless absolutely necessary and explicitly justified.


RULE 5:

Do not silently replace an existing project.


RULE 6:

Do not invent missing requirements when the specification already defines them.


RULE 7:

When the specification leaves an implementation detail open, choose the simplest maintainable solution.


RULE 8:

Keep secrets out of source control.


RULE 9:

Run tests after significant changes.


RULE 10:

Do not stop at scaffolding.


RULE 11:

Do not declare success until production build succeeds.


RULE 12:

If a requirement cannot be completed, clearly report it rather than pretending it works.


==================================================
137. IMPORTANT IMPLEMENTATION DECISIONS
==================================================

The following decisions are authoritative.

1. Web application, not native Android app.

2. Mobile-first.

3. Vercel-compatible.

4. Supabase PostgreSQL preferred.

5. Private random token.

6. No recipient account.

7. No AI.

8. Flower never permanently dies.

9. Growth is calendar-based.

10. Growth does not reset after missed days.

11. XP does not decrease.

12. Rewards do not disappear.

13. Streak can reset.

14. Water is primary care action.

15. Daily XP maximum is 20.

16. Day 30 is the emotional bloom moment.

17. Bloom message is supplied by giver.

18. Gift pages are noindex.

19. Server is authoritative.

20. Client renders server state.


==================================================
138. DEFINITION OF DONE
==================================================

The project is DONE only when all of the following are true:

[ ] Landing page works.

[ ] Create form works.

[ ] Form validation works.

[ ] Preview works.

[ ] Gift creation works.

[ ] Secure random token works.

[ ] Private URL works.

[ ] Recipient page works.

[ ] Database persistence works.

[ ] Watering works.

[ ] Sunlight works.

[ ] Love works.

[ ] Duplicate care protection works.

[ ] XP works.

[ ] 20 XP daily cap works.

[ ] Daily visit handling works.

[ ] Streak works.

[ ] Missed-day streak reset works.

[ ] Growth stages work.

[ ] Growth never reverses.

[ ] Health states work.

[ ] Wilting works.

[ ] Revival works.

[ ] Rewards work.

[ ] Day-30 bloom works.

[ ] Personalized bloom message works.

[ ] Mature flower remains alive.

[ ] Private pages are noindex.

[ ] User content is safely rendered.

[ ] Secrets are protected.

[ ] Responsive mobile layout works.

[ ] Accessibility requirements are addressed.

[ ] Reduced-motion support works.

[ ] Loading states work.

[ ] Error states work.

[ ] Invalid token works.

[ ] Tests pass.

[ ] Typecheck passes.

[ ] Lint passes.

[ ] Production build passes.

[ ] README exists.

[ ] Vercel deployment requirements are documented.


==================================================
139. FINAL PRODUCT EXPERIENCE
==================================================

The finished product should communicate this idea:

Someone took a moment to create something for you.

You receive a flower.

You care for it.

You return tomorrow.

You watch it grow.

You wait.

And one day:

It blooms.

The product should feel less like a productivity application and more like a small digital keepsake.


==================================================
140. FINAL INSTRUCTION TO THE CODING AGENT
==================================================

Read this entire MASTER_SPEC.md before implementation.

Do not skip sections.

Treat this document as the source of truth.

Inspect the current directory first.

Because this is a new project, initialize the application here.

Implement the complete functional MVP.

Do not stop at scaffolding.

Do not modify unrelated projects.

Do not add unnecessary features.

Prioritize correctness of:

- private links
- database persistence
- calendar dates
- growth stages
- care events
- XP
- streak
- health
- rewards
- Day-30 bloom

Then build the polished mobile-first experience around those systems.

After implementation:

1. Typecheck.
2. Lint.
3. Test.
4. Build.
5. Inspect.
6. Fix.
7. Repeat the checks.
8. Review against this entire specification.
9. Produce the final implementation report.

The final application must be production-oriented, Vercel-compatible, secure, responsive, accessible, maintainable, and emotionally polished.

END OF MASTER SPECIFICATION