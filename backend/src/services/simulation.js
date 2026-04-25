const personas = {
  professional: {
    priorities: ["office", "cafe", "airport", "metro"],
    weights: {
      office: 5,
      airport: 4,
      metro: 4,
      cafe: 3
    }
  },
  family: {
    priorities: ["school", "hospital", "park", "mall"],
    weights: {
      school: 5,
      hospital: 5,
      park: 4,
      mall: 3
    }
  },
  student: {
    priorities: ["college", "transport", "metro", "cafe"],
    weights: {
      college: 5,
      transport: 4,
      metro: 4,
      cafe: 3
    }
  }
};

function getAllNearbyPlaces(property) {
  // Case 1: flat structure (preferred)
  if (property.nearbyPlaces?.length) {
    return property.nearbyPlaces;
  }

  // Case 2: structured schema fallback
  const nearby = property.nearby || {};

  return [
    ...(nearby.schools || []),
    ...(nearby.hospitals || []),
    ...(nearby.metro || []),
    ...(nearby.malls || [])
  ];
}


function generateSimulation(property, persona) {
  const config = personas[persona] || personas.professional;
  const { priorities, weights } = config;

  const places = getAllNearbyPlaces(property);

  // Step 1: filter relevant places
  let relevantPlaces = places.filter(p =>
    priorities.includes(p.type)
  );

  // Step 2: sort by persona importance
  relevantPlaces.sort((a, b) => {
    const weightA = weights[a.type] || 1;
    const weightB = weights[b.type] || 1;
    return weightB - weightA;
  });

  // Step 3: summary (persona-aware)
  const summary = relevantPlaces.map(p => {
    const importance =
      weights[p.type] >= 5 ? "🔥 High Priority" : "✨ Normal";

    return `${p.name} (${p.type}): ${p.travelTime.car} mins ${importance}`;
  });

  // Step 4: timeline simulation
  const timeline = relevantPlaces.map((p, i) => ({
    label:
      i === 0
        ? "Morning"
        : i === 1
        ? "Afternoon"
        : i === 2
        ? "Evening"
        : "Night",

    activity: p.name,
    type: p.type,
    travelTime: p.travelTime.car
  }));

  // Step 5: weighted score
  let totalScore = 0;
  let totalWeight = 0;

  relevantPlaces.forEach(p => {
    const weight = weights[p.type] || 1;
    const travelPenalty = p.travelTime?.car || 0;

    totalScore += weight * (100 - travelPenalty);
    totalWeight += weight;
  });

  const score =
    totalWeight === 0
      ? 0
      : Math.round(totalScore / totalWeight);

  // Step 6: persona insight (VERY IMPORTANT FOR DEMO)
  const insight =
    persona === "student"
      ? "Focused on education access, transport and affordability"
      : persona === "family"
      ? "Prioritizes safety, healthcare and daily convenience"
      : "Optimized for work-life balance and connectivity";

  return {
    persona,
    summary,
    timeline,
    score,
    insight
  };
}

module.exports = { generateSimulation };