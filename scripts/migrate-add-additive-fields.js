/**
 * Non-destructive migration: add additive feature blocks to existing
 * `properties` docs. Existing fields are never modified.
 *
 * Adds: trustScore, aiInsights, futureGrowth, priceIntelligence,
 *       developer (null), documents, nearbyPlaces.
 *
 * Idempotent: only updates docs that don't already have `trustScore`.
 *
 * Flags:
 *   (no flag)                   → dry run, prints counts and a sample payload
 *   --apply                     → actually performs the bulk update
 *   --populate-nearby-places    → also transform existing `nearby.{schools,hospitals,metro,malls}`
 *                                  into `nearbyPlaces[]` (per placeSchema)
 *
 * Run from any directory with the `mongodb` package installed, e.g.
 *   /tmp/voidwalkers-mongo-test:
 *     node /path/to/Void_Walkers/scripts/migrate-add-additive-fields.js --apply
 *
 * Reads MONGODB_URI and MONGODB_DB from ../.env.local (no dotenv dep needed).
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// --- tiny .env.local loader (no extra deps) ---
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const APPLY = process.argv.includes('--apply');
const POPULATE_PLACES = process.argv.includes('--populate-nearby-places');

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'void_walkers';

if (!URI) {
  console.error('MONGODB_URI not set (expected in ../.env.local)');
  process.exit(1);
}

// --- additive payload template ---
function buildPayload(doc) {
  const payload = {
    trustScore: {
      aggregate: null,
      safety:         { score: null, factors: {} },
      infrastructure: { score: null, factors: {} },
      environment:    { score: null, factors: {} },
      investment:     { score: null, factors: {} },
      computedAt: null
    },
    aiInsights: {
      summary: null,
      investmentRecommendation: { verdict: null, confidence: null, reasoning: null },
      riskAssessment:           { level: null,   flags: [],        reasoning: null },
      rentalPotential: {
        monthlyEstimateInr: null,
        yieldPercent:       null,
        tenantDemand:       null,
        typicalTenantProfile: null
      },
      generatedAt: null,
      model: null
    },
    futureGrowth: {
      summaryScore: null,
      upcomingProjects: []
    },
    priceIntelligence: {
      history: [],
      comparables: [],
      areaAvgPerSqft: null
    },
    developer: null, // populated by developer-onboarding flow later
    documents: {
      rera: {
        number:     doc?.legal?.reraId || null,
        state:      null,
        status:     doc?.legal?.reraId ? 'registered' : null,
        verifiedAt: null,
        portalUrl:  null
      },
      items: []
    },
    nearbyPlaces: []
  };

  if (POPULATE_PLACES && doc?.nearby) {
    const places = [];
    const TYPE_MAP = {
      schools:   'school',
      hospitals: 'hospital',
      metro:     'metro',
      malls:     'mall',
      parks:     'park',
      gyms:      'gym',
      restaurants: 'restaurant'
    };
    for (const [bucket, items] of Object.entries(doc.nearby)) {
      if (!Array.isArray(items)) continue;
      const t = TYPE_MAP[bucket] || bucket;
      for (const item of items) {
        if (item && typeof item === 'object' && item.name) {
          const distance = typeof item.distanceKm === 'number' ? item.distanceKm : null;
          places.push({
            type: t,
            name: item.name,
            distance,
            travelTime: {
              // ~2.5 min/km in city traffic; null if distance unknown
              car: distance != null ? Math.round(distance * 2.5) : null
            }
          });
        }
      }
    }
    payload.nearbyPlaces = places;
  }

  return payload;
}

(async () => {
  const client = new MongoClient(URI);
  await client.connect();
  const coll = client.db(DB_NAME).collection('properties');

  const total = await coll.countDocuments();
  const missing = await coll.countDocuments({ trustScore: { $exists: false } });
  const alreadyMigrated = total - missing;

  console.log('=== migrate-add-additive-fields ===');
  console.log(`DB:               ${DB_NAME}`);
  console.log(`Collection:       properties`);
  console.log(`Total docs:       ${total}`);
  console.log(`Already migrated: ${alreadyMigrated}`);
  console.log(`Pending:          ${missing}`);
  console.log(`Apply:            ${APPLY}`);
  console.log(`Populate places:  ${POPULATE_PLACES}`);
  console.log('');

  if (missing === 0) {
    console.log('Nothing to do — all docs already have additive fields.');
    await client.close();
    return;
  }

  // Sample one doc and show payload that would be applied
  const sampleDoc = await coll.findOne({ trustScore: { $exists: false } }, { projection: { legal: 1, nearby: 1 } });
  console.log('Sample additive payload for one doc:');
  console.log(JSON.stringify(buildPayload(sampleDoc), null, 2));
  console.log('');

  if (!APPLY) {
    console.log('[DRY RUN] No changes made. Re-run with --apply to update.');
    await client.close();
    return;
  }

  console.log('Applying additive fields…');

  // Stream-friendly approach: cursor through pending docs, batched bulkWrite.
  const BATCH = 200;
  const cursor = coll.find({ trustScore: { $exists: false } }).project({ legal: 1, nearby: 1 });
  let buffer = [];
  let totalModified = 0;

  async function flush() {
    if (!buffer.length) return;
    const result = await coll.bulkWrite(buffer, { ordered: false });
    totalModified += result.modifiedCount || 0;
    buffer = [];
  }

  for await (const doc of cursor) {
    buffer.push({
      updateOne: {
        filter: { _id: doc._id, trustScore: { $exists: false } }, // re-check to avoid races
        update: { $set: buildPayload(doc) }
      }
    });
    if (buffer.length >= BATCH) await flush();
  }
  await flush();

  console.log(`Done. Modified ${totalModified} docs.`);
  await client.close();
})().catch(err => {
  console.error('Migration failed:', err);
  process.exit(2);
});
