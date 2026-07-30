from app.services.gemini_service import ask_gemini


def generate_astrology_report(chart, panchang, dasha):

    current = dasha["current_mahadasha"]

    timeline = "\n".join(
        [
            f"{i+1}. {item['planet']} : {item['years']} वर्ष ({item['start']} → {item['end']})"
            for i, item in enumerate(dasha["vimshottari_dasha"])
        ]
    )

    prompt = f"""
आप एक अनुभवी वैदिक ज्योतिषाचार्य हैं।

नीचे Swiss Ephemeris द्वारा गणना की गई वास्तविक जन्म कुंडली दी गई है।

==============================
जन्म कुंडली
==============================

लग्न: {chart["lagna"]["rashi"]}

चंद्र राशि: {chart["moon"]["rashi"]}

जन्म नक्षत्र: {chart["moon"]["nakshatra"]}

==============================
वर्तमान महादशा
==============================

ग्रह: {current["planet"]}

अवधि: {current["years"]} वर्ष

प्रारम्भ: {current["start"]}

समाप्ति: {current["end"]}

==============================
पूरी विम्शोत्तरी दशा
==============================

{timeline}

==============================
पंचांग
==============================

तिथि: {panchang["tithi"]}
योग: {panchang["yoga"]}
करण: {panchang["karana"]}
वार: {panchang["weekday"]}

==============================
ग्रहों की स्थिति
==============================

{chart["planets"]}

==============================
विश्लेषण
==============================

कृपया केवल हिंदी में विस्तृत रिपोर्ट दें।

इन विषयों पर विस्तार से लिखें—

1. व्यक्तित्व
2. मानसिक स्वभाव
3. करियर
4. सरकारी नौकरी योग
5. व्यापार योग
6. धन एवं संपत्ति
7. विवाह
8. प्रेम जीवन
9. संतान सुख
10. स्वास्थ्य
11. शिक्षा
12. विदेश यात्रा योग
13. राजयोग
14. ग्रह दोष
15. वर्तमान महादशा का प्रभाव
16. अगले 12 महीनों का भविष्य
17. अगली महादशा का प्रभाव
18. शुभ रंग
19. शुभ अंक
20. शुभ दिन
21. शुभ रत्न
22. इष्ट देव
23. बीज मंत्र
24. दैनिक उपाय
25. किन बातों से बचना चाहिए

उत्तर सरल, स्पष्ट, विस्तृत तथा पेशेवर हिंदी में दें।
"""

    try:
        report = ask_gemini(prompt)

        if not report or len(report.strip()) < 50:
            raise Exception("Empty Gemini response")

        return report

    except Exception as e:
        print("Gemini AI Error:", e)

        return f"""
⚠️ AI विश्लेषण इस समय उपलब्ध नहीं है।

फिर भी आपकी जन्म कुंडली सफलतापूर्वक तैयार कर दी गई है।

मुख्य जानकारी

• लग्न : {chart["lagna"]["rashi"]}
• चंद्र राशि : {chart["moon"]["rashi"]}
• जन्म नक्षत्र : {chart["moon"]["nakshatra"]}

वर्तमान महादशा
• ग्रह : {current["planet"]}
• अवधि : {current["years"]} वर्ष

पंचांग
• तिथि : {panchang["tithi"]}
• वार : {panchang["weekday"]}
• योग : {panchang["yoga"]}
• करण : {panchang["karana"]}

Gemini AI सर्वर इस समय व्यस्त है।
कृपया कुछ समय बाद पुनः प्रयास करें।
"""