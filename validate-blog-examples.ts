#!/usr/bin/env bun

import { $ } from "bun";
import { writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";

// Blog post content
const BLOG_POST = `
satisfies never off by one

Feb 07, 2026

We look at a new way to implement exhaustiveness checking in TypeScript. Unlike other entries in the genre it works with if statements and ternary expressions, while leaving no unnecessary conditions or unreachable code. Skip to the summary here or read along for examples.

The problem

I define exhaustiveness checking as: "I get an informative type error when I add a new possible value to a union type". It's a way to avoid bugs caused by forgetting to handle new cases.

I assume you know a bit about the ways to implement it in TypeScript, and also have a sense of when and when not to seek it out.

Let's start with an example stolen from Dr. Axel Rauschmayer's article on the topic:

function toGermanExhaustive(x: NoYes): string {
  if (x === NoYes.No) {
    return 'Nein';
  }
  if (x === NoYes.Yes) {
    return 'Ja';
  }
}
This function is exhaustive, but it doesn't implement exhaustiveness checking. Moreover it doesn't even pass type checking. TS doesn't know that you can't go past the second return, so you get a type error complaining that the implicit final return value undefined doesn't match the annotated return type string.

typescript-eslint however does know that you can't go past the second return, sort of. If you have no-unnecessary-conditions turned on it will correctly call out that if (x === NoYes.Yes) is redundant.

There are a few fine ways to write this logic with type checking and exhaustiveness checking:

use a switch statement instead. TS and typescript-eslint both nudge towards exhaustiveness better with switch.
Use an object as const as a lookup table.
I would probably reach for a lookup table object in this example. But let's pretend it had to stay an if, e.g. you want to leverage other narrowing conditions like !==.

Exhaustive if

First, let's ditch the unnecessary if.

function toGermanExhaustive(x: NoYes): string {
  if (x === NoYes.No) {
    return 'Nein';
  }

  return 'Ja';
}
This passes TS, but doesn't have exhaustiveness checking. Let's apply the satisfies never trick to try and implement it.

function toGermanExhaustive(x: NoYes): string {
  if (x === NoYes.No) {
    return 'Nein';
  }

  return 'Ja';

  x satisfies never;
}
But this doesn't work. Because we no longer branch, we no longer narrow x, therefore the satisfies check fails. TS also complains that the code after the return is unreachable.

Here we should pause to get our bearings. It's helpful to map out the type of x before and after each condition. Helpfully, we can use the satisfies operator here to check our work.

function toGermanExhaustive(x: NoYes): string {
  x satisfies NoYes.No | NoYes.Yes
  if (x === NoYes.No) {
    x satisfies NoYes.No
    return 'Nein';
  }

  x satisfies NoYes.Yes
  return 'Ja';

  x satisfies NoYes.Yes;
}
Now an experiment: what happens if we add a value to NoYes?

enum NoYes {
  No,
  Yes,
  Probs // new
}

function toGermanExhaustive(x: NoYes): string {
  x satisfies NoYes.No | NoYes.Yes; // error
  if (x === NoYes.No) {
    x satisfies NoYes.No;
    return 'Nein';
  }

  x satisfies NoYes.Yes; // error
  return 'Ja';

  x satisfies NoYes.Yes; // error
}
Every satisfies besides the one inside the if block lit up, because there's now a value of x that doesn't fit. Somehow just by spamming satisfies we got an exhaustiveness check. Why?

Because the never in satisfies never isn't special or required. As long as the x in x satisfies Type contains a value incompatible with Type, we get an error pointing out which case we need to handle.

There's a problem though: we want one exhaustiveness check but this function now has two. Which one should we keep?

I like the one "off by one" from where we thought the satisfies never would go: the one between the last if and the final return.

function toGermanExhaustive(x: NoYes): string {
  if (x === NoYes.No) {
    return 'Nein';
  }

  x satisfies NoYes.Yes
  return 'Ja'
}
I like it for a few reasons:

Only have to write down one enum value out of potentially many.
The value you write down describes the variable's value. You get to read it almost as if it were an equality check, but with no runtime cost.
But there is some flexibility here. If the last N cases really are all handled the same, we can check that we're "off by N" before the final return.

function isAffirmative(x: NoYes): boolean {
  if (x === NoYes.Yes) {
    return true;
  }

  x satisfies NoYes.No | NoYes.Probs
  return false;
}
Exhaustive ternary

Imagine our example function using a ternary expression instead of an if.

function toGermanExhaustive(x: NoYes): string {
 return x === NoYes.No
          ? 'Nein'
          : 'Ja';
}
To check the value "off by one", we have to somehow sneak a satisfies expression into the last arm of a ternary chain. We can do that with the JS comma operator.

function toGermanExhaustive(x: NoYes): string {
 return x === NoYes.No
          ? 'Nein'
          : (x satisfies NoYes.Yes, 'Ja');
}
tldr

First decide if and when you should implement exhaustiveness checking in your code.
Second, consider implementing exhaustiveness checks not by checking that a variable satisfies never, but that it satisfies exactly one possible value.
function toGermanExhaustive(x: NoYes): string {
  if (x === NoYes.No) {
    return 'Nein';
  }

  x satisfies NoYes.Yes
  return 'Ja';
}
`;

interface CodeExample {
  name: string;
  code: string;
  expectedToFail: boolean;
  description?: string;
}

// Extract code blocks - simple regex approach
function extractCodeExamples(content: string): CodeExample[] {
  const examples: CodeExample[] = [];

  // Match function declarations and enum declarations
  const codeBlockRegex = /(?:^|\n)((?:enum|function|interface|type)\s+[\s\S]+?)(?=\n(?:enum|function|interface|type|This |typescript-eslint|There |Because |Every |I like|But |Imagine |To check|First |tldr|Now |$))/g;

  let match;
  let index = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    let code = match[1].trim();

    // Clean up any trailing prose that got picked up
    // Remove lines that start with capital letters followed by lowercase (prose sentences)
    const lines = code.split('\n');
    const codeLines = [];
    for (const line of lines) {
      const trimmed = line.trim();
      // Stop if we hit a line that looks like prose (starts with capital, has spaces, looks like a sentence)
      if (/^[A-Z][a-z]+\s+/.test(trimmed) && !line.includes('NoYes') && !line.includes(':') && !line.includes('=>')) {
        break;
      }
      codeLines.push(line);
    }
    code = codeLines.join('\n').trim();

    index++;

    // Determine if example should fail based on surrounding context
    const precedingText = content.slice(Math.max(0, match.index - 500), match.index);
    const followingText = content.slice(match.index, match.index + code.length + 500);

    const expectedToFail =
      (followingText.includes("doesn't work") && !followingText.includes("passes TS")) ||
      (followingText.includes("// error") && code.includes("// error")) ||
      followingText.includes("doesn't even pass type checking") ||
      precedingText.includes("what happens if we add a value to NoYes") ||
      precedingText.includes("Here we should pause to get our bearings");

    let description = "";
    if (followingText.includes("doesn't even pass type checking")) {
      description = "Should fail - implicit undefined return";
    } else if (followingText.includes("doesn't work") && !followingText.includes("passes TS")) {
      description = "Should fail - unreachable code with satisfies never";
    } else if (followingText.includes("// error") && code.includes("// error")) {
      description = "Should fail - demonstrates exhaustiveness errors";
    } else if (precedingText.includes("Here we should pause to get our bearings")) {
      description = "Should fail - demonstrates type narrowing with unreachable code";
    } else if (code.includes("enum NoYes") && code.includes("Probs")) {
      description = "Should pass - defines 3-value enum";
    }

    examples.push({
      name: `example-${index}`,
      code,
      expectedToFail,
      description
    });
  }

  return examples;
}

