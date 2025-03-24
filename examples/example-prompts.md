# Claude Think Tool Examples

This document provides examples of how to use the Claude Think Tool in Cursor. These examples demonstrate the types of questions that benefit most from Claude's explicit thinking mode.

## Basic Usage

Simply type `think` followed by your question:

```
think What is the time complexity of the merge sort algorithm?
```

## Example Prompts By Category

### Programming and Development

#### Algorithm Analysis

```
think What is the computational complexity of quicksort in best, average, and worst cases? Why does the worst case occur?
```

```
think Compare and contrast breadth-first search and depth-first search algorithms. When would you use one over the other?
```

#### System Design

```
think How would you design a scalable URL shortening service like bit.ly?
```

```
think What's the best architecture for a globally distributed database that prioritizes availability and partition tolerance?
```

#### Debugging Complex Issues

```
think My Node.js application has a memory leak. What systematic approach should I take to identify and fix the source?
```

```
think My React application suddenly starts showing this error: "Maximum update depth exceeded". What could be causing this and how should I debug it?
```

### Mathematics and Logic

```
think Prove that the square root of 2 is irrational.
```

```
think What is the probability of getting at least one pair when dealt 5 cards from a standard 52-card deck?
```

### Decision Making

```
think What factors should I consider when choosing between TypeScript and JavaScript for a new web application?
```

```
think What are the tradeoffs between monolithic and microservice architectures? How should I decide which is right for my application?
```

### Problem Solving

```
think How would you implement an LRU (Least Recently Used) cache with O(1) time complexity for both read and write operations?
```

```
think How would you design an elevator system for a 50-story building to minimize wait times?
```

## Tips for Getting the Best Results

1. **Be specific**: The more specific your question, the more focused Claude's thinking will be.

2. **Ask for step-by-step reasoning**: For complex problems, explicitly ask for a step-by-step approach.

3. **Request multiple perspectives**: For design questions, ask Claude to consider multiple approaches.

4. **Use for complex problems**: The thinking mode is most valuable for problems that require careful reasoning.

5. **Break down large questions**: For very complex questions, break them into smaller, more manageable parts.

6. **Provide relevant context**: If your question relates to a specific codebase or situation, provide the necessary context.

7. **Ask for tradeoffs**: For design and decision-making questions, explicitly ask for tradeoffs between different approaches.

## Example of Expected Output

When you use the think tool, Claude will provide output similar to this:

```
<thinking>
Let me analyze the time complexity of quicksort step by step:

1. Quicksort is a divide-and-conquer algorithm.

2. The key steps are:
   - Choose a "pivot" element from the array
   - Partition the array around the pivot (elements less than pivot go to left, greater go to right)
   - Recursively apply quicksort to the sub-arrays

3. For the partition step:
   - We typically choose the rightmost element as the pivot
   - Start with two pointers: one at the beginning and one that scans through the array
   - When we find elements smaller than the pivot, we swap them to the left side
   - Finally, we place the pivot in its correct sorted position

4. Time complexity analysis:
   - Best case: O(n log n)
     * Occurs when the pivot always divides the array into roughly equal halves
     * We get log n levels of recursion, and at each level we do O(n) work (the partitioning)
   
   - Average case: O(n log n)
     * Even with random pivot selection, we tend to get reasonably balanced partitions
     * Still results in log n levels with O(n) work per level
   
   - Worst case: O(n²)
     * Occurs when the pivot is always the smallest or largest element
     * This happens when the array is already sorted and we choose the first/last element as pivot
     * In this case, each partition only reduces the problem size by 1, leading to n levels of recursion
     * With O(n) work per level, we get O(n²) total

5. Space complexity:
   - O(log n) on average for the recursion stack (best/average case)
   - O(n) in the worst case when the recursion depth reaches n levels
   
6. Optimizations:
   - Random pivot selection or "median-of-three" can help avoid the worst case
   - Switching to insertion sort for small subarrays improves practical performance
</thinking>

Quicksort has different time complexities depending on the scenario:

- Best/Average case: O(n log n)
- Worst case: O(n²) when the array is already sorted and we choose the smallest/largest element as pivot

The algorithm is efficient in practice due to its good cache performance and the fact that its worst case can usually be avoided with proper pivot selection strategies like randomization or the median-of-three method. 