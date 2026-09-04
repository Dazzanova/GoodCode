// prisma/seed.ts
import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- Users ----------
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("demo1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@goodcode.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@goodcode.dev",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@goodcode.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@goodcode.dev",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  // ---------- Topics ----------
  const topicNames = [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Stack",
    "Queue",
    "Trees",
    "Graphs",
    "Binary Search",
    "Greedy",
    "Backtracking",
    "Dynamic Programming",
  ];

  const topics: Record<string, { id: string }> = {};
  for (const name of topicNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    topics[name] = await prisma.topic.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  // ---------- Patterns ----------
  const patternDefs = [
    { name: "Two Pointers", description: "Use two indices moving through a structure to avoid nested loops." },
    { name: "Sliding Window", description: "Maintain a shrinking/growing window over a sequence to track a running property." },
    { name: "Prefix Sum", description: "Precompute cumulative sums to answer range queries in O(1)." },
    { name: "Hashing", description: "Use a hash map/set for O(1) average lookups to avoid brute-force search." },
    { name: "Binary Search", description: "Search a sorted or monotonic search space in O(log n)." },
    { name: "DFS", description: "Depth-first traversal of trees/graphs, often with recursion or an explicit stack." },
    { name: "BFS", description: "Level-order/shortest-path traversal using a queue." },
    { name: "Backtracking", description: "Explore all candidates, undoing choices that don't lead to a solution." },
    { name: "Greedy", description: "Make the locally optimal choice at each step and prove it leads to a global optimum." },
    { name: "Dynamic Programming", description: "Break a problem into overlapping subproblems and cache results." },
  ];

  const patterns: Record<string, { id: string }> = {};
  for (const p of patternDefs) {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-");
    patterns[p.name] = await prisma.pattern.upsert({
      where: { slug },
      update: {},
      create: { name: p.name, slug, description: p.description },
    });
  }

  // ---------- Problems ----------
  type ProblemSeed = {
    title: string;
    slug: string;
    description: string;
    constraints: string;
    difficulty: Difficulty;
    topic: string;
    patternNames: string[];
    hints: string[];
    solutionEditorial: string;
    solutionCode: string;
    mcqs: { question: string; options: { text: string; isCorrect: boolean }[] }[];
  };

  const problemSeeds: ProblemSeed[] = [
    {
      title: "Two Sum",
      slug: "two-sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      constraints: "2 <= nums.length <= 10^4, exactly one valid answer exists",
      difficulty: "EASY",
      topic: "Arrays",
      patternNames: ["Hashing"],
      hints: [
        "What information do you need to remember while scanning the array?",
        "Can you avoid repeatedly searching the elements you've already seen?",
        "Think about using a hash-based lookup structure.",
      ],
      solutionEditorial:
        "Iterate once, storing each value's index in a hash map. For each element, check if target - element already exists in the map.",
      solutionCode: `unordered_map<int,int> seen;
for (int i = 0; i < nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return {seen[need], i};
    seen[nums[i]] = i;
}`,
      mcqs: [
        {
          question: "Which data structure gives the optimal solution here?",
          options: [
            { text: "Hash Map", isCorrect: true },
            { text: "Stack", isCorrect: false },
            { text: "Heap", isCorrect: false },
            { text: "Sorted Array + Binary Search", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Maximum Subarray Sum of Size K",
      slug: "max-subarray-sum-k",
      description: "Given an array and an integer k, find the maximum sum of any contiguous subarray of size k.",
      constraints: "1 <= k <= nums.length",
      difficulty: "EASY",
      topic: "Arrays",
      patternNames: ["Sliding Window"],
      hints: [
        "Recomputing the sum for every window is wasteful — what changes between consecutive windows?",
        "Only one element leaves and one enters as the window slides.",
      ],
      solutionEditorial:
        "Maintain a running window sum. Add the incoming element, subtract the outgoing one, track the max.",
      solutionCode: `int windowSum = 0, maxSum;
for (int i = 0; i < k; i++) windowSum += nums[i];
maxSum = windowSum;
for (int i = k; i < nums.size(); i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = max(maxSum, windowSum);
}`,
      mcqs: [
        {
          question: "What is the time complexity of the sliding window approach?",
          options: [
            { text: "O(n)", isCorrect: true },
            { text: "O(n*k)", isCorrect: false },
            { text: "O(n log n)", isCorrect: false },
            { text: "O(k^2)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      description: "Given a string containing just '()[]{}', determine if the input string is valid (properly nested/matched).",
      constraints: "1 <= s.length <= 10^4",
      difficulty: "EASY",
      topic: "Stack",
      patternNames: ["Hashing"],
      hints: [
        "Which bracket needs to be closed first — the earliest or the most recent one opened?",
        "That LIFO behavior maps directly to one data structure.",
      ],
      solutionEditorial:
        "Push opening brackets onto a stack. On a closing bracket, check it matches the top of the stack, then pop.",
      solutionCode: `stack<char> st;
unordered_map<char,char> pairs = {{')','('},{']','['},{'}','{'}};
for (char c : s) {
    if (pairs.count(c)) {
        if (st.empty() || st.top() != pairs[c]) return false;
        st.pop();
    } else st.push(c);
}
return st.empty();`,
      mcqs: [
        {
          question: "Why is a stack the right structure here?",
          options: [
            { text: "It naturally matches the most recently opened bracket first (LIFO)", isCorrect: true },
            { text: "It allows O(1) random access", isCorrect: false },
            { text: "It keeps elements sorted", isCorrect: false },
            { text: "It avoids recursion", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Binary Search",
      slug: "binary-search",
      description: "Given a sorted array of integers and a target, return the index of target or -1 if not found.",
      constraints: "Array is sorted ascending, may contain up to 10^5 elements",
      difficulty: "EASY",
      topic: "Binary Search",
      patternNames: ["Binary Search"],
      hints: [
        "The array is sorted — can you eliminate half the search space each step?",
        "Compare the middle element to target and discard one half.",
      ],
      solutionEditorial: "Maintain lo/hi pointers, compare mid element to target, narrow the range each iteration.",
      solutionCode: `int lo = 0, hi = (int)nums.size() - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
      mcqs: [
        {
          question: "What is the time complexity?",
          options: [
            { text: "O(log n)", isCorrect: true },
            { text: "O(n)", isCorrect: false },
            { text: "O(n log n)", isCorrect: false },
            { text: "O(1)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Number of Islands",
      slug: "number-of-islands",
      description: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands (connected land regions).",
      constraints: "1 <= rows, cols <= 300",
      difficulty: "MEDIUM",
      topic: "Graphs",
      patternNames: ["DFS", "BFS"],
      hints: [
        "How do you avoid recounting land cells you've already visited?",
        "Think of each land cell as a node — connected land cells form a graph component.",
        "A visited/seen matrix plus DFS or BFS from each unvisited land cell will isolate each island.",
      ],
      solutionEditorial:
        "For each unvisited land cell, run DFS/BFS to mark the entire connected component as visited, incrementing the island count once per component.",
      solutionCode: `void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c);
    dfs(grid, r, c+1); dfs(grid, r, c-1);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < grid.size(); r++)
        for (int c = 0; c < grid[0].size(); c++)
            if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
    return count;
}`,
      mcqs: [
        {
          question: "Which pattern best describes this problem?",
          options: [
            { text: "Connected components via graph traversal", isCorrect: true },
            { text: "Dynamic programming", isCorrect: false },
            { text: "Binary search", isCorrect: false },
            { text: "Greedy", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Climbing Stairs",
      slug: "climbing-stairs",
      description: "You can climb 1 or 2 steps at a time. Given n steps, how many distinct ways can you reach the top?",
      constraints: "1 <= n <= 45",
      difficulty: "EASY",
      topic: "Dynamic Programming",
      patternNames: ["Dynamic Programming"],
      hints: [
        "How does the answer for n relate to the answers for n-1 and n-2?",
        "This is structurally identical to a well-known sequence.",
      ],
      solutionEditorial: "ways(n) = ways(n-1) + ways(n-2), since the last step is either a 1-step or 2-step move. Compute bottom-up.",
      solutionCode: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b; b = c;
    }
    return b;
}`,
      mcqs: [
        {
          question: "What is the space complexity of the optimized bottom-up solution?",
          options: [
            { text: "O(1)", isCorrect: true },
            { text: "O(n)", isCorrect: false },
            { text: "O(n^2)", isCorrect: false },
            { text: "O(log n)", isCorrect: false },
          ],
        },
      ],
    },
  ];

  for (const p of problemSeeds) {
    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        constraints: p.constraints,
        difficulty: p.difficulty,
        published: true,
        topicId: topics[p.topic].id,
        patterns: {
          create: p.patternNames.map((pn) => ({
            pattern: { connect: { id: patterns[pn].id } },
          })),
        },
        hints: {
          create: p.hints.map((content, i) => ({ order: i + 1, content })),
        },
        solution: {
          create: {
            editorial: p.solutionEditorial,
            codeSnippet: p.solutionCode,
          },
        },
        mcqs: {
          create: p.mcqs.map((m) => ({
            question: m.question,
            options: { create: m.options },
          })),
        },
      },
    });

    console.log(`Seeded: ${problem.title}`);
  }

  console.log("Done. Demo credentials:");
  console.log("  Admin -> admin@goodcode.dev / admin123");
  console.log("  User  -> demo@goodcode.dev / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });