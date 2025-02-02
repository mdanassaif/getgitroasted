import { GoogleGenerativeAI } from "@google/generative-ai";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

// Savage roast templates for different aspects
const USER_ROASTS = [
  "Ah, {username} - living proof that anyone can create a GitHub account. Your bio screams 'I watched one coding tutorial and thought I was ready for FAANG.'",
  "Look who we have here - {username}, the developer whose contribution graph looks like a cemetery at midnight.",
  "Oh {username}, your GitHub profile is what we in the industry call 'technically present' - like a Windows ME user in 2024.",
  "Well, well, well, if it isn't {username} - the developer whose code makes spaghetti look organized.",
  "Ladies and gentlemen, meet {username} - proof that Stack Overflow copy-paste can sustain a whole career.",
];

const COMMIT_ROASTS = [
  "Your commit messages are shorter than your attention span. 'fix stuff' and 'update' - really? Even Git is crying.",
  "Your commit history looks like a panic attack in morse code. Let me guess, 'final_final_v2_REAL_final' is your naming convention?",
  "I've seen more meaningful communication from a broken keyboard than your commit messages.",
  "Your commit history reads like a thriller - nobody knows what's happening, including you.",
  "Your commits are like your dating life - inconsistent and full of regrets.",
];

const LANGUAGE_ROASTS = {
  JavaScript: [
    "Ah, JavaScript - because you couldn't handle TypeScript's tough love. Your code has more callbacks than your dating life.",
    "JavaScript? Your code probably has more nested callbacks than your family tree.",
    "Using JavaScript in {current_year}? Your code must be as reliable as a chocolate teapot.",
  ],
  Python: [
    "Python developer? More like 'indent error' survivor. Your code is so basic, it probably starts with 'print(\"Hello, World!\")'.",
    "Ah, Python - where indentation matters more than your code logic.",
    "Python? Your code is so slow, it makes a snail look like Usain Bolt.",
  ],
  HTML: [
    "Calling yourself a developer while only writing HTML is like calling yourself a chef because you can make toast.",
    "HTML as your main language? That's like saying Microsoft Paint is your photo editing software.",
    "HTML developer? That's not a thing, and you know it.",
  ],
  CSS: [
    "CSS? Your styling is so bad, even Internet Explorer would be embarrassed to render it.",
    "Your CSS looks like it was written by someone playing Twister with their keyboard.",
    "CSS master? More like 'div soup' chef.",
  ],
  Java: [
    "Java? In {current_year}? Your code has more boilerplate than actual logic. Spring Boot can't save you.",
    "Java developer? Your code must be as verbose as a politician's excuse.",
    "Still writing Java? You must really enjoy typing getters and setters.",
  ],
  TypeScript: [
    "TypeScript? Trying to add types won't fix your logical errors.",
    "Using TypeScript but still getting runtime errors? Impressive.",
    "TypeScript developer - because regular JavaScript wasn't complicated enough for you.",
  ],
  "": [
    "No primary language? Commitment issues aren't just for relationships, I see.",
    "Can't settle on a primary language? Jack of all trades, master of none - emphasis on none.",
    "Your most used language is probably Copy & Paste.",
  ],
};

const REPO_QUALITY_ROASTS = {
  noReadme: [
    "No README? Even abandoned projects leave a suicide note.",
    "Where's the README? Even ghosts leave notes behind.",
    "No README? That's like serving a mystery meal without instructions.",
  ],
  noDescription: [
    "No description? Your repo is more mysterious than your career prospects.",
    "Description-less repository? Even modern art comes with an explanation.",
    "No description added? Even mimes communicate better than this.",
  ],
  noStars: [
    "Zero stars? Even your test repositories are feeling lonely.",
    "No stars? Your repository is less popular than a Monday morning.",
    "The star count matches your debugging skills - absolute zero.",
  ],
  oldRepo: [
    "Last updated when dinosaurs roamed? Archaeological teams are more active than your git push frequency.",
    "This repo is so old, it probably runs on steam power.",
    "Your last commit is old enough to have its own GitHub account.",
  ],
  smallRepo: [
    "This repo is smaller than your chances of getting hired at Google.",
    "I've seen more code in a 'Hello World' program.",
    "Is this a repository for ants? It needs to be at least three times bigger!",
  ],
  messyStructure: [
    "Your repository structure is more chaotic than a tornado in a trailer park.",
    "Your file organization skills make a teenager's bedroom look tidy.",
    "This repo structure is a maze where even the files get lost.",
  ],
};

