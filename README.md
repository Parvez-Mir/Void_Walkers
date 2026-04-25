# GlobalGhar

Property intelligence for data-driven real estate search and recommendations.

## Property backend

Backend now includes a public property module under `backend/src` with:

- `GET /api/v1/properties`
- `GET /api/v1/properties/:identifier`
- `GET /api/v1/properties/search/bloom?q=2bhk+bopal+ambli`
- `GET /api/v1/properties/search/rich`
- `POST /api/v1/properties/search/ai`
- `GET /api/v1/properties/meta/filters`

Seed 1000 Ahmedabad-focused mock listings:

```bash
cd backend
npm run seed:properties -- --reset --count=1000
```

Optional AI env:

```bash
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4.1-mini
```

Frontend map:

Uses Leaflet with OpenStreetMap tiles on the property detail page. No API key is required for the current setup.
