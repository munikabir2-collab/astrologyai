from io import BytesIO
import os
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
PRIMARY = colors.HexColor("#1F4E79")
SECONDARY = colors.HexColor("#5B9BD5")
GOLD = colors.HexColor("#D4AF37")
DARK = colors.HexColor("#222222")
GRAY = colors.HexColor("#666666")
TEXT_COLOR = colors.HexColor("#222222")
LIGHT_BG = colors.HexColor("#F3F6FA")
LIGHT = colors.HexColor("#EAF0F6")
# ==========================================================
# FONT CONFIG
# ==========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

FONT_PATH = os.path.join(
    BASE_DIR,
    "fonts",
    "NotoSansDevanagari-Regular.ttf"
)


if not os.path.exists(FONT_PATH):
    raise FileNotFoundError(
        f"Hindi font not found: {FONT_PATH}"
    )


pdfmetrics.registerFont(
    TTFont(
        "NotoHindi",
        FONT_PATH
    )
)

FONT = "NotoHindi"
# ==========================================================
# STYLES
# ==========================================================

styles = getSampleStyleSheet()


hindi_style = ParagraphStyle(
    "HindiStyle",
    parent=styles["Normal"],
    fontName=FONT,
    fontSize=11,
    leading=16
)
TITLE_STYLE = ParagraphStyle(
    "TITLE_STYLE",
    parent=styles["Title"],
    fontName=FONT,
    fontSize=26,
    leading=32,
    alignment=TA_CENTER,
    textColor=PRIMARY,
    spaceAfter=20,
)

SUBTITLE_STYLE = ParagraphStyle(
    "SUBTITLE_STYLE",
    parent=styles["Heading2"],
    fontName=FONT,
    fontSize=16,
    leading=20,
    alignment=TA_CENTER,
    textColor=GOLD,
    spaceAfter=25,
)

HEADING_STYLE = ParagraphStyle(
    "HEADING_STYLE",
    parent=styles["Heading1"],
    fontName=FONT,
    fontSize=17,
    leading=22,
    textColor=SECONDARY,
    spaceBefore=15,
    spaceAfter=10,
)

BODY_STYLE = ParagraphStyle(
    "BODY_STYLE",
    parent=styles["BodyText"],
    fontName=FONT,
    fontSize=11,
    leading=20,
    textColor=DARK,
    spaceAfter=6,
)

SMALL_STYLE = ParagraphStyle(
    "SMALL_STYLE",
    parent=styles["BodyText"],
    fontName=FONT,
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=GRAY,
)


# ==========================================================
# PARAGRAPH HELPERS
# ==========================================================

def title(text):
    return Paragraph(str(text), TITLE_STYLE)


def subtitle(text):
    return Paragraph(str(text), SUBTITLE_STYLE)


def heading(text):
    return Paragraph(f"🔹 {text}", HEADING_STYLE)


def normal(text):
    if text is None:
        text = ""

    text = str(text).replace("\n", "<br/>")

    return Paragraph(text, BODY_STYLE)


# ==========================================================
# PROFESSIONAL TABLE
# ==========================================================

def create_table(rows, widths=None):

    if widths is None:
        widths = [180, 320]

    table = Table(rows, colWidths=widths)

    table.setStyle(
        TableStyle(
            [

                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

                ("FONTNAME", (0, 0), (-1, -1), FONT),

                ("FONTSIZE", (0, 0), (-1, -1), 10),

                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

                ("BOX", (0, 0), (-1, -1), 1, PRIMARY),

                ("BACKGROUND", (0, 1), (-1, -1), LIGHT),

                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, LIGHT],
                ),

                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
                ("TOPPADDING", (0, 1), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 8),

                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),

                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    return table


# ==========================================================
# HEADER
# ==========================================================

def header(canvas, doc):

    canvas.saveState()

    canvas.setFont(FONT, 18)
    canvas.setFillColor(PRIMARY)

    canvas.drawString(
        35,
        810,
        "🔮 AstroAI Professional Report"
    )

    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)

    canvas.line(
        35,
        800,
        575,
        800,
    )

    canvas.restoreState()


# ==========================================================
# FOOTER
# ==========================================================

def footer(canvas, doc):

    canvas.saveState()

    canvas.setStrokeColor(colors.grey)

    canvas.line(
        35,
        35,
        575,
        35,
    )

    canvas.setFont(FONT, 9)
    canvas.setFillColor(colors.grey)

    canvas.drawString(
        35,
        18,
        "Generated by AstroAI | Swiss Ephemeris | Gemini AI"
    )

    canvas.drawRightString(
        575,
        18,
        f"Page {doc.page}"
    )

    canvas.restoreState()


