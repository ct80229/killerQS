# Sorting Visualizer
This app animates 4 different sorting algorithms: quick sort, insertion sort, selection sort, and bubble sort. Try it here: https://ct80229.github.io/killerQS/

I've implemented the adversarial sort algorithm described by McIlroy in his paper "A Killer Adversary for Quicksort," seen here: https://www.cs.dartmouth.edu/~doug/mdmspe.pdf.

![](https://github.com/ct80229/killerQS/blob/main/gifs/Screen-Recording-2024-01-13-at-3.17.43-PM.gif)

# How Adversarial Sort Works
Note: The quick sort that's been implemented uses Hoare partitioning.

Adversarial sort makes any quick sort run in quadratic time, regardless of its partitioning scheme. A hypothetical adversary has the ability to alter the array as quick sort runs.
Initially, all items in the array to be sorted are "gas values." When two gases are compared, one becomes a "solid." Any time a solid.is compared to a gas, it compares low.
When a gas is solidified, it obtains a real number value that can not be altered. The adversary sets the solid to a value that's greater than all the other solid values.
Because of this, quick sort ends up choosing n pivots. Each pivot is compared to n items, making for an O(n^2) runtime.




