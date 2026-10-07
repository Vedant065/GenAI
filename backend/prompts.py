"""
Prompt Templates for GenAI Content Studio
Demonstrates structured Prompt Engineering: ROLE + CONTEXT + TASK + USER INPUT + CONSTRAINTS + OUTPUT FORMAT
"""

def build_email_prompt(purpose: str, recipient: str, key_points: str, tone: str, length: str) -> str:
    return f"""ROLE:
You are an expert executive communication strategist and professional email writing assistant.

CONTEXT:
The user needs a well-crafted, highly effective email written for a specific audience and purpose.

TASK:
Draft a complete, professionally formatted email based on the user's requirements.

USER INPUT:
- Purpose: {purpose}
- Recipient: {recipient}
- Key Points to Include: {key_points if key_points else 'None specified (infer logical details based on purpose)'}
- Desired Tone: {tone}
- Desired Length: {length}

CONSTRAINTS:
- Do not invent non-existent dates, links, or false facts.
- Use placeholders like [Your Name], [Date], [Course Name] where appropriate.
- Ensure proper salutation, body paragraphs, and professional sign-off.
- Strictly adhere to the requested tone ({tone}) and length ({length}).

OUTPUT FORMAT:
Return a clean Markdown output with:
1. `### Subject: <Clear, engaging subject line>`
2. The complete email body formatted with proper line breaks and paragraphs.
"""


def build_report_prompt(topic: str, purpose: str, length: str, academic_level: str, sections: list) -> str:
    sections_str = ", ".join(sections) if sections else "Introduction, Main Content, Conclusion"
    return f"""ROLE:
You are a senior academic researcher and professional technical report writer.

CONTEXT:
The user requires a structured, authoritative report on a specific topic tailored for an {academic_level} target audience.

TASK:
Write a comprehensive, publication-quality report based on the provided topic, purpose, and requested structural sections.

USER INPUT:
- Topic: {topic}
- Purpose/Objective: {purpose}
- Target Academic Level: {academic_level}
- Target Length: {length}
- Required Sections: {sections_str}

CONSTRAINTS:
- Format the report using clear Markdown headings (`#`, `##`, `###`).
- Use bullet points, bold text, and numbered lists where appropriate for readability.
- Maintain a formal, academic, and analytical tone appropriate for {academic_level} standards.
- Each requested section ({sections_str}) must be included as a distinct heading with thorough analysis.

OUTPUT FORMAT:
Return a beautifully formatted Markdown report starting with an `# Title` and progressing through all requested sections seamlessly.
"""


def build_explain_prompt(topic: str, difficulty: str) -> str:
    difficulty_instructions = {
        "Beginner": "Use simple language, intuitive real-world analogies, avoid heavy jargon, and assume zero prior knowledge.",
        "Intermediate": "Balance clear explanations with core technical terms, standard concepts, and practical examples.",
        "Advanced": "Focus on deep architectural mechanics, trade-offs, algorithms, performance characteristics, and edge cases."
    }
    level_note = difficulty_instructions.get(difficulty, difficulty_instructions["Beginner"])

    return f"""ROLE:
You are a world-class Computer Science educator and Technical Explainer.

CONTEXT:
The user wants to learn and deeply understand a technical concept at the **{difficulty}** level.

TASK:
Explain the given technical topic clearly, accurately, and comprehensively.

USER INPUT:
- Technical Topic: {topic}
- Target Difficulty: {difficulty}

INSTRUCTIONS FOR DIFFICULTY LEVEL ({difficulty}):
{level_note}

CONSTRAINTS:
- You MUST cover all 8 core structural elements in your explanation.
- Keep the language engaging, educational, and easy to read.

OUTPUT FORMAT:
Generate Markdown content strictly organized into the following 8 numbered sections:

1. **Definition** (A crisp, 1-2 sentence core definition)
2. **Simple Explanation** (Intuitive explanation tailored to {difficulty} level)
3. **How It Works** (Step-by-step mechanism or architecture)
4. **Important Concepts & Terminology** (Key terms or components)
5. **Practical Example** (Code snippet, scenario, or concrete workflow)
6. **Key Advantages** (Main benefits)
7. **Limitations & Trade-offs** (Drawbacks or constraints)
8. **Real-World Applications** (Where it is used in industry today)
"""


def build_improve_prompt(text: str) -> str:
    return f"""ROLE:
You are a master editor, proofreader, and copywriting specialist.

CONTEXT:
The user has provided raw or poorly written text that needs grammatical correction, stylistic refinement, and professional polish.

TASK:
Analyze the input text, correct all errors, and provide enhanced alternatives and breakdown.

USER INPUT:
```text
{text}
```

CONSTRAINTS:
- Preserve the original meaning and core intent of the author.
- Do not remove key factual details.
- Provide constructive insights on why changes were made.

OUTPUT FORMAT:
Return Markdown content with the following 4 sections:

1. ### ✍️ Corrected Version (Direct Fixes)
(Clean, grammatically correct version maintaining original tone)

2. ### 🚀 Professional / Executive Version
(Polished, articulate, high-impact phrasing suitable for business/academia)

3. ### 🔍 Key Corrections & Fixes
(Bullet points listing specific grammar, punctuation, or word choice fixes)

4. ### 💡 Clarity & Style Notes
(Brief advice on how to improve overall readability and structure)
"""


def build_prompt_generator_prompt(description: str) -> str:
    return f"""ROLE:
You are an expert Prompt Engineer and Large Language Model Systems Architect.

CONTEXT:
The user has a simple or informal request for an AI model and needs a production-grade, highly optimized prompt built using industry-standard prompt engineering framework.

TASK:
Transform the user's raw requirement into a detailed, structured, highly effective System Prompt template.

USER INPUT:
- User Goal / Raw Request: {description}

CONSTRAINTS:
- The generated prompt must follow the 6-part framework: ROLE, CONTEXT, TASK, REQUIREMENTS, CONSTRAINTS, EXPECTED OUTPUT FORMAT.
- Include actionable optimization advice for getting the best outputs from LLMs.

OUTPUT FORMAT:
Return a Markdown document formatted as follows:

# 🎯 Optimized Prompt Template

```markdown
ROLE:
[Detailed role assignment]

CONTEXT:
[Background information & objective]

TASK:
[Step-by-step primary action required]

REQUIREMENTS:
- [Key requirement 1]
- [Key requirement 2]
- [Key requirement 3]

CONSTRAINTS:
- [What NOT to do]
- [Edge cases to avoid]

EXPECTED OUTPUT FORMAT:
[Template or structural layout expected]
```

---

### 💡 Why This Prompt Works (Prompt Engineering Analysis)
- **Role Definition**: Explaining why assigning a role improves model output quality.
- **Explicit Constraints**: Explaining how negative constraints reduce hallucinations.
- **Output Framing**: Explaining how structural formatting guides reasoning.
"""
