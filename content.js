const IGNORE_LENGTH = 300

// run prompt api
async function analyse(prompt) {
  try {
    const params = await LanguageModel.params();
    console.log(params);

    const session = await LanguageModel.create({
      temperature: Math.max(params.defaultTemperature * 1.2, 2.0),
      topK: params.defaultTopK,
    });
    const result = await session.prompt(prompt);
    return result;
  } catch (err) {
    console.error(err);
  }
}

// find comments sections + extract post title/comments
// TODO: how to extract content
// TODO: how to better locate comment section
function extractTitleAndComments() {
  const titles = [];
  const comments = [];

  document.querySelectorAll("[id*='title'], [class*='title'], [data-test*='title']").forEach((el) => {
    const text = el.textContent.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
    if (text) titles.push(text);
  });

  document.querySelectorAll("[id*='comment'], [class*='comment'], [data-test*='comment']").forEach((el) => {
    const text = el.textContent.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
    if (text) comments.push(text);
  });

  return {
    title: titles.join(" / "),
    comments: comments
  };
}

// split comments
function makeChunk(arr, size) {
  const result = [];
  const filtered = arr.filter(item => String(item).length <= IGNORE_LENGTH);
  for (let i = 0; i < filtered.length; i += size) {
      result.push(filtered.slice(i, i + size));
  }
  return result;
}


function makePrompt(title, commentsBatch) {
  return `
    Task: For each comment, decide if it is relevant to the post topic and if it is toxic.
    Input:
    1. Post content: ${title}
    2. List of comments:
    ${commentsBatch.join("\n")}

    Output format (no explanations):
    Comment: <comment text>
    Relevance: Yes/No
    Toxic: Yes/No
  `;
}

// mask blocked comments
function maskComments(comment) {
  // find exact match in comment section
  const el = Array.from(document.querySelectorAll("[id*='comment']")).find((e) => e.textContent.replace(/\s+/g, " ").trim() === comment);
  if (!el) {
    console.log(`Can't find comment ${comment}`)
    return;
  }
  // blur effect
  if (el) {
    el.style.filter = "blur(5px)";
    el.style.background = "rgba(0,0,0,0.1)";
    el.style.cursor = "pointer";
    el.title = "Click to show/hide the comment";
  }
  // click to how/hide
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el.style.filter === 'none') {
      el.style.filter = "blur(5px)";
      el.style.background = "rgba(0,0,0,0.1)";
    } else {
      el.style.filter = 'none';
      el.style.background = "transparent";
    }
  });
  console.log(`Comment: ${comment} already masked`);
}

// mask process (main logic)
// Relevance No or Toxic Yes
function filter(result) {
  const pattern = /Comment:\s*(.+?)\nRelevance:\s*(Yes|No)\nToxic:\s*(Yes|No)/g;
  const matchedComments = Array.from(result.matchAll(pattern));
  matchedComments.forEach(c => {
    const comment = c[1].trim();
    const relevance = c[2].trim().toLowerCase();
    const toxic = c[3].trim().toLowerCase();

    if (relevance === "no" || toxic === "yes") {
      maskComments(comment);
    }
  });
}