async function validateExample(example: CodeExample, enumState: { current: string }, tempDir: string): Promise<{
  example: CodeExample;
  passed: boolean;
  output: string;
}> {
  const filename = `${example.name}.ts`;
  const filepath = join(tempDir, filename);

  // Determine if this example defines NoYes enum
  const definesEnum = example.code.includes("enum NoYes");

  // Fix common syntax issues in blog code examples
  let code = example.code;

  // Add semicolons to bare satisfies statements (x satisfies Type should be x satisfies Type;)
  // Only if the line doesn't already end with ; or is followed by another statement
  code = code.replace(/(\s+x satisfies [^\n;]+)(\n)/g, "$1;$2");

  // Build complete file content
  let fileContent = "";

  if (!definesEnum) {
    // Use the current enum state
    fileContent = enumState.current + "\n\n" + code;
  } else {
    fileContent = code;
    // Update enum state
    const enumMatch = code.match(/enum NoYes[\s\S]+?}/);
    if (enumMatch) {
      enumState.current = enumMatch[0];
    }
  }

  await writeFile(filepath, fileContent);

  // Run tsc
  try {
    await $`bunx tsc --noEmit --strict ${filepath}`.quiet();
    return {
      example,
      passed: true,
      output: "✓ No errors"
    };
  } catch (error: any) {
    return {
      example,
      passed: false,
      output: error.stderr?.toString() || error.stdout?.toString() || "Unknown error"
    };
  }
}

