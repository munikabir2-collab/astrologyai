import hashlib


def stable_score(*values):
    """
    Same birth details => Same compatibility score
    """

    text = "|".join(str(v).strip().lower() for v in values)

    digest = hashlib.md5(text.encode()).hexdigest()

    number = int(digest[:8], 16)

    return 60 + (number % 39)   # 60 - 98


def calculate_compatibility(
    boy_name,
    boy_birth_date,
    boy_birth_time,
    boy_birth_place,
    girl_name,
    girl_birth_date,
    girl_birth_time,
    girl_birth_place,
):

    score = stable_score(
        boy_name,
        boy_birth_date,
        boy_birth_time,
        boy_birth_place,
        girl_name,
        girl_birth_date,
        girl_birth_time,
        girl_birth_place,
    )

    guna = round(score * 36 / 100)

    # -----------------------------
    # Compatibility Category
    # -----------------------------

    if guna >= 30:
        category = "Excellent"
        prediction = (
            "Excellent marriage compatibility. "
            "The relationship has strong emotional, financial and family harmony."
        )

        strengths = [
            "Excellent mutual understanding",
            "Strong emotional bonding",
            "High trust level",
            "Financial stability",
            "Supportive family life",
        ]

        challenges = [
            "Minor communication misunderstandings",
        ]

        remedies = [
            "Offer prayers to Lord Shiva every Monday.",
            "Chant Om Namah Shivaya 108 times.",
        ]

    elif guna >= 24:

        category = "Good"

        prediction = (
            "Marriage compatibility is good. "
            "With mutual respect and communication, this relationship can be successful."
        )

        strengths = [
            "Good understanding",
            "Emotional bonding",
            "Financial support",
        ]

        challenges = [
            "Career pressure",
            "Communication gap",
        ]

        remedies = [
            "Visit Shiva Temple on Monday.",
            "Donate white sweets on Friday.",
        ]

    else:

        category = "Average"

        prediction = (
            "Marriage compatibility is average. "
            "Proper understanding, patience and spiritual remedies are recommended."
        )

        strengths = [
            "Friendship",
            "Learning together",
        ]

        challenges = [
            "Compatibility differences",
            "Family expectations",
            "Financial planning",
        ]

        remedies = [
            "Perform Navagraha Puja.",
            "Recite Maha Mrityunjaya Mantra daily.",
            "Seek blessings from elders.",
        ]

    # -----------------------------
    # Dosha Analysis
    # -----------------------------

    if guna >= 28:
        manglik = "No"
        nadi = "No"
        bhakoot = "Excellent"

    elif guna >= 22:
        manglik = "No"
        nadi = "Minor"
        bhakoot = "Good"

    else:
        manglik = "Possible"
        nadi = "Yes"
        bhakoot = "Needs Attention"

    return {

        "boy": boy_name,

        "girl": girl_name,

        "match_percentage": score,

        "guna_milan": guna,

        "category": category,

        "manglik": manglik,

        "nadi_dosh": nadi,

        "bhakoot": bhakoot,

        "prediction": prediction,

        "strengths": strengths,

        "challenges": challenges,

        "remedies": remedies,

    }