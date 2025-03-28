document.addEventListener("DOMContentLoaded", function () {
  const markdownInput = document.getElementById("markdownInput");
  const preview = document.getElementById("preview");
  const clearButton = document.getElementById("clearButton");

  // Configure marked.js with highlight.js for code highlighting
  marked.setOptions({
    highlight: function (code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
      return hljs.highlight(validLanguage, code).value;
    },
    breaks: true,
    gfm: true,
  });
  
  // Initial sample text to demonstrate markdown features
  const sampleMarkdown = `# Markdown Previewer

## This is a subheading

### And a smaller heading

Here's some **bold text** and *italic text*.

You can also create [links](https://google.com)

#### Lists:

Unordered list:
* Item 1
* Item 2
* Item 3

Ordered list:
1. First item
2. Second item
3. Third item

#### Nested Lists
1. Main Point
   - Subpoint A
     * Detail 1
     * Detail 2
   - Subpoint B
2. Second Main Point

#### Task Lists
- [x] Complete Markdown tutorial
- [ ] Build a project
- [ ] Share with community

#### Code Examples:

Inline code: \`const example = "Hello World";\`

Code block:
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

> This is a blockquote.

![Image Alt Text](https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=)

| Tables | are   | also  | supported | and    | will   | overflow | cleanly | if     | needed |
|--------|-------|-------|-----------|--------|--------|----------|---------|--------|--------|
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |

Enjoy using the markdown previewer!`;

  // Set the initial markdown and render the preview
  markdownInput.value = sampleMarkdown;
  renderMarkdown();

  // Update preview when markdown is typed
  markdownInput.addEventListener("input", renderMarkdown);

  // Clear button functionality
  clearButton.addEventListener("click", function () {
    markdownInput.value = "";
    renderMarkdown();
    markdownInput.focus();
  });

  // Function to render markdown
  function renderMarkdown() {
    const markdown = markdownInput.value;
    const html = marked.parse(markdown);
    preview.innerHTML = html;

    // Apply syntax highlighting to code blocks
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
});
