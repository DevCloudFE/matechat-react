import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Button } from "../src/button";
import { Prompt, PromptDescription, PromptTitle } from "../src/prompt";

test("button", () => {
  render(<Button variant="default">Default</Button>);

  const buttonElement = screen.getByText("Default");

  expect(buttonElement).toBeInTheDocument();
});

test("single prompt", () => {
  render(
    <Prompt>
      <PromptTitle>Understanding the Attention Mechanism</PromptTitle>
      <PromptDescription>
        Explain the attention mechanism in neural networks, focusing on its role
        in sequence-to-sequence tasks.
      </PromptDescription>
    </Prompt>,
  );

  const titleElement = screen.getByText(
    "Understanding the Attention Mechanism",
  );
  const descriptionElement = screen.getByText(
    "Explain the attention mechanism in neural networks, focusing on its role in sequence-to-sequence tasks.",
  );
  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
  expect(titleElement).toHaveClass("font-medium", "text-mc-pt-fg");
  expect(titleElement.tagName).toBe("H3");
  expect(descriptionElement).toHaveClass("text-gray-600");
});
