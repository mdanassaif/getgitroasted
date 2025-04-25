const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// Add your Giphy API key as a constant
const GIPHY_API_KEY = "P7JNu2JjJbMxiE928MDQfT5rb1gqvcRZ";

async function fetchGitHubData(username: string) {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error('GitHub profile not found');
    }

    const [userData, reposData] = await Promise.all([
      userResponse.json(),
      reposResponse.json()
    ]);

    return { userData, reposData };
  } catch (error) {
    throw new Error('Failed to fetch GitHub data');
  }
}

// Add a function to fetch a random coding/programming related GIF
async function fetchRandomGif() {
  try {
    // Search for programming/coding related GIFs
    const giphyResponse = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=programming,coding,developer&rating=g`
    );
    
    if (!giphyResponse.ok) {
      throw new Error('Failed to fetch GIF');
    }
    
    const giphyData = await giphyResponse.json();
    return giphyData.data.images.original.url;
  } catch (error) {
    // Return a fallback GIF URL if the API call fails
    return "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif";
  }
}

async function generateRoast(userData: any, reposData: any[]) {
  const roasts = [
    `Looks like ${userData.login} thinks copying and pasting from Stack Overflow counts as coding experience.`,
    `${userData.login}'s commit history is shorter than their attention span.`,
    `I've seen more original code in a "Hello World" tutorial than in ${userData.login}'s repositories.`
  ];

  // Find the most recently updated repo with some content
  const targetRepo = reposData.length > 0 ? reposData[0] : null;

  // Get languages from repo
  const languages = targetRepo?.language ? [targetRepo.language] : [];
  
  // Fetch a random GIF
  const gifUrl = await fetchRandomGif();

  return {
    story: roasts,
    repo: targetRepo ? {
      name: targetRepo.name,
      description: targetRepo.description,
      language: targetRepo.language || "Unknown",
      languages: languages,
      stars: targetRepo.stargazers_count,
      lastUpdate: new Date(targetRepo.updated_at).toLocaleDateString(),
      forks: targetRepo.forks_count,
      watchers: targetRepo.watchers_count
    } : null,
    gif: gifUrl
  };
}

export async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { userData, reposData } = await fetchGitHubData(username);
    const roastData = await generateRoast(userData, reposData);

    return new Response(
      JSON.stringify(roastData),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate roast" 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}