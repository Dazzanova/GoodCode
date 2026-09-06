import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

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
    {
      title: "Container With Most Water",
      slug: "container-with-most-water",
      description:
        "Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container holding the most water.",
      constraints: "2 <= height.length <= 10^5",
      difficulty: "MEDIUM",
      topic: "Arrays",
      patternNames: ["Two Pointers"],
      hints: [
        "Checking every pair is O(n^2) — what determines whether moving the left or right boundary could help?",
        "The shorter line is always the limiting factor. What happens if you move the taller one inward instead?",
      ],
      solutionEditorial:
        "Start with two pointers at both ends. Always move the pointer at the shorter line inward, since moving the taller one can only decrease or keep the same area.",
      solutionCode: `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, best = 0;
    while (l < r) {
        int area = min(height[l], height[r]) * (r - l);
        best = max(best, area);
        if (height[l] < height[r]) l++;
        else r--;
    }
    return best;
}`,
      mcqs: [
        {
          question: "Why do we always move the pointer at the shorter line?",
          options: [
            { text: "The shorter line caps the area regardless of the other side, so keeping it can't improve the result", isCorrect: true },
            { text: "It guarantees a sorted array", isCorrect: false },
            { text: "It reduces memory usage", isCorrect: false },
            { text: "It avoids integer overflow", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Valid Palindrome",
      slug: "valid-palindrome",
      description:
        "Given a string, determine if it is a palindrome after converting to lowercase and removing all non-alphanumeric characters.",
      constraints: "1 <= s.length <= 2 * 10^5",
      difficulty: "EASY",
      topic: "Strings",
      patternNames: ["Two Pointers"],
      hints: [
        "Do you need to build a cleaned copy of the string first, or can you skip invalid characters while comparing?",
        "Two pointers moving inward from both ends can check both conditions at once.",
      ],
      solutionEditorial:
        "Use two pointers from both ends, skipping non-alphanumeric characters, comparing lowercased characters until they meet.",
      solutionCode: `bool isPalindrome(string s) {
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    }
    return true;
}`,
      mcqs: [
        {
          question: "What is the space complexity of the two-pointer approach (no extra string built)?",
          options: [
            { text: "O(1)", isCorrect: true },
            { text: "O(n)", isCorrect: false },
            { text: "O(n log n)", isCorrect: false },
            { text: "O(n^2)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Subarray Sum Equals K",
      slug: "subarray-sum-equals-k",
      description: "Given an array of integers and an integer k, find the total number of contiguous subarrays whose sum equals k.",
      constraints: "1 <= nums.length <= 2 * 10^4",
      difficulty: "MEDIUM",
      topic: "Arrays",
      patternNames: ["Prefix Sum", "Hashing"],
      hints: [
        "If you know the running sum up to index i, what earlier running sum would make a subarray ending at i equal k?",
        "You need prefixSum[i] - prefixSum[j] = k, so prefixSum[j] = prefixSum[i] - k. Can a hash map help you count these efficiently?",
      ],
      solutionEditorial:
        "Track running prefix sum and a hash map of how many times each prefix sum value has occurred. For each new sum, check how many earlier prefix sums equal (sum - k).",
      solutionCode: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> count{{0,1}};
    int sum = 0, total = 0;
    for (int n : nums) {
        sum += n;
        total += count[sum - k];
        count[sum]++;
    }
    return total;
}`,
      mcqs: [
        {
          question: "Why does the map start with {0: 1} before iterating?",
          options: [
            { text: "It accounts for subarrays starting from index 0 that sum exactly to k", isCorrect: true },
            { text: "It prevents integer overflow", isCorrect: false },
            { text: "It sorts the prefix sums", isCorrect: false },
            { text: "It is unnecessary and can be removed", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Range Sum Query - Immutable",
      slug: "range-sum-query-immutable",
      description:
        "Given an integer array, handle multiple queries that ask for the sum of elements between indices left and right, inclusive.",
      constraints: "1 <= nums.length <= 10^4, up to 10^4 queries",
      difficulty: "EASY",
      topic: "Arrays",
      patternNames: ["Prefix Sum"],
      hints: [
        "Recomputing the sum for every query is O(n) per query — can you precompute something once?",
        "A prefix sum array lets you answer any range sum in O(1) after O(n) preprocessing.",
      ],
      solutionEditorial:
        "Precompute prefix[i] = sum of nums[0..i-1]. Then sumRange(l, r) = prefix[r+1] - prefix[l].",
      solutionCode: `vector<int> prefix;
NumArray(vector<int>& nums) {
    prefix.assign(nums.size() + 1, 0);
    for (int i = 0; i < nums.size(); i++)
        prefix[i+1] = prefix[i] + nums[i];
}
int sumRange(int l, int r) {
    return prefix[r+1] - prefix[l];
}`,
      mcqs: [
        {
          question: "What is the query time complexity after preprocessing?",
          options: [
            { text: "O(1)", isCorrect: true },
            { text: "O(n)", isCorrect: false },
            { text: "O(log n)", isCorrect: false },
            { text: "O(r - l)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Best Time to Buy and Sell Stock",
      slug: "best-time-to-buy-sell-stock",
      description:
        "Given an array of daily stock prices, find the maximum profit from buying on one day and selling on a later day.",
      constraints: "1 <= prices.length <= 10^5",
      difficulty: "EASY",
      topic: "Arrays",
      patternNames: ["Greedy"],
      hints: [
        "For each day, what's the best possible profit if you sold today?",
        "That depends only on the lowest price seen so far — do you need to check every earlier day again?",
      ],
      solutionEditorial:
        "Track the minimum price seen so far while scanning. At each day, compute profit if selling today and keep the max.",
      solutionCode: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, best = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        best = max(best, p - minPrice);
    }
    return best;
}`,
      mcqs: [
        {
          question: "Why is this considered a greedy approach?",
          options: [
            { text: "At each step we make the locally optimal choice (track the lowest price so far) without reconsidering past decisions", isCorrect: true },
            { text: "It uses recursion to try every combination", isCorrect: false },
            { text: "It sorts the prices first", isCorrect: false },
            { text: "It requires a priority queue", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Jump Game",
      slug: "jump-game",
      description:
        "Given an array where each element represents your maximum jump length from that position, determine if you can reach the last index starting from index 0.",
      constraints: "1 <= nums.length <= 10^4",
      difficulty: "MEDIUM",
      topic: "Arrays",
      patternNames: ["Greedy"],
      hints: [
        "Do you need to try every possible sequence of jumps, or can you track the furthest reachable index as you scan?",
        "At each index, if it's within your current reach, update the furthest index you could ever reach from there.",
      ],
      solutionEditorial:
        "Track the furthest reachable index while scanning left to right. If the current index ever exceeds the furthest reachable point, it's impossible.",
      solutionCode: `bool canJump(vector<int>& nums) {
    int reach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > reach) return false;
        reach = max(reach, i + nums[i]);
    }
    return true;
}`,
      mcqs: [
        {
          question: "What does it mean if index i > reach during the scan?",
          options: [
            { text: "Index i is unreachable from any earlier position, so the end can't be reached", isCorrect: true },
            { text: "The array is not sorted", isCorrect: false },
            { text: "nums[i] must be zero", isCorrect: false },
            { text: "It means the answer is always true", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Merge Intervals",
      slug: "merge-intervals",
      description: "Given an array of intervals, merge all overlapping intervals and return the resulting non-overlapping intervals.",
      constraints: "1 <= intervals.length <= 10^4",
      difficulty: "MEDIUM",
      topic: "Arrays",
      patternNames: ["Greedy"],
      hints: [
        "Overlaps are hard to detect in arbitrary order — what if the intervals were sorted by start time first?",
        "Once sorted, you only ever need to compare each interval to the last one you've already merged.",
      ],
      solutionEditorial:
        "Sort intervals by start time. Iterate through, merging into the last interval in the result if it overlaps, otherwise appending a new one.",
      solutionCode: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> result;
    for (auto& iv : intervals) {
        if (!result.empty() && iv[0] <= result.back()[1])
            result.back()[1] = max(result.back()[1], iv[1]);
        else
            result.push_back(iv);
    }
    return result;
}`,
      mcqs: [
        {
          question: "Why is sorting by start time the key first step?",
          options: [
            { text: "It guarantees any interval that could overlap the current one is either the last merged one or comes right after", isCorrect: true },
            { text: "It removes duplicate intervals", isCorrect: false },
            { text: "It reduces the problem to binary search", isCorrect: false },
            { text: "Sorting is required by the output format", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Subsets",
      slug: "subsets",
      description: "Given an array of unique integers, return all possible subsets (the power set).",
      constraints: "1 <= nums.length <= 10",
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternNames: ["Backtracking"],
      hints: [
        "At each element, you have exactly two choices — what are they?",
        "Include the element or exclude it, then recurse on the rest. Backtrack by undoing the choice after exploring it.",
      ],
      solutionEditorial:
        "For each element, recursively branch into 'include it' and 'exclude it', adding the current subset to results at each recursive call.",
      solutionCode: `void backtrack(vector<int>& nums, int idx, vector<int>& current, vector<vector<int>>& result) {
    if (idx == nums.size()) { result.push_back(current); return; }
    current.push_back(nums[idx]);
    backtrack(nums, idx + 1, current, result);
    current.pop_back();
    backtrack(nums, idx + 1, current, result);
}`,
      mcqs: [
        {
          question: "How many total subsets exist for an array of size n?",
          options: [
            { text: "2^n", isCorrect: true },
            { text: "n!", isCorrect: false },
            { text: "n^2", isCorrect: false },
            { text: "2n", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Permutations",
      slug: "permutations",
      description: "Given an array of distinct integers, return all possible permutations.",
      constraints: "1 <= nums.length <= 6",
      difficulty: "MEDIUM",
      topic: "Backtracking",
      patternNames: ["Backtracking"],
      hints: [
        "How do you avoid reusing an element that's already placed in the current permutation?",
        "Track which elements are already used, and backtrack by marking them unused again after exploring.",
      ],
      solutionEditorial:
        "Recursively build permutations by trying each unused element at each position, marking it used, recursing, then unmarking (backtracking) before trying the next option.",
      solutionCode: `void backtrack(vector<int>& nums, vector<int>& current, vector<bool>& used, vector<vector<int>>& result) {
    if (current.size() == nums.size()) { result.push_back(current); return; }
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        current.push_back(nums[i]);
        backtrack(nums, current, used, result);
        current.pop_back();
        used[i] = false;
    }
}`,
      mcqs: [
        {
          question: "What is the time complexity of generating all permutations?",
          options: [
            { text: "O(n!)", isCorrect: true },
            { text: "O(2^n)", isCorrect: false },
            { text: "O(n^2)", isCorrect: false },
            { text: "O(n log n)", isCorrect: false },
          ],
        },
      ],
    },
    {
      title: "Course Schedule",
      slug: "course-schedule",
      description:
        "Given a number of courses and a list of prerequisite pairs, determine if it's possible to finish all courses (detect if the prerequisite graph has a cycle).",
      constraints: "1 <= numCourses <= 2000",
      difficulty: "MEDIUM",
      topic: "Graphs",
      patternNames: ["BFS", "DFS"],
      hints: [
        "This is really asking: does the dependency graph contain a cycle?",
        "Track nodes currently in the recursion path (being visited) separately from fully finished nodes — a cycle exists if you revisit a node still in the current path.",
      ],
      solutionEditorial:
        "Model courses as a directed graph. Run DFS tracking 'visiting' vs 'visited' states — if DFS revisits a node currently marked 'visiting', a cycle exists and courses can't be finished.",
      solutionCode: `bool dfs(int node, vector<vector<int>>& graph, vector<int>& state) {
    if (state[node] == 1) return false; // cycle
    if (state[node] == 2) return true;  // already processed
    state[node] = 1;
    for (int next : graph[node])
        if (!dfs(next, graph, state)) return false;
    state[node] = 2;
    return true;
}`,
      mcqs: [
        {
          question: "What does finding a cycle in the prerequisite graph mean?",
          options: [
            { text: "It's impossible to complete all courses, since some depend on each other circularly", isCorrect: true },
            { text: "There are duplicate courses", isCorrect: false },
            { text: "The graph is disconnected", isCorrect: false },
            { text: "All courses can be completed in any order", isCorrect: false },
          ],
        },
      ],
    },
  ];

  const createdProblems: Record<string, { id: string }> = {};

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

    createdProblems[p.slug] = problem;
    console.log(`Seeded: ${problem.title}`);
  }

  // ---------- Backdated demo submission history ----------
  // This gives the demo user a realistic mix of states — solved long ago,
  // solved recently, attempted-but-unsolved, and never touched — so future
  // features like Daily Practice / Revision / Weak Areas have real variance
  // to compute against instead of an empty or uniform dataset.
  //
  // Deliberately NOT touching two-sum / max-subarray-sum-k / etc. here,
  // since those already have real submission history from manual testing
  // earlier in development. Only new problems get backdated history.

  type HistoryEntry = {
    slug: string;
    daysAgoSolved?: number;
    attemptsOnly?: number; // attempted N times, never solved
  };

  const history: HistoryEntry[] = [
    { slug: "container-with-most-water", daysAgoSolved: 22 },
    { slug: "valid-palindrome", daysAgoSolved: 20 },
    { slug: "subarray-sum-equals-k", daysAgoSolved: 18 },
    { slug: "best-time-to-buy-sell-stock", daysAgoSolved: 14 },
    { slug: "merge-intervals", daysAgoSolved: 2 },
    { slug: "jump-game", attemptsOnly: 2 },
    // range-sum-query-immutable, subsets, permutations, course-schedule:
    // intentionally left untouched — never attempted by demo user.
  ];

  for (const h of history) {
    const problem = createdProblems[h.slug];
    if (!problem) continue;

    if (h.daysAgoSolved !== undefined) {
      const solvedDate = daysAgo(h.daysAgoSolved);

      await prisma.submission.create({
        data: {
          userId: demoUser.id,
          problemId: problem.id,
          code: "// solved during seed history generation",
          language: "cpp",
          status: "ACCEPTED",
          timeSpentS: 300 + Math.floor(Math.random() * 900),
          submittedAt: solvedDate,
        },
      });

      await prisma.problemProgress.upsert({
        where: { userId_problemId: { userId: demoUser.id, problemId: problem.id } },
        create: {
          userId: demoUser.id,
          problemId: problem.id,
          status: "SOLVED",
          attempts: 1,
          firstAttemptAt: solvedDate,
          lastAttemptAt: solvedDate,
          solvedAt: solvedDate,
        },
        update: {},
      });
    } else if (h.attemptsOnly !== undefined) {
      const attemptDate = daysAgo(5);

      for (let i = 0; i < h.attemptsOnly; i++) {
        await prisma.submission.create({
          data: {
            userId: demoUser.id,
            problemId: problem.id,
            code: "// unsuccessful attempt during seed history generation",
            language: "cpp",
            status: "WRONG_ANSWER",
            timeSpentS: 200 + Math.floor(Math.random() * 400),
            submittedAt: attemptDate,
          },
        });
      }

      await prisma.problemProgress.upsert({
        where: { userId_problemId: { userId: demoUser.id, problemId: problem.id } },
        create: {
          userId: demoUser.id,
          problemId: problem.id,
          status: "ATTEMPTED",
          attempts: h.attemptsOnly,
          firstAttemptAt: attemptDate,
          lastAttemptAt: attemptDate,
        },
        update: {},
      });
    }

    console.log(`History seeded: ${h.slug}`);
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