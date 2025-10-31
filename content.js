const IGNORE_LENGTH = 300

// run prompt api
async function analyse(prompt) {
  try {
    const params = await LanguageModel.params();
    console.log(params);

    const topKValue = (typeof params.defaultTopK === 'number' && params.defaultTopK > 0) ? params.defaultTopK : 40;

    const session = await LanguageModel.create({
      temperature: Math.max(params.defaultTemperature * 1.2, 2.0),
      topK: topKValue,
      language: "en",
    });
    const result = await session.prompt(prompt);
    return result;
  } catch (err) {
    console.error(err);
  }
}

// find comments sections + extract post title/comments
function extractTitleAndComments() {
  const titles = [];
  const comments = [];
  const bodies = [];

  document.querySelectorAll("[id*='title'], [class*='title'], [data-test*='title']").forEach((el) => {
    const text = el.textContent.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
    if (text) titles.push(text);
  });

  document.querySelectorAll('[property="schema:articleBody"]').forEach((el) => {
    const text = el.textContent.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
    if (text) bodies.push(text);
  });

  document.querySelectorAll('[slot="comment"], [id*="comment"], [class*="comment"], [data-test*="comment"]').forEach((el) => {
    const text = el.textContent.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
    if (text) comments.push(text);
  });

  const postContent = [titles.join(" / "), bodies.join(" / ")].filter(Boolean).join(" — ");

  return {
    title: postContent,
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

function makePrompt(title, commentsBatch, mode="medium", relevance=false, toxic=false) {
  let tasks = []
  
  if (relevance) tasks.push("assess how relevant each comment is to the post topic");
  if (toxic) tasks.push("assess how toxic or offensive each comment is");

  let input = "";
  if (mode.toLowerCase() === "high") {
    input = "- Be strict; even slightly offensive, disrespectful, or off-topic comments should get high ratings."
  } else if (mode.toLowerCase() === "medium") {
    input = "- Use balanced judgment; rate normally based on the given scales."
  } else {
    input = "- Be lenient; only rate as highly toxic or irrelevant if the comment is clearly problematic."
  }
  
  return `
      Task:
      For each comment, ${tasks.join(" and ")}.
      Rate each as one of three levels: LOW, MEDIUM, or HIGH.
      ${input}

      Input:
      Post: "${title}"
      Comments:
      ${commentsBatch.map((c, i) => `${i + 1}. ${c}`).join("\n")}

      Output (no explanation, one block per comment):
      Comment: <original comment>
      Relevance: LOW/MEDIUM/HIGH
      Toxicity: LOW/MEDIUM/HIGH
    `.trim();
}

// mask blocked comments
function maskComments(comment) {
  // find exact match in comment section
  const el = Array.from(document.querySelectorAll('[slot="comment"], [id*="comment"], [class*="comment"], [data-test*="comment"]')).find((e) => e.textContent.replace(/\s+/g, " ").trim() === comment);
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
function filter(result, mode) {
  const pattern = /Comment:\s*([\s\S]*?)\n\s*Relevance:\s*(LOW|MEDIUM|HIGH)\s*\n\s*Toxicity:\s*(LOW|MEDIUM|HIGH)/gi;
  const matchedComments = Array.from(result.matchAll(pattern));
  matchedComments.forEach(c => {
    const comment = c[1].trim();
    const relevance = c[2].toUpperCase();
    const toxic = c[3].toUpperCase();

    let shouldMask = false;
    if (mode === "low") {
      shouldMask = toxic === "HIGH";
    } else if (mode === "medium") {
      shouldMask = toxic === "HIGH" || toxic === "MEDIUM";
    } else if (mode === "high") {
      shouldMask = toxic !== "LOW" || relevance === "HIGH";
    }

    if (shouldMask) {
      maskComments(comment);
    }
  });
}
