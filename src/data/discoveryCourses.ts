import { DiscoveryCourse } from '@/types/discovery';

export const DISCOVERY_COURSES: DiscoveryCourse[] = [
  {
    id: 'java',
    name: 'Java Programming',
    icon: '☕',
    tagline: 'Object-Oriented Programming & JVM Fundamentals',
    totalReels: 5,
    reels: [
      {
        id: 'java-1',
        title: 'Reel 1 — Introduction to Java & JVM',
        duration: '01:45',
        videoUrl: '/videos/java-reels/java-01.mp4',
        description: 'Understand JVM architecture, byte-code compilation, and platform independence in Java.',
        question: {
          text: 'What is the main purpose of a constructor in Java?',
          options: [
            'To destroy an object',
            'To initialize an object',
            'To inherit a class',
            'To create an interface'
          ],
          correctAnswer: 1,
          explanation: 'A constructor is a special method that is automatically called when an object is created. It is mainly used to initialize the object\'s data members.'
        }
      },
      {
        id: 'java-2',
        title: 'Reel 2 — Variables and Data Types',
        duration: '01:30',
        videoUrl: '/videos/java-reels/java-02.mp4',
        description: 'Explore primitive data types, wrapper classes, reference types, and type casting rules in Java.',
        question: {
          text: 'Which keyword is used to declare a constant variable in Java?',
          options: [
            'const',
            'static',
            'final',
            'immutable'
          ],
          correctAnswer: 2,
          explanation: 'The "final" keyword in Java is used to declare constants. Once initialized, its value cannot be modified.'
        }
      },
      {
        id: 'java-3',
        title: 'Reel 3 — Operators and Expressions',
        duration: '01:50',
        videoUrl: '/videos/java-reels/java-03.mp4',
        description: 'Learn arithmetic, logical, bitwise, and ternary operators with precedence rules.',
        question: {
          text: 'What does the modulus operator (%) return in Java?',
          options: [
            'Quotient of division',
            'Remainder of division',
            'Product of numbers',
            'Exponential value'
          ],
          correctAnswer: 1,
          explanation: 'The modulus operator (%) returns the integer remainder of dividing the left operand by the right operand.'
        }
      },
      {
        id: 'java-4',
        title: 'Reel 4 — Control Statements',
        duration: '02:00',
        videoUrl: '/videos/java-reels/java-04.mp4',
        description: 'Master if-else branching, switch statements, and pattern matching in modern Java.',
        question: {
          text: 'Which statement is used to immediately exit a loop in Java?',
          options: [
            'continue',
            'break',
            'return',
            'exit'
          ],
          correctAnswer: 1,
          explanation: 'The "break" statement immediately terminates the loop execution and transfers control to the statement following the loop.'
        }
      },
      {
        id: 'java-5',
        title: 'Reel 5 — Loops and Iteration',
        duration: '01:40',
        videoUrl: '/videos/java-reels/java-05.mp4',
        description: 'Compare for, while, do-while, and enhanced for-each loops for processing collections.',
        question: {
          text: 'Which loop is guaranteed to execute its body at least once?',
          options: [
            'for loop',
            'while loop',
            'do-while loop',
            'for-each loop'
          ],
          correctAnswer: 2,
          explanation: 'The "do-while" loop evaluates its condition after executing the loop body, guaranteeing at least one execution.'
        }
      }
    ]
  },
  {
    id: 'python',
    name: 'Python Basics',
    icon: '🐍',
    tagline: 'Syntax, Data Structures & Scripting Secrets',
    totalReels: 5,
    reels: [
      {
        id: 'python-1',
        title: 'Reel 1 — Introduction to Python',
        duration: '01:25',
        videoUrl: '/videos/python-reels/python-01.mp4',
        description: 'Learn dynamic typing, indentation rules, and why Python is the leading language for automation and AI.',
        question: {
          text: 'How is code block scoping defined in Python?',
          options: [
            'Curly braces {}',
            'Indentation (whitespace)',
            'Begin and End keywords',
            'Parentheses ()'
          ],
          correctAnswer: 1,
          explanation: 'Python uses indentation (whitespace) to delimit code blocks rather than curly braces or keywords.'
        }
      },
      {
        id: 'python-2',
        title: 'Reel 2 — Python Lists and Tuples',
        duration: '01:35',
        videoUrl: '/videos/python-reels/python-02.mp4',
        description: 'Understand mutable lists versus immutable tuples and list comprehension syntax.',
        question: {
          text: 'What is the key difference between a List and a Tuple in Python?',
          options: [
            'Lists are immutable, Tuples are mutable',
            'Lists are mutable, Tuples are immutable',
            'Tuples can only store numbers',
            'Lists cannot be indexed'
          ],
          correctAnswer: 1,
          explanation: 'Lists are mutable (elements can be added/modified), whereas Tuples are immutable (cannot be changed after creation).'
        }
      },
      {
        id: 'python-3',
        title: 'Reel 3 — Dictionaries and Sets',
        duration: '01:45',
        videoUrl: '/videos/python-reels/python-03.mp4',
        description: 'Key-value mapping with Dictionaries and set operations for fast membership testing.',
        question: {
          text: 'What is the average time complexity for searching a key in a Python dictionary?',
          options: [
            'O(N)',
            'O(N log N)',
            'O(1)',
            'O(N^2)'
          ],
          correctAnswer: 2,
          explanation: 'Python dictionaries are implemented using hash tables, giving them O(1) average time complexity for key lookup.'
        }
      },
      {
        id: 'python-4',
        title: 'Reel 4 — Functions and Lambda Expressions',
        duration: '01:55',
        videoUrl: '/videos/python-reels/python-04.mp4',
        description: 'Define clean modular functions, default parameters, *args, **kwargs, and inline lambda functions.',
        question: {
          text: 'Which keyword is used to create an anonymous inline function in Python?',
          options: [
            'def',
            'func',
            'lambda',
            'inline'
          ],
          correctAnswer: 2,
          explanation: 'The "lambda" keyword is used to define small, anonymous, single-expression functions in Python.'
        }
      },
      {
        id: 'python-5',
        title: 'Reel 5 — File Handling & Modules',
        duration: '01:40',
        videoUrl: '/videos/python-reels/python-05.mp4',
        description: 'Read and write files safely using context managers (with open) and import external modules.',
        question: {
          text: 'What is the advantage of using the "with open(...)" statement in Python?',
          options: [
            'It accelerates file reading speed 10x',
            'It automatically closes the file after the block completes',
            'It encrypts the text content',
            'It converts files to JSON format'
          ],
          correctAnswer: 1,
          explanation: 'The "with" statement acts as a context manager that guarantees the file handle is properly closed even if exceptions occur.'
        }
      }
    ]
  },
  {
    id: 'aptitude',
    name: 'Aptitude & Logical Reasoning',
    icon: '💡',
    tagline: 'Quantitative Reasoning, Speed Math & Placement Logic',
    totalReels: 5,
    reels: [
      {
        id: 'aptitude-1',
        title: 'Reel 1 — Quantitative Reasoning & Numbers',
        duration: '01:45',
        videoUrl: '/videos/aptitude-reels/aptitude-01.mp4',
        description: 'Shortcuts for prime factorization, divisibility rules, and HCF/LCM problem solving.',
        question: {
          text: 'What is the LCM of two co-prime numbers A and B?',
          options: [
            '1',
            'A + B',
            'A * B',
            'A / B'
          ],
          correctAnswer: 2,
          explanation: 'Since co-prime numbers share no common prime factors other than 1, their Least Common Multiple (LCM) is simply their product (A * B).'
        }
      },
      {
        id: 'aptitude-2',
        title: 'Reel 2 — Speed Math & Percentage Tricks',
        duration: '01:30',
        videoUrl: '/videos/aptitude-reels/aptitude-02.mp4',
        description: 'Calculate percentages in your head, fraction-to-percentage conversion tables, and ratio balances.',
        question: {
          text: 'If a value increases by 20% and then decreases by 20%, what is the net percentage change?',
          options: [
            '0% change',
            '4% increase',
            '4% decrease',
            '2% decrease'
          ],
          correctAnswer: 2,
          explanation: 'Successive percentage change formula: net change = +20 - 20 - (20*20)/100 = -4%. The net result is a 4% decrease.'
        }
      },
      {
        id: 'aptitude-3',
        title: 'Reel 3 — Time, Speed & Distance Fundamentals',
        duration: '01:50',
        videoUrl: '/videos/aptitude-reels/aptitude-03.mp4',
        description: 'Relative speed calculations, trains crossing platforms, and average speed formulas.',
        question: {
          text: 'What is the average speed of a journey covering equal distances at speeds S1 and S2?',
          options: [
            '(S1 + S2) / 2',
            '(2 * S1 * S2) / (S1 + S2)',
            'S1 * S2',
            '(S1 - S2) / 2'
          ],
          correctAnswer: 1,
          explanation: 'The harmonic mean formula (2 * S1 * S2) / (S1 + S2) yields the exact average speed for equal distance legs.'
        }
      },
      {
        id: 'aptitude-4',
        title: 'Reel 4 — Profit, Loss & Discount Strategy',
        duration: '02:00',
        videoUrl: '/videos/aptitude-reels/aptitude-04.mp4',
        description: 'Marked price versus cost price, successive discounts, and dishonest dealer problems.',
        question: {
          text: 'If Cost Price = $100 and Selling Price = $125, what is the profit percentage?',
          options: [
            '20%',
            '25%',
            '30%',
            '15%'
          ],
          correctAnswer: 1,
          explanation: 'Profit % = [(Selling Price - Cost Price) / Cost Price] * 100 = [(125 - 100) / 100] * 100 = 25%.'
        }
      },
      {
        id: 'aptitude-5',
        title: 'Reel 5 — Logical Deduction & Series Completion',
        duration: '01:40',
        videoUrl: '/videos/aptitude-reels/aptitude-05.mp4',
        description: 'Pattern recognition in number series, syllogisms, and seating arrangement logic.',
        question: {
          text: 'What is the next number in the series: 2, 6, 12, 20, 30, ...?',
          options: [
            '36',
            '40',
            '42',
            '48'
          ],
          correctAnswer: 2,
          explanation: 'The pattern adds increasing even numbers: +4, +6, +8, +10, +12. So 30 + 12 = 42.'
        }
      }
    ]
  },
  {
    id: 'webdev',
    name: 'Web Development',
    icon: '🌐',
    tagline: 'HTML5, Modern CSS Layouts & JavaScript ES6+',
    totalReels: 5,
    reels: [
      {
        id: 'web-1',
        title: 'Reel 1 — HTML5 Semantic Markup',
        duration: '01:30',
        videoUrl: '/videos/java-reels/java-06.mp4',
        description: 'Build accessible web structures using header, nav, main, section, article, and footer tags.',
        question: {
          text: 'Which HTML5 element should be used for the primary site navigation links?',
          options: [
            '<menu>',
            '<navigation>',
            '<nav>',
            '<links>'
          ],
          correctAnswer: 2,
          explanation: 'The <nav> semantic HTML element is specifically intended for major navigation block links.'
        }
      },
      {
        id: 'web-2',
        title: 'Reel 2 — Flexbox & CSS Grid Masters',
        duration: '01:50',
        videoUrl: '/videos/assets/whatsapp-home-reel.mp4',
        description: 'Create responsive 1D flex layouts and 2D grid systems without complex media query bloat.',
        question: {
          text: 'Which CSS Flexbox property aligns flex items along the main axis?',
          options: [
            'align-items',
            'justify-content',
            'flex-direction',
            'align-content'
          ],
          correctAnswer: 1,
          explanation: 'The "justify-content" property aligns flex items along the main axis of the flex container.'
        }
      },
      {
        id: 'web-3',
        title: 'Reel 3 — JavaScript DOM Manipulation',
        duration: '01:40',
        videoUrl: '/videos/java-reels/java-01.mp4',
        description: 'Query elements, attach event listeners, mutate class lists, and create dynamic UI elements.',
        question: {
          text: 'Which method selects the first element matching a specified CSS selector?',
          options: [
            'document.getElementById()',
            'document.querySelector()',
            'document.getElementsByClassName()',
            'document.findAll()'
          ],
          correctAnswer: 1,
          explanation: 'document.querySelector() returns the first element within the document that matches the specified CSS selector.'
        }
      },
      {
        id: 'web-4',
        title: 'Reel 4 — Async JavaScript & Fetch API',
        duration: '02:00',
        videoUrl: '/videos/python-reels/python-01.mp4',
        description: 'Master Promises, async/await syntax, REST API requests, and JSON response parsing.',
        question: {
          text: 'What does the fetch() function in browser JavaScript return?',
          options: [
            'The direct JSON payload',
            'A Promise resolving to a Response object',
            'An XMLHttpRequest object',
            'A synchronous array'
          ],
          correctAnswer: 1,
          explanation: 'fetch() returns a Promise that resolves to the Response object representing the response to the request.'
        }
      },
      {
        id: 'web-5',
        title: 'Reel 5 — Modern Responsive Web Design',
        duration: '01:35',
        videoUrl: '/videos/aptitude-reels/aptitude-01.mp4',
        description: 'Mobile-first design principles, viewport meta tags, rem/em units, and fluid typography.',
        question: {
          text: 'What meta tag is essential for responsive mobile rendering in HTML head?',
          options: [
            '<meta name="mobile" content="yes">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<meta name="responsive" content="true">',
            '<meta name="screen" content="fluid">'
          ],
          correctAnswer: 1,
          explanation: 'The viewport meta tag instructs the browser on how to control the page\'s dimensions and scaling on mobile devices.'
        }
      }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '🧠',
    tagline: 'Big-O Analysis, Trees, Graphs & Dynamic Programming',
    totalReels: 5,
    reels: [
      {
        id: 'dsa-1',
        title: 'Reel 1 — Time & Space Complexity (Big-O)',
        duration: '01:45',
        videoUrl: '/videos/java-reels/java-02.mp4',
        description: 'Analyze algorithm performance using O(1), O(log N), O(N), and O(N^2) bounds.',
        question: {
          text: 'What is the worst-case time complexity of Binary Search on a sorted array?',
          options: [
            'O(1)',
            'O(N)',
            'O(log N)',
            'O(N log N)'
          ],
          correctAnswer: 2,
          explanation: 'Binary Search repeatedly divides the search interval in half, yielding O(log N) time complexity.'
        }
      },
      {
        id: 'dsa-2',
        title: 'Reel 2 — Arrays and Two-Pointer Technique',
        duration: '01:35',
        videoUrl: '/videos/python-reels/python-02.mp4',
        description: 'Solve array reversal, two-sum on sorted arrays, and sliding window problems in linear time.',
        question: {
          text: 'Why is the two-pointer technique useful for sorted array problems?',
          options: [
            'It reduces space complexity to O(N^2)',
            'It allows searching/traversing in O(N) instead of O(N^2)',
            'It automatically sorts unsorted arrays',
            'It creates a hash map behind the scenes'
          ],
          correctAnswer: 1,
          explanation: 'Two pointers move from opposite ends or at different speeds, avoiding nested loops and reducing O(N^2) algorithms to O(N).'
        }
      },
      {
        id: 'dsa-3',
        title: 'Reel 3 — Stacks & Queues Applications',
        duration: '01:50',
        videoUrl: '/videos/aptitude-reels/aptitude-02.mp4',
        description: 'LIFO vs FIFO properties, balanced parentheses check, and expression evaluation.',
        question: {
          text: 'Which data structure follows the LIFO (Last In First Out) principle?',
          options: [
            'Queue',
            'Stack',
            'Heap',
            'Linked List'
          ],
          correctAnswer: 1,
          explanation: 'A Stack operates on a LIFO basis where the last element inserted is the first element removed.'
        }
      },
      {
        id: 'dsa-4',
        title: 'Reel 4 — Binary Search Trees (BST)',
        duration: '01:40',
        videoUrl: '/videos/java-reels/java-03.mp4',
        description: 'Tree traversals (In-order, Pre-order, Post-order) and BST insert/delete operations.',
        question: {
          text: 'Which tree traversal order visits elements of a Binary Search Tree in sorted order?',
          options: [
            'Pre-order',
            'In-order',
            'Post-order',
            'Level-order'
          ],
          correctAnswer: 1,
          explanation: 'In-order traversal (Left subtree -> Root -> Right subtree) visits nodes in ascending sorted order for a BST.'
        }
      },
      {
        id: 'dsa-5',
        title: 'Reel 5 — Graph Algorithms: BFS & DFS',
        duration: '02:00',
        videoUrl: '/videos/python-reels/python-03.mp4',
        description: 'Breadth-First Search with Queues vs Depth-First Search with Recursion/Stacks.',
        question: {
          text: 'Which algorithm is best suited to find the shortest path in an unweighted graph?',
          options: [
            'Depth-First Search (DFS)',
            'Breadth-First Search (BFS)',
            'Prim\'s Algorithm',
            'Kruskal\'s Algorithm'
          ],
          correctAnswer: 1,
          explanation: 'BFS explores nodes level by level, making it ideal for finding the shortest path (minimum number of edges) in unweighted graphs.'
        }
      }
    ]
  },
  {
    id: 'dbms',
    name: 'Database Management',
    icon: '🗄️',
    tagline: 'SQL Queries, Relational Schema & Normalization',
    totalReels: 5,
    reels: [
      {
        id: 'dbms-1',
        title: 'Reel 1 — Relational Model & SQL SELECT',
        duration: '01:30',
        videoUrl: '/videos/aptitude-reels/aptitude-03.mp4',
        description: 'Understand tables, primary keys, foreign keys, and filtering data with WHERE and LIKE clauses.',
        question: {
          text: 'Which SQL clause is used to filter records before grouping occurs?',
          options: [
            'HAVING',
            'WHERE',
            'ORDER BY',
            'GROUP BY'
          ],
          correctAnswer: 1,
          explanation: 'The WHERE clause filters individual rows before any grouping or aggregation takes place.'
        }
      },
      {
        id: 'dbms-2',
        title: 'Reel 2 — SQL Joins Demystified',
        duration: '01:50',
        videoUrl: '/videos/java-reels/java-04.mp4',
        description: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with practical examples.',
        question: {
          text: 'Which JOIN returns all matching rows from both tables plus non-matching rows from the left table?',
          options: [
            'INNER JOIN',
            'LEFT JOIN',
            'RIGHT JOIN',
            'CROSS JOIN'
          ],
          correctAnswer: 1,
          explanation: 'A LEFT JOIN returns all rows from the left table and matched records from the right table (with NULLs for unmatched).'
        }
      },
      {
        id: 'dbms-3',
        title: 'Reel 3 — Database Normalization (1NF to 3NF)',
        duration: '01:40',
        videoUrl: '/videos/python-reels/python-04.mp4',
        description: 'Eliminate redundancy, update anomalies, and partial/transitive functional dependencies.',
        question: {
          text: 'A relation is in Third Normal Form (3NF) if it is in 2NF and has no...?',
          options: [
            'Repeating groups',
            'Partial dependencies',
            'Transitive dependencies',
            'Foreign keys'
          ],
          correctAnswer: 2,
          explanation: '3NF requires that no non-prime attribute is transitively dependent on any candidate key.'
        }
      },
      {
        id: 'dbms-4',
        title: 'Reel 4 — Transactions & ACID Properties',
        duration: '01:45',
        videoUrl: '/videos/aptitude-reels/aptitude-04.mp4',
        description: 'Atomicity, Consistency, Isolation, and Durability in transaction processing.',
        question: {
          text: 'What does the "A" in ACID database properties stand for?',
          options: [
            'Availability',
            'Atomicity',
            'Authentication',
            'Accuracy'
          ],
          correctAnswer: 1,
          explanation: 'Atomicity ensures that all operations within a transaction complete successfully, or all are rolled back.'
        }
      },
      {
        id: 'dbms-5',
        title: 'Reel 5 — Indexes & Query Optimization',
        duration: '01:35',
        videoUrl: '/videos/java-reels/java-05.mp4',
        description: 'B-Tree indexes, composite indexing strategy, and avoiding full table scans.',
        question: {
          text: 'What is the primary tradeoff of adding many indexes to a relational table?',
          options: [
            'Slower SELECT queries',
            'Higher storage & slower INSERT/UPDATE/DELETE operations',
            'Loss of primary keys',
            'Disabled joins'
          ],
          correctAnswer: 1,
          explanation: 'Indexes speed up read operations (SELECT), but consume additional disk space and slow down writes because indexes must be updated on every modification.'
        }
      }
    ]
  }
];
