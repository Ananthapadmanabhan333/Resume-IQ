from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.parser import ResumeParser
from app.services.skill_extractor import SkillExtractor
from app.services.similarity import SimilarityEngine
from app.services.ats_checker import ATSChecker
from app.services.score_calculator import ScoreCalculator
from app.services.llm_analyzer import LLMAnalyzer
from app.services.fraud_detector import analyze_experience_authenticity

router = APIRouter()

class AnalysisResponse(BaseModel):
    status: str
    candidate_info: dict
    scores: dict
    skills: dict
    ai_analysis: dict
    metadata: dict
    fraud_analysis: dict

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Validate file
        if not resume.filename.endswith((".pdf", ".docx", ".txt")):
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")

        # 1. Read and Parse Resume
        file_bytes = await resume.read()
        resume_text, metadata = ResumeParser.extract_text_and_metadata(file_bytes, resume.filename)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the provided file.")

        entities = ResumeParser.extract_entities(resume_text)
        
        # 2. Extract Skills
        resume_skills = SkillExtractor.extract_skills(resume_text)
        job_skills = SkillExtractor.extract_skills(job_description)
        missing_skills = SkillExtractor.get_missing_skills(resume_skills, job_skills)
        
        if len(job_skills) > 0:
            skill_match_pct = (len(resume_skills) / len(job_skills)) * 100
            skill_match_pct = min(100, skill_match_pct)
        else:
            skill_match_pct = 100.0 if not resume_skills else 50.0

        # 3. Job Description Similarity
        similarity_score = SimilarityEngine.calculate_similarity(resume_text, job_description)
        
        # 4. ATS Compatibility
        ats_score = ATSChecker.analyze_formatting(resume_text, metadata)
        
        # 5. Final Score Calculation
        final_score = ScoreCalculator.calculate_final_score(
            skill_match=skill_match_pct,
            similarity_score=similarity_score,
            ats_score=ats_score
        )
        
        # 6. LLM AI Analysis (Strengths, weaknesses, suggestions, interview prep)
        ai_analysis = LLMAnalyzer.analyze_resume(resume_text, job_description)

        # 7. Fraud Detection
        fraud_analysis = analyze_experience_authenticity(resume_text)
        
        return {
            "status": "success",
            "candidate_info": entities,
            "scores": {
                "overall_score": round(final_score, 2),
                "skill_match_percentage": round(skill_match_pct, 2),
                "similarity_score": round(similarity_score, 2),
                "ats_compatibility_score": ats_score,
            },
            "skills": {
                "detected": resume_skills,
                "missing": missing_skills,
            },
            "ai_analysis": ai_analysis,
            "metadata": metadata,
            "fraud_analysis": fraud_analysis
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
