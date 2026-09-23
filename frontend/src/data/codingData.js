export const codingLanguages = [
  'All Languages',
  'C',
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'HTML/CSS',
  'SQL',
  'React',
  'Node.js',
];

export const dsaTopics = [
  'All Topics',
  'Arrays',
  'Strings',
  'Two Pointers',
  'Sliding Window',
  'Linked Lists',
  'Stack',
  'Queue',
  'Trees',
  'Graphs',
  'Recursion',
  'Dynamic Programming',
  'Searching',
  'Sorting',
  'Hashing',
];

export const codingProblems = [
  {
    id: 'two-sum',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    acceptance: '52%',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    input: 'nums = [2, 7, 11, 15], target = 9',
    output: '[0, 1]',
    example: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
    explanation: 'By storing the numbers we have already seen in a Hash Map alongside their array indices, we can check in O(1) time if the required complement (target - currentNumber) already exists.',
    hint: 'Can you solve this without checking every pair in O(N^2) time? Try using a Hash Map to look up complement values in constant time.',
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`,
    },
    solution: `// Time Complexity: O(N) | Space Complexity: O(N)
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    relatedProblems: ['three-sum', 'two-sum-ii', 'subarray-sum-equals-k'],
  },
  {
    id: 'valid-parentheses',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    acceptance: '44%',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.',
    input: 's = "()[]{}"',
    output: 'true',
    example: 'Input s = "(]" -> Output false because opening parenthesis is followed by square bracket.',
    explanation: 'A Stack data structure obeys Last-In-First-Out (LIFO). Whenever an opening bracket appears, push its corresponding closing bracket onto the stack. When a closing bracket appears, pop the top of the stack and verify it matches.',
    hint: 'Use a Stack. Every time you see an opening bracket, anticipate the matching closing bracket.',
    starterCode: {
      javascript: `function isValid(s) {
  // Your code here
}`,
      python: `def is_valid(s: str) -> bool:
    # Your code here
    pass`,
    },
    solution: `// Time Complexity: O(N) | Space Complexity: O(N)
function isValid(s) {
  const stack = [];
  const map = { '(': ')', '{': '}', '[': ']' };

  for (const char of s) {
    if (map[char]) {
      stack.push(map[char]);
    } else if (stack.pop() !== char) {
      return false;
    }
  }
  return stack.length === 0;
}`,
    relatedProblems: ['min-stack', 'generate-parentheses', 'longest-valid-parentheses'],
  },
  {
    id: 'longest-substring-without-repeating',
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    languages: ['JavaScript', 'Python', 'Java'],
    acceptance: '35%',
    description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
    input: 's = "abcabcbb"',
    output: '3',
    example: 'The answer is "abc", with the length of 3.',
    explanation: 'Maintain a sliding window [left, right] and a Set of characters currently in the window. As right moves forward, if the character at right already exists in the set, shrink the window from the left until the duplicate is eliminated.',
    hint: 'Use the Sliding Window technique with two pointers and a Hash Set to track unique characters in the current substring.',
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Your code here
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Your code here
    pass`,
    },
    solution: `// Time Complexity: O(N) | Space Complexity: O(min(N, M))
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const charSet = new Set();

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
    relatedProblems: ['longest-repeating-character-replacement', 'minimum-window-substring'],
  },
  {
    id: 'reverse-linked-list',
    slug: 'reverse-linked-list',
    title: 'Reverse a Linked List',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    acceptance: '76%',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list head.',
    input: 'head = [1,2,3,4,5]',
    output: '[5,4,3,2,1]',
    example: 'Reversing 1 -> 2 -> 3 -> null gives 3 -> 2 -> 1 -> null.',
    explanation: 'Iterate through the linked list with three pointers: prev (initially null), curr (initially head), and nextTemp. At each step, point curr.next to prev, advance prev to curr, and advance curr to nextTemp.',
    hint: 'Keep track of three pointers: previous node, current node, and next node.',
    starterCode: {
      javascript: `function reverseList(head) {
  // Your code here
}`,
      python: `def reverse_list(head):
    # Your code here
    pass`,
    },
    solution: `// Time Complexity: O(N) | Space Complexity: O(1)
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    relatedProblems: ['reverse-linked-list-ii', 'palindrome-linked-list'],
  },
  {
    id: 'trapping-rain-water',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    languages: ['JavaScript', 'Python', 'C++'],
    acceptance: '61%',
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    output: '6',
    example: 'The elevation map traps 6 units of rain water between peaks.',
    explanation: 'Water trapped above any bar is determined by min(maxHeightToLeft, maxHeightToRight) - height[i]. Using two pointers from left and right converging toward the center allows O(N) time with O(1) space.',
    hint: 'Use two pointers from left and right edges. Keep track of leftMax and rightMax height seen so far.',
    starterCode: {
      javascript: `function trap(height) {
  // Your code here
}`,
    },
    solution: `// Time Complexity: O(N) | Space Complexity: O(1)
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
}`,
    relatedProblems: ['container-with-most-water', 'largest-rectangle-in-histogram'],
  },
];

export const codeLibrary = {
  algorithms: [
    {
      title: 'Binary Search (Iterative)',
      category: 'Searching',
      code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
    {
      title: 'QuickSort (In-Place)',
      category: 'Sorting',
      code: `function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}`,
    },
  ],
  templates: [
    {
      title: 'Sliding Window Template',
      category: 'Patterns',
      code: `function slidingWindowTemplate(arr, k) {
  let windowStart = 0;
  let currentWindowValue = 0;
  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    // Add current element to window
    currentWindowValue += arr[windowEnd];
    
    if (windowEnd >= k - 1) {
      // Process window result
      // Remove outgoing element from start
      currentWindowValue -= arr[windowStart];
      windowStart++;
    }
  }
}`,
    },
    {
      title: 'BFS Graph Traversal Template',
      category: 'Graph',
      code: `function bfs(graph, startNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);

  while (queue.length > 0) {
    const current = queue.shift();
    console.log("Visited:", current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    },
  ],
};
