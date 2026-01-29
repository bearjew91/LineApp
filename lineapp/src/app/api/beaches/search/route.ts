import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/beaches/search?q=query
 * Search for beaches by name
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Israeli beaches with Hebrew alternatives for better search
    const mockBeaches = [
      {
        id: 'beach_netanya',
        name: 'Netanya Beach',
        altNames: ['נתניה', 'netania'],
        latitude: 32.3194,
        longitude: 34.8612,
        region: 'Central',
        country: 'Israel'
      },
      {
        id: 'beach_haifa',
        name: 'Haifa Carmel Beach',
        altNames: ['חיפה', 'carmel', 'כרמל'],
        latitude: 32.8245,
        longitude: 34.9887,
        region: 'North',
        country: 'Israel'
      },
      {
        id: 'beach_ashdod',
        name: 'Ashdod Beach',
        altNames: ['אשדוד'],
        latitude: 31.8067,
        longitude: 34.6479,
        region: 'South',
        country: 'Israel'
      },
      {
        id: 'beach_ashkelon',
        name: 'Ashkelon Beach',
        altNames: ['אשקלון'],
        latitude: 31.6736,
        longitude: 34.5681,
        region: 'South',
        country: 'Israel'
      },
      {
        id: 'beach_herzliya',
        name: 'Herzliya Beach',
        altNames: ['הרצליה', 'herzeliya'],
        latitude: 32.1649,
        longitude: 34.7701,
        region: 'Central',
        country: 'Israel'
      },
      {
        id: 'beach_tel_aviv_hilton',
        name: 'Tel Aviv Hilton Beach',
        altNames: ['תל אביב', 'hilton', 'הילטון'],
        latitude: 32.0901,
        longitude: 34.7730,
        region: 'Tel Aviv',
        country: 'Israel'
      },
      {
        id: 'beach_tel_aviv_gordon',
        name: 'Tel Aviv Gordon Beach',
        altNames: ['גורדון', 'gordon'],
        latitude: 32.0831,
        longitude: 34.7683,
        region: 'Tel Aviv',
        country: 'Israel'
      },
      {
        id: 'beach_bat_yam',
        name: 'Bat Yam Beach',
        altNames: ['בת ים'],
        latitude: 32.0167,
        longitude: 34.7500,
        region: 'Central',
        country: 'Israel'
      },
      {
        id: 'beach_rishon',
        name: 'Rishon LeZion Beach',
        altNames: ['ראשון לציון', 'rishon lezion'],
        latitude: 31.9642,
        longitude: 34.7396,
        region: 'Central',
        country: 'Israel'
      },
      {
        id: 'beach_hadera',
        name: 'Hadera Beach',
        altNames: ['חדרה'],
        latitude: 32.4340,
        longitude: 34.8667,
        region: 'North',
        country: 'Israel'
      },
      {
        id: 'beach_nahariya',
        name: 'Nahariya Beach',
        altNames: ['נהריה'],
        latitude: 33.0067,
        longitude: 35.0833,
        region: 'North',
        country: 'Israel'
      },
      {
        id: 'beach_eilat',
        name: 'Eilat Beach',
        altNames: ['אילת'],
        latitude: 29.5577,
        longitude: 34.9519,
        region: 'South',
        country: 'Israel'
      }
    ];

    const lowerQuery = query.toLowerCase();
    
    const filtered = mockBeaches.filter(b => {
      // Check main name
      if (b.name.toLowerCase().includes(lowerQuery)) return true;
      // Check region
      if (b.region.toLowerCase().includes(lowerQuery)) return true;
      // Check alternative names (including Hebrew)
      if (b.altNames.some(alt => alt.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });

    // Return without altNames field
    return NextResponse.json(filtered.map(({ altNames, ...beach }) => beach));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search beaches' },
      { status: 500 }
    );
  }
}