const REPO_SPECIFIC_ROASTS = [
  "Let's talk about {repo_name} - a masterpiece of mediocrity. It's like you're trying to set a world record for the most antipatterns in one codebase.",
  "Ah, {repo_name} - the digital equivalent of a dumpster fire. Even the comments look embarrassed to be there.",
  "Oh, {repo_name}! I've seen better organized code in a keyboard smash.",
  "Looking at {repo_name} is like watching a train wreck in slow motion, but with more merge conflicts.",
];

async function getRepoStats(octokit, username, repoName) {
  try {
    const [commits, languages] = await Promise.all([
      octokit.repos.listCommits({
        owner: username,
        repo: repoName,
        per_page: 100,
      }),
      octokit.repos.listLanguages({
        owner: username,
        repo: repoName,
      }),
    ]);

    const firstCommit = commits.data[commits.data.length - 1];
    const lastCommit = commits.data[0];
    const commitFrequency =
      commits.data.length /
      ((new Date(lastCommit.commit.author.date) -
        new Date(firstCommit.commit.author.date)) /
        (1000 * 60 * 60 * 24) || 1);

    return {
      totalCommits: commits.data.length,
      firstCommitDate: firstCommit?.commit.author.date,
      lastCommitDate: lastCommit?.commit.author.date,
      commitFrequency: commitFrequency.toFixed(2),
      languages: languages.data,
    };
  } catch (error) {
    console.error("Failed to get repo stats:", error);
    return null;
  }
}

async function generateAIRoast(userInfo, repo, repoStats, username) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Add repo-specific roast
  const repoRoast = REPO_SPECIFIC_ROASTS[Math.floor(Math.random() * REPO_SPECIFIC_ROASTS.length)]
    .replace("{repo_name}", repo.name);

  // Calculate activity metrics
  const accountAge = new Date() - new Date(userInfo.created_at);
  const yearsActive = (accountAge / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
  const hasWebsite = userInfo.blog
    ? `has a portfolio at ${userInfo.blog}`
    : "no portfolio (probably for the best)";
  const totalStars = userInfo.public_repos > 0 ? repo.stargazers_count || 0 : 0;

  const daysInactive = Math.floor(
    (new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24)
  );
  const languagesList = repoStats?.languages
    ? Object.keys(repoStats.languages).join(", ")
    : repo.language || "Unknown";

  const prompt = `You're a savage stand-up comedian roasting a GitHub developer. Create a continuous, flowing roast (about 100-120 words) that starts with personal jabs, moves through their code, and ends with a sarcastic career advice punchline. Don't use any headings or sections and don't use quotation marks.

  Developer Info:
  Username: ${username}
  Bio: ${userInfo.bio || "No bio"}
  Active for: ${yearsActive} years
  Portfolio: ${hasWebsite}
  Company: ${userInfo.company || "Unemployed"}
  Location: ${userInfo.location || "Unknown"}
  Public repos: ${userInfo.public_repos}
  Followers: ${userInfo.followers}
  
  Repository "${repo.name}":
  Roast opener: ${repoRoast}
  Description: ${repo.description || "No description"}
  Languages: ${languagesList}
  Stars: ${totalStars}
  Days inactive: ${daysInactive}
  Commit frequency: ${repoStats?.commitFrequency || "Unknown"} commits per day
  First commit: ${repoStats?.firstCommitDate || "Unknown"}
  
  Start with roasting their profile, then use the provided repo roast opener, continue mocking their repository and coding style, and end with a sarcastic suggestion about an alternative career. Make it flow naturally as one continuous roast. Keep it spicy but playful!`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 512,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });

    // Split the roast into 2-3 parts based on sentence endings
    const fullText = result.response.text();
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
    const totalSentences = sentences.length;
    const partSize = Math.ceil(totalSentences / 3);
    
    const parts = [];
    for (let i = 0; i < totalSentences; i += partSize) {
      parts.push(sentences.slice(i, i + partSize).join(' ').trim());
    }

    return parts;
  } catch (error) {
    console.error("AI Roast generation failed:", error);
    return generateFallbackRoast(username, repo);
  }
}

function generateFallbackRoast(username, repo) {
  // ... existing template-based roast generation ...
  const structuredRoasts = generateStructuredRoast(
    username,
    userInfo,
    repos,
    targetRepo
  );
  return `${structuredRoasts.userRoast}\n\n${structuredRoasts.commitRoast}\n\n${structuredRoasts.languageRoast}\n\n${structuredRoasts.repoQualityRoast}`;
}

