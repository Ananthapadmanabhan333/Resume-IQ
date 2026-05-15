import spacy
import re

nlp = spacy.load("en_core_web_sm")

# Expanded, categorized skill database
SKILLS_DB = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "r", "matlab", "scala", "perl", "dart"
    ],
    "Frameworks & Libraries": [
        "react", "node.js", "fastapi", "django", "flask", "spring boot", "angular", "vue", "express", "next.js", "nest.js", "laravel", "rails", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "keras", "opencv"
    ],
    "Cloud & DevOps": [
        "docker", "aws", "kubernetes", "ci/cd", "jenkins", "azure", "gcp", "terraform", "ansible", "github actions", "gitlab ci", "circleci", "linux", "bash", "shell scripting", "nginx", "apache"
    ],
    "Databases": [
        "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "oracle", "sqlite", "graphql", "neo4j"
    ],
    "Core Concepts & Methodologies": [
        "machine learning", "nlp", "deep learning", "computer vision", "agile", "scrum", "kanban", "rest api", "microservices", "system design", "data structures", "algorithms", "object-oriented programming", "tdd", "ci/cd"
    ],
    "Soft Skills": [
        "communication", "leadership", "problem solving", "teamwork", "critical thinking", "time management", "project management", "mentoring"
    ]
}

# Flatten for quick lookup
FLAT_SKILLS = set([skill for category in SKILLS_DB.values() for skill in category])

class SkillExtractor:
    @staticmethod
    def extract_skills(text: str) -> list[str]:
        text_lower = text.lower()
        extracted_skills = set()
        
        # Use simple word boundary regex to avoid partial matches (e.g. matching 'c' in 'contact')
        for skill in FLAT_SKILLS:
            # Escape skill for regex to handle c++, c#, node.js
            escaped_skill = re.escape(skill)
            pattern = r'\b' + escaped_skill + r'\b'
            if re.search(pattern, text_lower):
                extracted_skills.add(skill)
                
        return list(extracted_skills)

    @staticmethod
    def get_missing_skills(resume_skills: list[str], job_skills: list[str]) -> list[str]:
        return list(set(job_skills) - set(resume_skills))
