# Claude Think Tool Examples

This document provides examples of how to use the Claude Think Tool in Cursor.

## Basic Usage

Simply type `think` followed by your question:

```
think What is the time complexity of the merge sort algorithm?
```

## Example Prompts for Different Types of Problems

### Complex Problem Analysis

```
think What approach should I take to implement a real-time collaborative document editor?
```

### Debugging Code

```
think My React component is re-rendering too frequently. How should I approach debugging this?
```

### Algorithm Design

```
think How would I design an efficient algorithm to find all anagrams in a large text document?
```

### System Architecture

```
think What's the best architecture for a serverless microservice that needs to process large video files?
```

### Comparing Approaches

```
think What are the tradeoffs between using WebSockets versus Server-Sent Events for real-time updates?
```

## Tips for Getting the Best Results

1. **Be specific**: The more specific your question, the more focused Claude's thinking will be.

2. **Ask for step-by-step reasoning**: For complex problems, explicitly ask for a step-by-step approach.

3. **Request multiple perspectives**: For design questions, ask Claude to consider multiple approaches.

4. **Use for complex problems**: The thinking mode is most valuable for problems that require careful reasoning.

5. **Break down large questions**: For very complex questions, break them into smaller, more manageable parts.

## Example of Expected Output

When you use the think tool, Claude will provide output similar to this:

```
<thinking>
Let me think about how quicksort works step by step:

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

4. The average-case time complexity is O(n log n)
   - Each partition takes O(n) time
   - We make log n levels of recursion on average
   - Best case is also O(n log n)
   - Worst case is O(n²) when the array is already sorted and we pick the smallest/largest element as pivot

5. Space complexity is O(log n) on average for the recursion stack.
</thinking>

Quicksort is a fast, divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it, then recursively sorting the sub-arrays. It has average-case time complexity of O(n log n) and is widely used in practice due to its efficiency. 