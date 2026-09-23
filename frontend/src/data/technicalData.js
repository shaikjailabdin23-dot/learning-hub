export const technicalCategories = [
  'All',
  'Programming Fundamentals',
  'Web Development',
  'DSA',
  'Databases',
  'Operating Systems',
  'Computer Networks',
  'AI & ML',
  'Software Engineering',
];

export const technicalTopics = [
  // 1. Programming Fundamentals
  {
    id: 'programming-basics',
    slug: 'programming-basics',
    title: 'Programming Basics & How Code Executes',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    description: 'Understand how source code transforms into binary machine instructions and runs on hardware.',
    whatIsIt: 'Programming is the process of writing instructions that tell a computer how to perform tasks, solve problems, and process data.',
    whyLearnIt: 'It forms the bedrock of all software development, automation, and computer technology.',
    simpleExplanation: 'Just like writing a cooking recipe with ingredients and steps, coding is writing an exact recipe for a computer to follow step-by-step.',
    realWorldExample: 'A digital microwave reading the keypad input (2 minutes), counting down seconds, and beeping when finished.',
    whereUsed: 'Every smartphone, website, spaceship, and microwave controller.',
    keyPoints: [
      'Compilers translate high-level code directly to binary beforehand (C++, Rust)',
      'Interpreters execute code line-by-line in real time (Python, JavaScript)',
      'Algorithms are step-by-step procedures; code is the language implementation',
    ],
    advantages: ['Enables logical problem-solving', 'Automates repetitive manual tasks', 'High global career demand'],
    commonMistakes: ['Skipping logical design and jumping straight to syntax', 'Not reading compiler error messages'],
    codeExample: {
      language: 'javascript',
      code: `// The quintessential first program
function sayHello(studentName) {
  console.log("Welcome to Hub Learning, " + studentName + "!");
}

sayHello("Engineer");`,
      explanation: 'A simple function receiving an argument and displaying a greeting to the developer console.',
    },
    practiceQuestions: [
      {
        question: 'What is the primary difference between a compiled language and an interpreted language?',
        hint: 'Machine code vs line-by-line.',
        answer: 'Compiled code is converted to machine code before execution, running faster; interpreted code is evaluated line-by-line at runtime.',
      },
    ],
    relatedTopics: ['variables-and-data-types', 'operators-and-conditions', 'functions-and-oop'],
  },
  {
    id: 'variables-and-data-types',
    slug: 'variables-and-data-types',
    title: 'Variables & Data Types',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    description: 'Learn how computers store, declare, and interpret data using variables and foundational types.',
    whatIsIt: 'Variables are named memory storage locations. Data types specify what kind of value a variable holds.',
    whyLearnIt: 'Without variables, programs cannot remember inputs, calculate results, or maintain state.',
    simpleExplanation: 'Lego storage boxes: a box labeled "Score" holds numbers, a box labeled "Name" holds letters.',
    realWorldExample: 'A banking mobile app storing your account balance as a float and your account name as a string.',
    whereUsed: 'Ubiquitous across all programming languages.',
    keyPoints: [
      'Primitive types: Number, String, Boolean, Null, Undefined, BigInt, Symbol',
      'Reference types: Objects, Arrays, Functions',
      'const prevents reassignment; let allows updates',
    ],
    advantages: ['Organizes application memory', 'Promotes code reuse', 'Enhances program safety'],
    commonMistakes: ['Confusing = (assignment) with === (strict equality)', 'Using uninitialized variables'],
    codeExample: {
      language: 'javascript',
      code: `const platform = "Hub Learning";
let activeUsers = 12500;
const isLive = true;

console.log(\`\${platform} has \${activeUsers} active learners.\`);`,
      explanation: 'Declares constant strings and boolean flags alongside mutable integer counters.',
    },
    practiceQuestions: [
      {
        question: 'Why is "const" preferred over "let" when a value never changes?',
        hint: 'Code predictability.',
        answer: 'It communicates developer intent clearly and prevents accidental reassignment bugs.',
      },
    ],
    relatedTopics: ['programming-basics', 'operators-and-conditions', 'functions-and-oop'],
  },
  {
    id: 'operators-and-conditions',
    slug: 'operators-and-conditions',
    title: 'Operators, Conditions & Control Flow',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    description: 'Direct the flow of execution using arithmetic, logical operators, and if-else / switch branching.',
    whatIsIt: 'Control flow structures evaluate boolean expressions to decide which code paths to execute.',
    whyLearnIt: 'Real-world software must make smart decisions based on varied user actions and edge cases.',
    simpleExplanation: 'Traffic lights: IF the light is green, proceed. ELSE IF yellow, slow down. ELSE, stop.',
    realWorldExample: 'An ATM checking if your requested withdrawal amount is less than or equal to your bank balance.',
    whereUsed: 'User authentication gates, shopping cart discounts, game logic.',
    keyPoints: [
      'Logical operators: AND (&&), OR (||), NOT (!)',
      'Ternary operator: condition ? exprIfTrue : exprIfFalse',
      'Short-circuit evaluation in boolean logic',
    ],
    advantages: ['Makes programs responsive to diverse scenarios', 'Prevents invalid state execution'],
    commonMistakes: ['Accidentally assigning with = inside an if statement', 'Missing break in switch statements'],
    codeExample: {
      language: 'javascript',
      code: `const userScore = 85;
const passingScore = 70;

if (userScore >= 90) {
  console.log("Grade: Outstanding Distinction");
} else if (userScore >= passingScore) {
  console.log("Grade: Pass with Merit");
} else {
  console.log("Please retake the quiz module");
}`,
      explanation: 'Conditional branching evaluating exam score boundaries.',
    },
    practiceQuestions: [
      {
        question: 'What is short-circuit evaluation in boolean expressions?',
        hint: 'When does the second operand not get evaluated?',
        answer: 'In A && B, if A is false, B is not evaluated. In A || B, if A is true, B is not evaluated.',
      },
    ],
    relatedTopics: ['variables-and-data-types', 'loops-and-iteration'],
  },
  {
    id: 'loops-and-iteration',
    slug: 'loops-and-iteration',
    title: 'Loops & Iterative Processing',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    description: 'Harness repetition with for, while, do-while, and higher-order iteration methods.',
    whatIsIt: 'Loops repeat a block of code as long as a specified condition remains true.',
    whyLearnIt: 'Computers excel at repeating computations millions of times without fatigue or mistakes.',
    simpleExplanation: 'Like running laps around a track: "Run another lap while lapCount < 10".',
    realWorldExample: 'Calculating the total sum of 50 items in an Amazon shopping cart.',
    whereUsed: 'Data transformations, graphics rendering loops, batch data processing.',
    keyPoints: ['Always ensure loop termination condition to prevent infinite loops', 'Use map/filter/reduce for functional purity'],
    advantages: ['Eliminates manual duplicate code', 'Handles datasets of any length dynamically'],
    commonMistakes: ['Infinite loops freezing the browser/server', 'Off-by-one errors with index <= array.length'],
    codeExample: {
      language: 'javascript',
      code: `const scores = [80, 92, 75, 88, 95];
let sum = 0;

for (let i = 0; i < scores.length; i++) {
  sum += scores[i];
}
const average = sum / scores.length;
console.log("Class Average:", average);`,
      explanation: 'Standard for-loop iterating over an array to compute an aggregate metric.',
    },
    practiceQuestions: [{ question: 'What causes an infinite loop?', hint: 'Condition.', answer: 'When the loop condition never evaluates to false.' }],
    relatedTopics: ['operators-and-conditions', 'functions-and-oop'],
  },
  {
    id: 'functions-and-oop',
    slug: 'functions-and-oop',
    title: 'Functions & Object-Oriented Programming (OOP)',
    category: 'Programming Fundamentals',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    description: 'Organize complex software using modular functions, Classes, Encapsulation, Inheritance, and Polymorphism.',
    whatIsIt: 'OOP is a paradigm based on "objects" containing data and behavior. Functions encapsulate reusable logic.',
    whyLearnIt: 'Large enterprise software codebases require structured patterns to remain maintainable.',
    simpleExplanation: 'A blueprint for a car (Class) defining speed and color; individual manufactured cars are Objects.',
    realWorldExample: 'A university system with a Student class inheriting common fields from a Person base class.',
    whereUsed: 'Java, C++, Python, TypeScript backend frameworks, game development engines.',
    keyPoints: [
      'Encapsulation: Bundling data and methods while restricting direct access',
      'Inheritance: Subclasses inherit parent properties and methods',
      'Polymorphism: Methods can take multiple forms through overriding',
      'Abstraction: Hiding complex internal implementation details',
    ],
    advantages: ['Prevents spaghetti code', 'High code reusability via inheritance'],
    commonMistakes: ['Deep, brittle inheritance hierarchies', 'Violating single responsibility principles'],
    codeExample: {
      language: 'javascript',
      code: `class Student {
  constructor(name, major) {
    this.name = name;
    this.major = major;
    this.completedCredits = 0;
  }

  addCredits(credits) {
    this.completedCredits += credits;
    return this.completedCredits;
  }
}

const alex = new Student("Alex", "Computer Science");
alex.addCredits(15);
console.log(alex.name, alex.completedCredits);`,
      explanation: 'Defines an ES6 Class with constructor and instance methods.',
    },
    practiceQuestions: [{ question: 'What is Encapsulation?', hint: 'Private fields.', answer: 'The bundling of data with methods that operate on that data, restricting direct access from outside.' }],
    relatedTopics: ['programming-basics', 'react-fundamentals'],
  },

  // 2. Web Development
  {
    id: 'react-fundamentals',
    slug: 'react-fundamentals',
    title: 'React Fundamentals & Component Architecture',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    description: 'Understand modern React: component lifecycle, hooks (useState, useEffect), props, and the Virtual DOM.',
    whatIsIt: 'React is a declarative, component-based JavaScript library for building fast and interactive user interfaces.',
    whyLearnIt: 'React powers the frontend of modern industry leaders and is the most popular frontend tool worldwide.',
    simpleExplanation: 'Building modular Lego blocks (Navbar, Card, Button) and assembling them into interactive web apps.',
    realWorldExample: 'Netflix or Spotify web apps where clicking music tracks plays songs seamlessly without page reloads.',
    whereUsed: 'Web apps, enterprise dashboards, e-commerce, mobile apps with React Native.',
    keyPoints: [
      'Virtual DOM reconciles changes efficiently using a diffing algorithm',
      'Props pass data downward; state holds dynamic local component data',
      'Hooks (useState, useEffect, useContext) bring state and effects to functional components',
    ],
    advantages: ['Predictable declarative code', 'Massive open-source ecosystem', 'High industry employment demand'],
    commonMistakes: ['Directly mutating state instead of using setter functions', 'Omitting useEffect dependency arrays'],
    codeExample: {
      language: 'jsx',
      code: `import React, { useState } from 'react';

function LikeCounter() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)} className="like-btn">
      👍 Likes: {likes}
    </button>
  );
}`,
      explanation: 'Functional component using useState hook for interactive reactive button click increments.',
    },
    practiceQuestions: [{ question: 'Why does React use a Virtual DOM?', hint: 'Performance.', answer: 'To batch updates and avoid slow direct manipulation of the browser DOM.' }],
    relatedTopics: ['functions-and-oop', 'rest-apis-and-node'],
  },
  {
    id: 'rest-apis-and-node',
    slug: 'rest-apis-and-node',
    title: 'Node.js, Express & REST API Architecture',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    description: 'Build robust backend HTTP services with Express, routing, middleware, and standard REST conventions.',
    whatIsIt: 'Node.js runs JavaScript on the server. Express is a minimalist web framework for building RESTful APIs.',
    whyLearnIt: 'Full-stack developers must connect user interfaces with backend databases and business logic.',
    simpleExplanation: 'A waiter in a restaurant: taking your order (request), bringing it to the kitchen (server/database), and returning food (JSON response).',
    realWorldExample: 'Uber app sending your GPS coordinates to a server and receiving nearby driver locations in response.',
    whereUsed: 'Microservices, backend APIs, real-time servers, IoT backends.',
    keyPoints: [
      'REST HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)',
      'Statelessness: Each request carries all necessary credentials and data',
      'Middleware intercepts and processes requests (logging, CORS, authentication)',
    ],
    advantages: ['Single language (JavaScript) across entire stack', 'Non-blocking I/O event loop handles high concurrency'],
    commonMistakes: ['Forgetting to call next() in custom middleware', 'Not returning responses in error handling blocks'],
    codeExample: {
      language: 'javascript',
      code: `const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/greeting', (req, res) => {
  res.json({ message: "Hello from Express REST API!" });
});`,
      explanation: 'Minimal Express server defining a GET endpoint and returning JSON data.',
    },
    practiceQuestions: [{ question: 'What does idempotent mean in REST?', hint: 'Same outcome multiple times.', answer: 'An operation produces the same result no matter how many times it is executed (e.g., GET, PUT, DELETE).' }],
    relatedTopics: ['react-fundamentals', 'mongodb-and-database-design'],
  },

  // 3. Data Structures & Algorithms
  {
    id: 'arrays-and-dp-essentials',
    slug: 'arrays-and-dp-essentials',
    title: 'Arrays & Dynamic Programming Essentials',
    category: 'Data Structures & Algorithms',
    difficulty: 'Advanced',
    estimatedTime: '45 mins',
    description: 'Master array memory representations, two-pointer techniques, and memoization / tabulation DP.',
    whatIsIt: 'Arrays are linear data structures storing elements in contiguous memory. Dynamic Programming optimizes overlapping subproblems.',
    whyLearnIt: 'Core foundation for technical coding interviews at top tech companies.',
    simpleExplanation: 'Remembering what you already computed so you never waste time recalculating it.',
    realWorldExample: 'GPS navigation computing the shortest travel route across thousands of road intersections.',
    whereUsed: 'Search engines, game AI, bioinformatics, resource scheduling.',
    keyPoints: [
      'O(1) index access time due to contiguous memory allocation',
      'Two-pointer & sliding window patterns reduce O(N^2) algorithms to O(N)',
      'Memoization (top-down) vs Tabulation (bottom-up)',
    ],
    advantages: ['Optimal runtime and space efficiency', 'Solves high-complexity combinatorial problems'],
    commonMistakes: ['Array index out of bounds exceptions', 'Incorrect DP base cases'],
    codeExample: {
      language: 'javascript',
      code: `// Two-Sum problem using Hash Map in O(N) time
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      explanation: 'Solves the classic Two Sum interview problem in linear O(N) time using a hash map lookup.',
    },
    practiceQuestions: [{ question: 'What is the time complexity of searching an unsorted array vs a hash table?', hint: 'O(N) vs O(1).', answer: 'Unsorted array search is O(N) linear time; Hash table search is O(1) average constant time.' }],
    relatedTopics: ['programming-basics', 'react-fundamentals'],
  },

  // 4. Databases
  {
    id: 'mongodb-and-database-design',
    slug: 'mongodb-and-database-design',
    title: 'Database Design & MongoDB CRUD',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    description: 'Explore document-oriented NoSQL databases, Mongoose schema modeling, and CRUD operations.',
    whatIsIt: 'MongoDB is a document database storing records as flexible, JSON-like BSON documents.',
    whyLearnIt: 'Modern web applications require flexible, developer-friendly data storage that scales horizontally.',
    simpleExplanation: 'Like storing categorized folders in a filing cabinet instead of rigid spreadsheet rows.',
    realWorldExample: 'An online store storing customer profiles, cart items, and shipping addresses in structured documents.',
    whereUsed: 'Full-stack applications (MERN stack), content management, analytics platforms.',
    keyPoints: [
      'Collections correspond to tables; documents correspond to rows',
      'Mongoose schema enforces validation and provides middleware lifecycle hooks',
      'Indexing enables fast lookups without full collection scans',
    ],
    advantages: ['High developer velocity with JSON formats', 'Horizontal scaling through sharding'],
    commonMistakes: ['Over-embedding unbounded arrays exceeding 16MB document limit'],
    codeExample: {
      language: 'javascript',
      code: `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
});

const UserModel = mongoose.model('User', UserSchema);`,
      explanation: 'Defines a Mongoose Schema with required validation rules and unique constraints.',
    },
    practiceQuestions: [{ question: 'What is the difference between SQL and NoSQL?', hint: 'Tables vs documents.', answer: 'SQL uses structured tables with predefined schemas; NoSQL uses flexible documents, key-values, or graphs.' }],
    relatedTopics: ['rest-apis-and-node', 'cybersecurity-authentication-jwt'],
  },

  // 5. Computer Networks
  {
    id: 'computer-networks-osi-http',
    slug: 'computer-networks-osi-http',
    title: 'Computer Networks: OSI Model & HTTP/HTTPS',
    category: 'Computer Networks',
    difficulty: 'Beginner',
    estimatedTime: '25 mins',
    description: 'Understand packet travel across the globe: 7-layer OSI model, TCP vs UDP, DNS, and TLS.',
    whatIsIt: 'Networking connects computers to exchange data reliably using standardized protocols.',
    whyLearnIt: 'Every API request and cloud service relies on network transport principles.',
    simpleExplanation: 'Sending a letter: packaging, addressing, postal sorting, truck delivery, and mailbox receipt.',
    realWorldExample: 'Streaming a live football match via UDP for low latency vs downloading a bank PDF via TCP for zero loss.',
    whereUsed: 'Internet infrastructure, web browsers, telecom, server clusters.',
    keyPoints: [
      '7 OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application',
      'TCP guarantees ordered reliable delivery; UDP emphasizes low-latency speed',
      'HTTPS uses TLS encryption to protect passwords and data from eavesdropping',
    ],
    advantages: ['Universal device interoperability', 'Encrypted secure communications'],
    commonMistakes: ['Transmitting sensitive passwords over plain unencrypted HTTP'],
    codeExample: {
      language: 'bash',
      code: `# Test latency and connection to server
ping -c 4 google.com
# Check DNS resolution
nslookup google.com`,
      explanation: 'Terminal commands verifying network connectivity and IP address resolution.',
    },
    practiceQuestions: [{ question: 'Why does video streaming often use UDP instead of TCP?', hint: 'Speed vs dropped packets.', answer: 'UDP has no handshake overhead or retransmission delays, allowing real-time playback even if minor packets drop.' }],
    relatedTopics: ['cybersecurity-authentication-jwt', 'cloud-computing-aws-docker'],
  },

  // 6. Operating Systems
  {
    id: 'operating-systems-concurrency',
    slug: 'operating-systems-concurrency',
    title: 'Operating Systems: Processes, Threads & Concurrency',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    description: 'Deep dive into OS kernels: process scheduling, virtual memory, threads, race conditions, and deadlocks.',
    whatIsIt: 'An Operating System manages computer hardware resources (CPU, RAM, disk) and executes software programs.',
    whyLearnIt: 'Crucial for writing high-performance backend systems and debugging memory leaks.',
    simpleExplanation: 'A factory manager scheduling machines and distributing materials so workers can build products efficiently.',
    realWorldExample: 'A smartphone smoothly playing background music while you browse Instagram and receive messages.',
    whereUsed: 'Linux, Windows, macOS, Android, iOS, cloud hypervisors.',
    keyPoints: [
      'Processes have isolated memory spaces; threads within a process share memory',
      'Race conditions occur when threads concurrently modify shared memory without locks',
      'Deadlocks happen when processes block waiting for resources held by each other',
    ],
    advantages: ['Prevents rogue programs from crashing the entire system', 'Maximizes CPU utilization'],
    commonMistakes: ['Neglecting mutexes and thread synchronization in multithreaded code'],
    codeExample: {
      language: 'c',
      code: `// Creating a child process in C using fork()
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Hello from Child Process!\\n");
    } else {
        printf("Hello from Parent Process!\\n");
    }
    return 0;
}`,
      explanation: 'Demonstrates creating an isolated child process via the Unix fork() system call.',
    },
    practiceQuestions: [{ question: 'What is a mutex?', hint: 'Mutual exclusion lock.', answer: 'A synchronization primitive that ensures only one thread enters a critical section at a time.' }],
    relatedTopics: ['computer-networks-osi-http', 'cloud-computing-aws-docker'],
  },

  // 7. Cybersecurity
  {
    id: 'cybersecurity-authentication-jwt',
    slug: 'cybersecurity-authentication-jwt',
    title: 'Cybersecurity: Authentication, JWT & Encryption',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    description: 'Secure applications: bcrypt password hashing, JSON Web Tokens (JWT), CORS, XSS, CSRF, and encryption.',
    whatIsIt: 'Cybersecurity safeguards digital systems, networks, and confidential data from unauthorized access or damage.',
    whyLearnIt: 'Security breaches ruin company reputations and inflict devastating financial penalties.',
    simpleExplanation: 'A digital passport with holographic security seals that border control can verify instantly.',
    realWorldExample: 'Multi-factor authentication protecting your university email and Google account.',
    whereUsed: 'User authentication, banking portals, e-commerce checkouts, encrypted chat apps.',
    keyPoints: [
      'Never store plaintext passwords; use salted hashes with bcrypt',
      'JWT contains Header, Payload, and Signature, enabling stateless auth',
      'HTTPS protects data in transit; AES encrypts sensitive data at rest',
    ],
    advantages: ['Guarantees user privacy and account security', 'Protects against data tampering'],
    commonMistakes: ['Storing secret API keys in public GitHub repositories', 'Storing passwords in plaintext'],
    codeExample: {
      language: 'javascript',
      code: `const bcrypt = require('bcryptjs');

