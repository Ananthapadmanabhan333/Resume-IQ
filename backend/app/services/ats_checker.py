class ATSChecker:
    @staticmethod
    def analyze_formatting(text: str, metadata: dict) -> int:
        score = 100
        
        # Penalties based on actual document structure extraction
        if metadata.get("has_images"):
            score -= 15 # Images can confuse parsers completely
        
        if metadata.get("has_tables"):
            score -= 10 # Tables might scramble reading order
            
        # Text-based heuristics
        if "\t" in text[0:1000]: # Tabs might indicate columns
            score -= 5
            
        if " | " in text: # Pipe separators might confuse simple ATS
            score -= 5
            
        # Length heuristics
        word_count = metadata.get("word_count", len(text.split()))
        if word_count > 1500: # Overly long resumes are penalized slightly
            score -= 5
        elif word_count < 150: # Too short
            score -= 10

        return min(max(0, score), 100)