function generateStructuredRoast(username, userInfo, repos, targetRepo) {
  const currentYear = new Date().getFullYear();

  // Get random roasts from each category
  const userRoast = USER_ROASTS[
    Math.floor(Math.random() * USER_ROASTS.length)
  ].replace("{username}", username);

  const commitRoast =
    COMMIT_ROASTS[Math.floor(Math.random() * COMMIT_ROASTS.length)];

  const languageRoasts =
    LANGUAGE_ROASTS[targetRepo.language || ""] || LANGUAGE_ROASTS[""];
  const languageRoast = languageRoasts[
    Math.floor(Math.random() * languageRoasts.length)
  ].replace("{current_year}", currentYear);

  // Generate repo quality roasts
  const repoIssues = [];
  if (!targetRepo.description) {
    repoIssues.push(
      REPO_QUALITY_ROASTS.noDescription[
        Math.floor(Math.random() * REPO_QUALITY_ROASTS.noDescription.length)
      ]
    );
  }
  if (targetRepo.stargazers_count === 0) {
    repoIssues.push(
      REPO_QUALITY_ROASTS.noStars[
        Math.floor(Math.random() * REPO_QUALITY_ROASTS.noStars.length)
      ]
    );
  }

  const timeSinceUpdate = new Date() - new Date(targetRepo.updated_at);
  const monthsSinceUpdate = timeSinceUpdate / (1000 * 60 * 60 * 24 * 30);
  if (monthsSinceUpdate > 6) {
    repoIssues.push(
      REPO_QUALITY_ROASTS.oldRepo[
        Math.floor(Math.random() * REPO_QUALITY_ROASTS.oldRepo.length)
      ]
    );
  }

  const repoQualityRoast = repoIssues.join(" ");

  return {
    userRoast,
    commitRoast,
    languageRoast,
    repoQualityRoast,
  };
}

async function getRandomGif() {
  const keywords = [
    "coding fail",
    "facepalm",
    "programming fail",
    "tech fail",
    "debugging",
    "computer rage",
    "funny code",
    "nerd laugh",
  ];

  try {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${keyword}&limit=25&rating=pg-13`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Giphy");
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      return data.data[randomIndex].images.original.url;
    }

    throw new Error("No GIFs found");
  } catch (error) {
    console.error("Giphy API error:", error);
    // Fallback GIFs if API fails
    const fallbackGifs = [
      "https://media.giphy.com/media/JRF85A7Bcl2YU/giphy.gif",
      "https://media.giphy.com/media/pPhyAv5t9V8djyRFJH/giphy.gif",
      "https://media.giphy.com/media/hvq8ONQhQ1XLq/giphy.gif",
      "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
      "https://media.giphy.com/media/xUA7aZhmzXeCXq80Hm/giphy.gif",
    ];
    return fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Get user's info and repositories
    const [{ data: userInfo }, { data: repos }] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.repos.listForUser({
        username,
        sort: "updated",
        per_page: 100,
      }),
    ]);

    if (!repos.length) {
      return NextResponse.json(
        {
          error: "No repositories found. Did you mistake GitHub for Instagram?",
        },
        { status: 404 }
      );
    }

    // Find the "worst" repository
    const targetRepo = repos.reduce(
      (worst, current) => {
        const score =
          current.stargazers_count * 2 +
          current.forks_count * 2 +
          current.watchers_count -
          (new Date() - new Date(current.updated_at)) /
            (1000 * 60 * 60 * 24 * 30);

        if (!worst.score || score < worst.score) {
          return { ...current, score };
        }
        return worst;
      },
      { score: null }
    );

    // Get detailed stats for the target repo
    const repoStats = await getRepoStats(octokit, username, targetRepo.name);

    // Generate AI roast
    const roastParts = await generateAIRoast(
      userInfo,
      targetRepo,
      repoStats,
      username
    );

    return NextResponse.json({
      story: roastParts,
      repo: {
        name: targetRepo.name,
        description: targetRepo.description,
        language: targetRepo.language || "Unknown (probably HTML-only)",
        stars: targetRepo.stargazers_count,
        lastUpdate: new Date(targetRepo.updated_at).toLocaleDateString(),
        forks: targetRepo.forks_count,
        watchers: targetRepo.watchers_count,
        firstCommit: repoStats?.firstCommitDate
          ? new Date(repoStats.firstCommitDate).toLocaleDateString()
          : "Unknown",
        commitFrequency: repoStats?.commitFrequency || "Unknown",
        languages: repoStats?.languages
          ? Object.keys(repoStats.languages)
          : [targetRepo.language || "Unknown"],
      },
      gif: await getRandomGif(),
    });
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Failed to roast. Your code is so bad it broke our roaster." },
      { status: 500 }
    );
  }
}
