# Huffman Coding Compression Tool (DSA)

## Live Demo

[https://huffman-coding-compression-tool-dsa.vercel.app/](https://huffman-coding-compression-tool-dsa.vercel.app/)

## About Huffman Coding

Huffman Coding is a greedy algorithm used for lossless data compression.  
It assigns shorter binary codes to more frequent characters and longer codes to less frequent characters, reducing the total number of bits needed to represent data.

Core ideas:
- Count the frequency of each character
- Build a min-heap (priority queue) of nodes by frequency
- Repeatedly merge the two least frequent nodes
- Construct a binary tree (Huffman Tree)
- Generate prefix-free binary codes from tree paths

Because the codes are prefix-free, decoding is unambiguous.

## What This Project Demonstrates

This visualizer helps you understand the full DSA workflow of Huffman Coding:
- Frequency table generation from input text
- Step-by-step tree construction
- Priority queue (min-heap) state during each merge
- Final Huffman code for every symbol
- Encoding a string into a compressed bitstream
- Decoding a bitstream back to the original text

## Algorithm Insight

- **Type:** Greedy algorithm
- **Time Complexity:** `O(N log N)` (with heap operations)
- **Space Complexity:** `O(N)`

This makes Huffman Coding a classic and important DSA topic for compression and optimal prefix coding.
