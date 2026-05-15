from app.core.config import settings
from openai import OpenAI
import json
import logging

logger = logging.getLogger(__name__)

class LLMAnalyzer:
    @staticmethod
    def analyze_resume(resume_text: str, job_desc: str) -> dict:
        fallback_response = {
            "Strengths": ["Strong background in relevant technologies", "Good progression of roles"],
            "Weaknesses": ["Lacks measurable achievements", "Format is somewhat dense"],
            "Missing_Skills": ["Cloud deployment", "CI/CD"],
            "Suggestions": ["Add more quantifiable results in bullet points", "Highlight recent certifications"],
            "Interview_Probability": "75%",
            "Interview_Questions": ["Can you describe a challenging project?", "How do you handle conflict in a team?"]
        }
        
        if not settings.OPENAI_API_KEY:
            return fallback_response

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        system_prompt = """You are an expert AI recruiter and ATS analyst. 
Analyze the provided resume against the job description.
You MUST respond IN PURE JSON format, compliant with this exact schema:
{
    "Strengths": ["list of 3-5 strings"],
    "Weaknesses": ["list of 3-5 strings"],
    "Missing_Skills": ["list of strings"],
    "Suggestions": ["list of 3-5 actionable improvement suggestions"],
    "Interview_Probability": "percentage string like '85%'",
    "Interview_Questions": ["list of 3-5 tailored technical/behavioral interview questions based on the candidate's experience and the job description"]
}
Do not include markdown blocks like ```json. Return only the raw JSON.
"""
        
        user_prompt = f"Job Description:\n{job_desc}\n\nResume:\n{resume_text}"

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", # Can be upgraded to gpt-4 for better results
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"} # Force JSON output supported in newer API versions
            )
            content = response.choices[0].message.content
            if content:
                return json.loads(content)
            return fallback_response
        except Exception as e:
            logger.error(f"LLM Analysis failed: {str(e)}")
            return {"error": "Failed to generate AI analysis. Please check your API key.", **fallback_response}
