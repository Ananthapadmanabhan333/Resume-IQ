class ScoreCalculator:
    @staticmethod
    def calculate_final_score(skill_match: float, similarity_score: float, ats_score: float) -> float:
        # Based on user requested weights conceptually:
        # Skill: 40%
        # Similarity: 50%
        # ATS: 10%
        
        final_score = (skill_match * 0.40) + (similarity_score * 0.50) + (ats_score * 0.10)
        return min(max(final_score, 0), 100)