async function securePassword(plainText) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
}`,
      explanation: 'Hashes a password with cryptographically secure salt before saving to a database.',
    },
    practiceQuestions: [{ question: 'What is the purpose of salt in password hashing?', hint: 'Rainbow tables.', answer: 'To ensure identical passwords produce unique hashes, rendering rainbow table lookups ineffective.' }],
    relatedTopics: ['rest-apis-and-node', 'mongodb-and-database-design'],
  },

  // 8. Cloud Computing
  {
    id: 'cloud-computing-aws-docker',
    slug: 'cloud-computing-aws-docker',
    title: 'Cloud Computing: AWS, Containers & Serverless',
    category: 'Cloud Computing',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    description: 'Discover scalable infrastructure: IaaS vs PaaS vs SaaS, Docker containers, Kubernetes, and AWS primitives.',
    whatIsIt: 'Cloud computing delivers on-demand IT resources (compute, storage, databases) over the internet with pay-as-you-go pricing.',
    whyLearnIt: 'Modern software is deployed almost entirely in cloud environments like AWS, Google Cloud, and Azure.',
    simpleExplanation: 'Renting electricity from the city grid rather than buying and fueling your own private generator.',
    realWorldExample: 'Netflix scaling up thousands of virtual server containers during evening peak streaming hours.',
    whereUsed: 'Modern software deployments, DevOps, automated CI/CD pipelines.',
    keyPoints: [
      'Docker packages applications and dependencies into reproducible containers',
      'Serverless (e.g. AWS Lambda) runs code on-demand without managing server instances',
      'Cloud storage (S3) provides durable, infinitely scalable object storage',
    ],
    advantages: ['Zero upfront hardware costs', 'Instant global scalability and automated backups'],
    commonMistakes: ['Leaving AWS S3 buckets public', 'Running production containers as root'],
    codeExample: {
      language: 'dockerfile',
      code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]`,
      explanation: 'Standard Dockerfile building a lightweight, production-ready Node.js container image.',
    },
    practiceQuestions: [{ question: 'What is the key benefit of containerization with Docker?', hint: 'It works on my machine.', answer: 'Containers guarantee software runs identically in any environment by packaging dependencies and runtime together.' }],
    relatedTopics: ['operating-systems-concurrency', 'rest-apis-and-node'],
  },

  // 9. AI & Machine Learning
  {
    id: 'ai-and-machine-learning-foundations',
    slug: 'ai-and-machine-learning-foundations',
    title: 'AI & Machine Learning Foundations',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    description: 'Demystify artificial intelligence: supervised vs unsupervised learning, neural networks, loss functions, and LLMs.',
    whatIsIt: 'Machine Learning trains algorithms on datasets to recognize patterns and make decisions without explicit step-by-step rules.',
    whyLearnIt: 'AI is fundamentally reshaping technology, medicine, automation, and software engineering.',
    simpleExplanation: 'Showing a child 1,000 pictures of dogs and cats until they can instantly identify any new dog or cat on their own.',
    realWorldExample: 'Spam filters detecting suspicious emails or voice assistants recognizing spoken speech in noisy rooms.',
    whereUsed: 'Autonomous vehicles, search engines, recommendation systems, medical imaging, Generative AI.',
    keyPoints: [
      'Supervised learning trains on labeled data (classification, regression)',
      'Unsupervised learning discovers hidden patterns in unlabeled data (clustering)',
      'Deep Learning uses multilayer neural networks inspired by biological neurons',
    ],
    advantages: ['Solves complex non-linear problems beyond human rule-writing capability', 'Improves over time with more data'],
    commonMistakes: ['Overfitting model to training noise', 'Training on biased or unrepresentative data'],
    codeExample: {
      language: 'python',
      code: `# Predict exam score with linear regression
from sklearn.linear_model import LinearRegression
import numpy as np

hours = np.array([[1], [2], [3], [4], [5]])
scores = np.array([50, 62, 74, 85, 96])

model = LinearRegression()
model.fit(hours, scores)
print("Predicted score for 6 hours:", model.predict([[6]])[0])`,
      explanation: 'Trains a linear regression model in Python to predict future values from historical data.',
    },
    practiceQuestions: [{ question: 'What is the purpose of a loss function in machine learning?', hint: 'Error measurement.', answer: 'It quantifies the error between the model predictions and actual ground truth, guiding weight updates.' }],
    relatedTopics: ['arrays-and-dp-essentials', 'cloud-computing-aws-docker'],
  },
];
