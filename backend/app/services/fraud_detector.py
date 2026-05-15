import spacy

def analyze_experience_authenticity(text: str) -> dict:
    """
    Experimental Fake Experience Detection Engine.
    Analyzes resume text for common indicators of fabricated experience:
    - Overuse of extreme superlatives
    - Vague descriptions without metrics
    - Inconsistent timelines
    """
    warnings = []
    suspicion_score = 0
    
    superlatives = ["expert", "mastered", "transformed", "revolutionized", "saved millions", "single-handedly"]
    vague_terms = ["worked on", "involved in", "assisted with", "helped", "various tasks"]
    
    text_lower = text.lower()
    
    sup_count = sum(1 for word in superlatives if word in text_lower)
    if sup_count > 3:
        warnings.append(f"High usage of extreme superlatives ({sup_count} found). Potential exaggeration.")
        suspicion_score += 20
        
    vague_count = sum(1 for word in vague_terms if word in text_lower)
    if vague_count > 5:
        warnings.append(f"Excessive use of vague action verbs ({vague_count} found). Verify specific contributions.")
        suspicion_score += 15

    # Look for lack of numbers/metrics
    has_numbers = any(char.isdigit() for char in text)
    if not has_numbers:
        warnings.append("Complete lack of quantifiable metrics or numbers in experience.")
        suspicion_score += 30

    return {
        "is_suspicious": suspicion_score > 40,
        "suspicion_score": min(100, suspicion_score),
        "warnings": warnings
    }
