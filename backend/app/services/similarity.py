from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

class SimilarityEngine:
    @staticmethod
    def calculate_similarity(resume_text: str, job_desc: str) -> float:
        # Encode sentences to get their embeddings
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        job_embedding = model.encode(job_desc, convert_to_tensor=True)
        
        # Compute cosine-similarity
        cosine_score = util.pytorch_cos_sim(resume_embedding, job_embedding)
        return round(float(cosine_score.item()) * 100, 2)