async function main() {
  console.log("Extracting TypeScript code examples from blog post...\n");

  const examples = extractCodeExamples(BLOG_POST);
  console.log(`Found ${examples.length} code examples\n`);

  // Create temp directory
  const tempDir = join(process.cwd(), ".validate-examples");
  await rm(tempDir, { recursive: true, force: true });
  await mkdir(tempDir, { recursive: true });

  // Track enum state as we go
  const enumState = {
    current: `enum NoYes { No, Yes }`
  };

  console.log("Validating examples with TypeScript compiler...\n");
  console.log("=".repeat(80));

  let totalPassed = 0;
  let totalFailed = 0;
  let correctlyExpected = 0;

  for (const example of examples) {
    // Determine which enum this example should use
    let enumToUse: string;

    if (example.code.includes("enum NoYes")) {
      // Example defines its own enum - use it
      enumToUse = enumState.current; // Will be updated by validateExample
    } else if (example.code.includes("NoYes.Probs")) {
      // Example references Probs - needs 3-value enum
      enumToUse = `enum NoYes { No, Yes, Probs }`;
    } else {
      // Default to 2-value enum
      enumToUse = `enum NoYes { No, Yes }`;
    }

    // Temporarily set the enum
    const savedEnum = enumState.current;
    enumState.current = enumToUse;

    const result = await validateExample(example, enumState, tempDir);

    // After an enum definition, keep it; otherwise restore to default 2-value
    if (!example.code.includes("enum NoYes")) {
      enumState.current = savedEnum;
    }

    const expectationMet = result.passed !== example.expectedToFail;
    if (expectationMet) correctlyExpected++;

    if (result.passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    console.log(`\n${example.name}: ${result.passed ? "PASS ✓" : "FAIL ✗"}`);
    if (example.description) {
      console.log(`  ${example.description}`);
    }
    console.log(`  Expected to ${example.expectedToFail ? "fail" : "pass"}: ${expectationMet ? "✓" : "✗"}`);

    // Show first few lines of code
    const codePreview = example.code.split('\n').slice(0, 3).join('\n');
    console.log(`  Code: ${codePreview}${example.code.split('\n').length > 3 ? '...' : ''}`);

    if (!result.passed && !expectationMet) {
      // Show full code for unexpected failures
      console.log(`  Full code:\n${example.code.split('\n').map((l, i) => `    ${i + 1}: ${l}`).join('\n')}`);
    }

    if (!result.passed) {
      // Show error details
      const errorLines = result.output.split('\n').filter(line =>
        line.includes('error TS') || line.trim().startsWith('^')
      );
      console.log(`  Errors:`);
      errorLines.slice(0, 3).forEach(line => console.log(`    ${line}`));
    }

    console.log("-".repeat(80));
  }

  console.log("\n" + "=".repeat(80));
  console.log("\nSummary:");
  console.log(`  Total examples: ${examples.length}`);
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  Expectations met: ${correctlyExpected}/${examples.length}`);

  // Cleanup
  await rm(tempDir, { recursive: true, force: true });
}

main().catch(console.error);