def generate_pdf(data):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        rightMargin=30,
        leftMargin=30,
        topMargin=50,
        bottomMargin=40,
    )

    story = []

    # ============================
    # Cover
    # ============================

    story.append(title("🔮 AstroAI Professional"))
    story.append(
        subtitle("Vedic Astrology Complete Horoscope Report")
    )

    story.append(Spacer(1, 30))


    # ============================
    # Birth Details
    # ============================

    story.append(heading("👤 Birth Details"))

    bd = data.get("birth_details", {})

    story.append(
        create_table(
            [
                ["Field", "Value"],
                ["Name", data.get("name", "")],
                ["Birth Date", bd.get("date", "")],
                ["Birth Time", bd.get("time", "")],
                ["Birth Place", bd.get("place", "")],
            ]
        )
    )


    # ============================
    # Location
    # ============================

    if data.get("location"):

        story.append(heading("📍 Birth Location"))

        loc = data["location"]

        story.append(
            create_table(
                [
                    ["Field","Value"],
                    [
                        "Latitude",
                        str(loc.get("latitude",""))
                    ],
                    [
                        "Longitude",
                        str(loc.get("longitude",""))
                    ]
                ]
            )
        )


    # ============================
    # Panchang
    # ============================

    if data.get("panchang"):

        story.append(heading("📅 Panchang"))

        rows = [["Field","Value"]]

        for k,v in data["panchang"].items():

            rows.append(
                [
                    str(k).title(),
                    str(v)
                ]
            )

        story.append(create_table(rows))


    # ============================
    # Chart
    # ============================

    if data.get("chart"):

        chart = data["chart"]

        story.append(heading("🌅 Birth Chart"))

        story.append(
            create_table(
                [
                    ["Field","Value"],
                    [
                        "Lagna",
                        chart.get("lagna",{}).get("rashi","")
                    ],
                    [
                        "Moon Sign",
                        chart.get("moon",{}).get("rashi","")
                    ],
                    [
                        "Nakshatra",
                        chart.get("moon",{}).get("nakshatra","")
                    ]
                ]
            )
        )


        story.append(heading("🪐 Planet Positions"))

        rows = [
            [
                "Planet",
                "Rashi",
                "Nakshatra",
                "Longitude"
            ]
        ]


        for planet,info in chart.get("planets",{}).items():

            rows.append(
                [
                    planet,
                    info.get("rashi",""),
                    info.get("nakshatra",""),
                    str(info.get("longitude",""))
                ]
            )


        story.append(
            create_table(
                rows,
                [110,120,150,110]
            )
        )



    # ============================
    # Dasha
    # ============================

    if data.get("dasha"):

        story.append(
            heading("🪐 Vimshottari Dasha")
        )


        rows=[
            [
                "Planet",
                "Years",
                "Start",
                "End"
            ]
        ]


        for item in data["dasha"].get(
            "vimshottari_dasha",
            []
        ):

            rows.append(
                [
                    item.get("planet",""),
                    str(item.get("years","")),
                    item.get("start",""),
                    item.get("end","")
                ]
            )


        story.append(create_table(rows))


    # ============================
    # Gemini AI
    # ============================

    report = (
        data.get("gemini_report")
        or data.get("ai_report")
    )


    if report:

        story.append(
            heading("🤖 Gemini AI Astrology Report")
        )

        story.append(
            normal(report)
        )



    # ============================
    # Predictions
    # ============================


    sections = [
        ("❤️ Marriage Prediction","marriage"),
        ("💼 Career Prediction","career"),
        ("💰 Finance Prediction","finance"),
        ("🩺 Health Prediction","health"),
        ("🧘 Spiritual Guidance","spiritual"),
    ]


    for title_text,key in sections:

        if data.get(key):

            story.append(
                heading(title_text)
            )

            story.append(
                normal(data[key])
            )



    # ============================
    # Lucky Details
    # ============================

    if data.get("lucky_details"):

        story.append(
            heading("🍀 Lucky Details")
        )

        rows=[
            [
                "Category",
                "Value"
            ]
        ]


        for k,v in data["lucky_details"].items():

            rows.append(
                [
                    k,
                    str(v)
                ]
            )


        story.append(
            create_table(rows)
        )



    # ============================
    # Yogas
    # ============================

    if data.get("yogas"):

        story.append(
            heading("🌟 Important Yogas")
        )


        rows=[
            [
                "Yoga",
                "Description"
            ]
        ]


        for y in data["yogas"]:

            rows.append(
                [
                    y.get("name",""),
                    y.get("description","")
                ]
            )


        story.append(
            create_table(rows)
        )



    # ============================
    # Houses
    # ============================

    if data.get("houses"):

        story.append(
            heading("🏠 Houses")
        )


        rows=[
            [
                "House",
                "Sign",
                "Lord"
            ]
        ]


        for h in data["houses"]:

            rows.append(
                [
                    str(h.get("house")),
                    h.get("sign",""),
                    h.get("lord","")
                ]
            )


        story.append(
            create_table(
                rows,
                [90,180,180]
            )
        )



    # ============================
    # Planet Strength
    # ============================

    if data.get("planet_strength"):

        story.append(
            heading("💪 Planet Strength")
        )


        rows=[
            [
                "Planet",
                "Strength"
            ]
        ]


        for k,v in data["planet_strength"].items():

            rows.append(
                [
                    k,
                    str(v)
                ]
            )


        story.append(
            create_table(rows)
        )



    # ============================
    # Gemstone
    # ============================

    if data.get("gemstone"):

        story.append(
            heading("💎 Gemstone Recommendation")
        )

        story.append(
            normal(data["gemstone"])
        )



    # ============================
    # Disclaimer
    # ============================

    story.append(PageBreak())

    story.append(
        heading("⚠ Disclaimer")
    )


    story.append(
        normal(
"""
This astrology report is generated using:

• Swiss Ephemeris
• Vedic Astrology
• Panchang Calculation
• Gemini AI Interpretation


Astrology is provided for spiritual guidance
and self-reflection purposes only.

© AstroAI Professional
"""
        )
    )


    doc.build(
        story,
        onFirstPage=footer,
        onLaterPages=footer,
    )


    pdf = buffer.getvalue()

    buffer.close()

    return pdf