export const CLASSIFY_SYSTEM = `You are an IT report writer analyzing git commits. Classify each commit and translate to non-technical language. Return ONLY valid JSON, no markdown, no explanation.`

function lang(language: string) {
  return language === 'en' ? 'English' : 'professional Indonesian'
}

export function classifyPrompt(commits: object[], language = 'id') {
  return `Classify each commit below into one category:
- FEATURE: new capability, page, module, or integration added
- BUGFIX: something broken, crashing, or incorrect was fixed
- IMPROVEMENT: existing feature enhanced, UI updated, performance improved
- CHORE: refactor, config change, dependency update, maintenance

Commits:
${JSON.stringify(commits, null, 2)}

Return JSON:
{
  "classifications": [
    {
      "hash": "string",
      "date": "YYYY-MM-DD",
      "repo": "string",
      "message": "string",
      "category": "FEATURE|BUGFIX|IMPROVEMENT|CHORE",
      "plain_description": "one sentence non-technical explanation in ${lang(language)}"
    }
  ],
  "summary": {
    "feature_count": 0,
    "bugfix_count": 0,
    "improvement_count": 0,
    "chore_count": 0,
    "systems_updated": ["repo names"],
    "uptime_note": "100%"
  }
}`
}

export function executiveSummaryPrompt(commits: object[], startDate: string, endDate: string, language = 'id') {
  return `Based on these classified commits from ${startDate} to ${endDate}:
${JSON.stringify(commits, null, 2)}

Write an Executive Summary paragraph (150-200 words) that:
- Opens with the overall theme of this period
- Mentions 2-3 most significant achievements
- Notes scale of work (features added, issues resolved)
- Closes with business impact, not technical detail
- Write in flowing paragraphs, no bullet points
- Write in ${lang(language)}`
}

export function keyHighlightsPrompt(commits: object[], language = 'id') {
  return `From these classified commits, identify 4-8 most significant FEATURE or IMPROVEMENT items:
${JSON.stringify(commits, null, 2)}

For each highlight return JSON array:
[{
  "title": "business-friendly feature title in ${lang(language)}",
  "system": "which repo/system",
  "description": "2-3 sentences in ${lang(language)} explaining what was built and why it matters to the business"
}]

Group related commits. Ignore minor fixes.
Return ONLY JSON array.`
}

export function issuesResolvedPrompt(commits: object[], language = 'id') {
  return `From these classified commits, extract all BUGFIX items:
${JSON.stringify(commits, null, 2)}

For each issue return JSON array:
[{
  "number": 1,
  "description": "clear non-technical description in ${lang(language)} of what the problem was and its impact",
  "system": "affected system/repo",
  "resolved_date": "YYYY-MM-DD"
}]

Be specific — avoid vague descriptions like 'bug fixed'.
Return ONLY JSON array.`
}

export function weeklySummaryPrompt(commits: object[], weekRanges: string[], language = 'id') {
  return `Organize these commits by week and summarize:
${JSON.stringify(commits, null, 2)}

Weeks: ${weekRanges.join(', ')}

For each week return JSON array:
[{
  "week": "Week 1",
  "period": "date range",
  "focus": "dominant theme of the week in ${lang(language)}",
  "summary": "2-3 sentences in ${lang(language)} summarizing work done and outcome",
  "status": "Completed"
}]

Return ONLY JSON array.`
}

export function futurePlansPrompt(userInput: string, language = 'id') {
  return `The developer has written these rough notes about planned work:
${userInput}

Rewrite each item as a professional planned initiative in ${lang(language)}:
[{
  "priority": "High|Medium|Low",
  "title": "concise initiative title",
  "description": "one sentence",
  "expected_benefit": "one sentence business benefit"
}]

Keep meaning exactly as intended, only improve language.
Return ONLY JSON array.`
}
