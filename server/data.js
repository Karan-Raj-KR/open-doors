export const accessOptions = [
  {
    key: "stepFree",
    label: "Step-free access",
    short: "Step-free",
    detail: "A step-free route from the entrance to the event space.",
  },
  {
    key: "quiet",
    label: "Low-noise setting",
    short: "Low noise",
    detail: "No amplified music and a quieter space to take a break.",
  },
  {
    key: "seating",
    label: "Seating available",
    short: "Seating",
    detail: "Seats available throughout, with room for companions.",
  },
  {
    key: "transit",
    label: "Near public transport",
    short: "Near metro",
    detail: "A public transport stop within a 10-minute walk.",
  },
  {
    key: "toilet",
    label: "Accessible restroom",
    short: "Accessible WC",
    detail: "An accessible restroom is available at the venue.",
  },
  {
    key: "signLanguage",
    label: "Sign-language support",
    short: "ISL support",
    detail: "An Indian Sign Language interpreter is scheduled.",
  },
];
const day = (offset, hour = 17) => {
  const now = new Date();
  const localDay = new Date(now.getTime() + 330 * 60000);
  localDay.setUTCDate(localDay.getUTCDate() + offset);
  localDay.setUTCHours(hour, 0, 0, 0);
  return new Date(localDay.getTime() - 330 * 60000).toISOString();
};
export function seedEvents() {
  return [
    {
      slug: "slow-sunday",
      title: "The slow Sunday club",
      category: "Outdoors",
      tagline: "A little fresh air. A lot of good company.",
      description:
        "Leave the rush at the gate. Join a small group for a gentle stroll through the gardens, followed by a bring-your-own picnic. There is no pace to keep up with and no pressure to make conversation. Come with a friend, or meet one here.",
      venue: "Lalbagh Botanical Garden",
      area: "Lalbagh",
      date: day(6, 8),
      duration: 120,
      price: 0,
      capacity: 24,
      image: "garden",
      color: "#d9e0cd",
      host: "The Sunday Collective",
      access: {
        stepFree: true,
        quiet: true,
        seating: true,
        transit: true,
        toilet: true,
        signLanguage: null,
      },
      accessNotes:
        "Enter through the West Gate. The 800 m route follows wide, paved paths. Benches are available along the route. The accessible restroom is 150 m from the meeting point.",
      transport:
        "Lalbagh Metro, Green Line. West Gate is approximately 350 m away. Drop-off space is available outside the gate.",
      noise: "Quiet conversation and outdoor sounds. No amplified music.",
      lat: 12.9507,
      lng: 77.5848,
      featured: true,
    },
    {
      slug: "clay-and-company",
      title: "Clay, coffee & company",
      category: "Workshops",
      tagline: "Make something a little imperfect.",
      description:
        "A relaxed, beginner-friendly hand-building session. Shape a small bowl or cup, share a coffee and enjoy working with your hands. All materials are provided. A facilitator can adapt tools and table arrangements on request.",
      venue: "The Pottery Room",
      area: "Indiranagar",
      date: day(3, 11),
      duration: 150,
      price: 650,
      capacity: 12,
      image: "pottery",
      color: "#e8c8a4",
      host: "Hands Together Studio",
      access: {
        stepFree: true,
        quiet: true,
        seating: true,
        transit: true,
        toilet: false,
        signLanguage: false,
      },
      accessNotes:
        "Ground-floor studio with a level entrance and adjustable work tables. Door width is 92 cm. The restroom has a narrow doorway and is not wheelchair accessible.",
      transport:
        "Indiranagar Metro, Purple Line. The studio is a 7-minute walk. A passenger drop-off is possible at the front door.",
      noise: "Soft conversation. No background music during the workshop.",
      lat: 12.9784,
      lng: 77.6408,
    },
    {
      slug: "jazz-under-trees",
      title: "Jazz under the trees",
      category: "Music",
      tagline: "Your evening, with a softer soundtrack.",
      description:
        "An intimate acoustic set in a garden courtyard. Enjoy Bengaluru musicians, a small food menu and a seated evening under the canopy. A quiet room is open throughout for anyone who needs a break.",
      venue: "Courtyard at The Commons",
      area: "Jayanagar",
      date: day(4, 18),
      duration: 120,
      price: 350,
      capacity: 40,
      image: "music",
      color: "#bdc4a6",
      host: "The Commons",
      access: {
        stepFree: true,
        quiet: false,
        seating: true,
        transit: true,
        toilet: true,
        signLanguage: false,
      },
      accessNotes:
        "Ramp at the side entrance. Reserved spaces beside companion seats. The quiet room is indoors, away from the speakers. Ask the welcome desk for earplugs.",
      transport:
        "South End Circle Metro is a 9-minute walk. Accessible parking space can be requested in your booking note.",
      noise:
        "Amplified live music. Earplugs and a separate quiet room are available.",
      lat: 12.9299,
      lng: 77.5933,
    },
    {
      slug: "stories-in-sign",
      title: "Stories beyond words",
      category: "Culture",
      tagline: "An afternoon of stories, in every language.",
      description:
        "Experience visual storytelling, poetry and a small book exchange. Spoken sessions are interpreted in Indian Sign Language, with printed summaries available. Bring a book you love if you would like to join the exchange.",
      venue: "Chapter One Library",
      area: "MG Road",
      date: day(8, 15),
      duration: 90,
      price: 0,
      capacity: 30,
      image: "books",
      color: "#dbbcb1",
      host: "Chapter One Community",
      access: {
        stepFree: true,
        quiet: true,
        seating: true,
        transit: true,
        toilet: true,
        signLanguage: true,
      },
      accessNotes:
        "Lift access to the first floor. Front-row seats have clear sightlines to the interpreter. Accessible restroom beside the lift lobby. Assistance dogs welcome.",
      transport:
        "MG Road Metro is a 4-minute walk. The lift entrance is on the eastern side of the building.",
      noise:
        "Quiet discussion. No amplified music. ISL interpretation for every spoken session.",
      lat: 12.9756,
      lng: 77.6066,
    },
    {
      slug: "sunset-sketchbook",
      title: "A sunset sketchbook",
      category: "Workshops",
      tagline: "Look a little closer. Draw a little slower.",
      description:
        "A guided outdoor sketching session for complete beginners and experienced doodlers alike. Sketchbooks and pencils are included. Choose a shaded chair or a picnic spot and draw at your own pace.",
      venue: "Sankey Tank Garden",
      area: "Malleshwaram",
      date: day(10, 16),
      duration: 90,
      price: 200,
      capacity: 18,
      image: "sketch",
      color: "#ead6b8",
      host: "Small Things Art Club",
      access: {
        stepFree: true,
        quiet: true,
        seating: true,
        transit: false,
        toilet: null,
        signLanguage: false,
      },
      accessNotes:
        "Paved approach through the south entrance. Portable chairs are provided. Restroom accessibility has not yet been confirmed by the organiser.",
      transport:
        "Bus stops on Sankey Road are nearby. The closest metro is more than a 10-minute walk. Drop-off is available at the south entrance.",
      noise: "Outdoor sounds and gentle conversation. No music.",
      lat: 13.0098,
      lng: 77.5712,
    },
    {
      slug: "neighbourhood-table",
      title: "The neighbourhood table",
      category: "Food & community",
      tagline: "Pull up a chair. There is room for you.",
      description:
        "A community lunch with shared tables, conversation cards and food from neighbourhood cooks. Vegetarian options are available. Tell the organiser about dietary needs before booking; allergen-free preparation cannot be guaranteed.",
      venue: "Together Community Kitchen",
      area: "Koramangala",
      date: day(12, 12),
      duration: 120,
      price: 250,
      capacity: 28,
      image: "food",
      color: "#d7d6b2",
      host: "Together Bengaluru",
      access: {
        stepFree: false,
        quiet: false,
        seating: true,
        transit: false,
        toilet: false,
        signLanguage: null,
      },
      accessNotes:
        "Two steps at the entrance; there is currently no ramp. Seating is at shared tables. The restroom is not wheelchair accessible.",
      transport:
        "Local bus stops are a 5-minute walk. No designated accessible parking. Please contact the organiser for drop-off advice.",
      noise: "Busy shared dining room. Conversation and kitchen sounds.",
      lat: 12.9352,
      lng: 77.6245,
    },
  ].map((e) => ({
    ...e,
    updates: [
      {
        text: "Access information added by the organiser. Please contact us if you need details before making plans.",
        createdAt: new Date().toISOString(),
      },
    ],
  }));
}
