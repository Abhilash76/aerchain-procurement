import random

# Vendor-specific data profiles for realistic comparison
VENDOR_PROFILES = {
    "Nexus Creative": {
        "costs": {"Strategy": 120000, "TVC": 450000, "Social": 80000, "Compliance": 15000},
        "scores": {"Strategy": 95, "Creative": 98, "Speed": 75, "Compliance": 90},
        "style": "premium, high-quality, high-budget"
    },
    "Global Media Hub": {
        "costs": {"Strategy": 80000, "TVC": 300000, "Social": 120000, "Compliance": 25000},
        "scores": {"Strategy": 85, "Creative": 80, "Speed": 92, "Compliance": 98},
        "style": "efficient, global-scale, integrated"
    },
    "Velocity Studios": {
        "costs": {"Strategy": 50000, "TVC": 200000, "Social": 60000, "Compliance": 10000},
        "scores": {"Strategy": 70, "Creative": 85, "Speed": 95, "Compliance": 80},
        "style": "fast, agile, cost-effective"
    }
}

LINE_ITEMS = [
    "Strategy & Creative Development", "TVC Development", "TVC Production",
    "Social Organic", "Social Paid", "Compliance Review", "Program Management"
]

def get_marketing_jargon():
    jargon = [
        "360-degree brand amplification", "holistic consumer engagement", "data-driven market penetration",
        "omni-channel synergy", "synergistic touchpoints", "growth-hacking strategy",
        "bleeding-edge creative disruption", "agile response framework", "paradigm-shifting ROI",
        "hyper-local cultural relevance", "seamless platform integration", "quantum-leap brand awareness"
    ]
    return random.choice(jargon)

def generate_messy_paragraph(vendor_name, include_cost=False, cost_category=None):
    profile = VENDOR_PROFILES.get(vendor_name, VENDOR_PROFILES["Nexus Creative"])
    
    paragraphs = [
        f"Our {get_marketing_jargon()} approach ensures that the NutriKid launch will exceed all stakeholder expectations. Through careful {get_marketing_jargon()} and rigorous testing, we have developed a methodology that scales effortlessly.",
        f"The technical specifications for the TVC production involve {get_marketing_jargon()} across all regional hubs. This allows for a {get_marketing_jargon()} that is both cost-effective and high-impact.",
        f"Compliance is at the heart of our {get_marketing_jargon()} system. We utilize {get_marketing_jargon()} to verify all claims against regional regulations.",
        f"Regarding the strategy, we believe that {get_marketing_jargon()} is the key to unlocking market share in SEA. Our team will deploy {get_marketing_jargon()} to maximize reach."
    ]
    p = random.choice(paragraphs)
    
    if include_cost and cost_category in profile["costs"]:
        base_cost = profile["costs"][cost_category]
        # Variation to make it messy
        actual_cost = base_cost + random.randint(-5000, 5000)
        p += f" [COMMERCIAL] The itemized fee for {cost_category} is projected at ${actual_cost:,} inclusive of agency overhead but excluding third-party pass-throughs."
    
    if random.random() > 0.8:
        # Inject score hint
        cat = random.choice(list(profile["scores"].keys()))
        score = profile["scores"][cat]
        p += f" [METRIC] Our internal audit scores this workstream at a {score}% efficiency rating."
        
    return p

def get_random_sow_point():
    return random.choice([
        "Strategy", "Creative", "Execution Speed", 
        "Market Reach", "Media Optimization", "Compliance"
    ])
