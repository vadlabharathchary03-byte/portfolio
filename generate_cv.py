import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)

def create_cv(filename):
    # A4: 210 x 297 mm (~595.28 x 841.89 pt)
    # Margins: 14mm (~39.7pt) top/bottom, 15mm (~42.5pt) left/right
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
        title="Vadla Bharath Chary - Full Stack Developer CV",
        author="Vadla Bharath Chary"
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0F172A")       # Slate 900
    ACCENT = colors.HexColor("#0284C7")        # Sky 600
    SUBTEXT = colors.HexColor("#334155")       # Slate 700
    MUTED = colors.HexColor("#64748B")         # Slate 500
    LINE_COLOR = colors.HexColor("#CBD5E1")    # Slate 300
    TAG_BG = colors.HexColor("#F1F5F9")        # Slate 100
    HIGHLIGHT_BG = colors.HexColor("#F0F9FF")  # Sky 50
    HIGHLIGHT_BORDER = colors.HexColor("#BAE6FD") # Sky 200

    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=22,
        textColor=PRIMARY,
        alignment=1 # Center
    )

    title_style = ParagraphStyle(
        'Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=ACCENT,
        alignment=1 # Center
    )

    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=SUBTEXT,
        alignment=1 # Center
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=PRIMARY,
        spaceAfter=3,
        spaceBefore=0
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=10.8,
        textColor=SUBTEXT
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.8,
        textColor=PRIMARY
    )

    item_title = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.6,
        leading=11,
        textColor=PRIMARY
    )

    item_date = ParagraphStyle(
        'ItemDate',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=MUTED,
        alignment=2 # Right
    )

    tech_tag_style = ParagraphStyle(
        'TechTag',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.8,
        leading=10,
        textColor=ACCENT
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=SUBTEXT,
        alignment=1 # Center
    )

    story = []

    # 1. Header
    story.append(Paragraph("VADLA BHARATH CHARY", name_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("FULL STACK DEVELOPER", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph(
        "Mahabubnagar, Telangana, India &nbsp;&bull;&nbsp; +91 8374801364 &nbsp;&bull;&nbsp; vadlabharathchary03@gmail.com",
        contact_style
    ))
    story.append(Spacer(1, 1.5))
    story.append(Paragraph(
        "Portfolio: <b>portfolio-wine-one-46gg9w9qbi.vercel.app</b> &nbsp;&bull;&nbsp; GitHub: <b>vadlabharathchary03-byte</b> &nbsp;&bull;&nbsp; Instagram: <b>@bharath__1</b>",
        contact_style
    ))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=1, spaceAfter=5))

    # 2. Professional Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_heading))
    story.append(Paragraph(
        "Aspiring and versatile <b>Full Stack Developer</b> focused on building modern, scalable, end-to-end web applications. "
        "Strong foundation in responsive frontend interfaces (HTML5, CSS3, JavaScript ES6+, React) alongside server-side development, "
        "RESTful APIs, and database management. Passionate about clean architecture, seamless user experiences, "
        "high performance, and continuously learning emerging full-stack web technologies.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceBefore=1, spaceAfter=4))

    # 3. Technical Skills
    story.append(Paragraph("TECHNICAL SKILLS", section_heading))
    skills_data = [
        [
            Paragraph("<b>Frontend Core:</b>", body_style),
            Paragraph("HTML5, Semantic Web, CSS3, Flexbox, CSS Grid, JavaScript (ES6+), Responsive Web Design", body_style)
        ],
        [
            Paragraph("<b>Backend & APIs:</b>", body_style),
            Paragraph("Node.js Basics, Express.js Concepts, RESTful APIs, JSON, LocalStorage & State Handling", body_style)
        ],
        [
            Paragraph("<b>Frameworks & UI:</b>", body_style),
            Paragraph("React.js Fundamentals, Tailwind CSS, Modern UI / Glassmorphism, Micro-Animations, Components", body_style)
        ],
        [
            Paragraph("<b>Tools & Workflow:</b>", body_style),
            Paragraph("Git, GitHub Version Control, VS Code, Browser DevTools, Figma to HTML/CSS Conversion", body_style)
        ],
        [
            Paragraph("<b>Architecture & Quality:</b>", body_style),
            Paragraph("Cross-Browser Compatibility, Performance Optimization, SEO Best Practices, Clean Code Structure", body_style)
        ]
    ]
    skills_table = Table(skills_data, colWidths=[34 * mm, 148 * mm])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceBefore=1, spaceAfter=4))

    # 4. Featured Projects
    story.append(Paragraph("FEATURED PROJECTS", section_heading))
    
    # Project 1
    p1_head = Table([
        [Paragraph("<b>E-Commerce Web Application</b>", item_title), Paragraph("HTML5 &bull; CSS3/Grid &bull; JavaScript &bull; Local Storage", tech_tag_style)]
    ], colWidths=[90 * mm, 92 * mm])
    p1_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(p1_head)
    story.append(Paragraph("Dynamic responsive online store interface featuring category filtering, interactive cart drawer, local storage persistence, checkout workflow, and fluid UI animations.", body_style))
    story.append(Spacer(1, 2.5))

    # Project 2
    p2_head = Table([
        [Paragraph("<b>Creative Agency Showcase</b>", item_title), Paragraph("HTML5 &bull; Modern CSS &bull; JavaScript &bull; Responsive UI", tech_tag_style)]
    ], colWidths=[90 * mm, 92 * mm])
    p2_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(p2_head)
    story.append(Paragraph("High-converting dark-theme agency landing page engineered with glassmorphism aesthetics, animated statistics counters, interactive testimonials, and optimal mobile responsiveness.", body_style))
    story.append(Spacer(1, 2.5))

    # Project 3
    p3_head = Table([
        [Paragraph("<b>Interactive Dashboard & Weather Portal</b>", item_title), Paragraph("JavaScript ES6 &bull; Async/Await &bull; REST API &bull; CSS Variables", tech_tag_style)]
    ], colWidths=[90 * mm, 92 * mm])
    p3_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(p3_head)
    story.append(Paragraph("Multi-widget productivity dashboard integrating live weather data via REST APIs, asynchronous data handling, task management, dynamic theme customization, and modular components.", body_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceBefore=1, spaceAfter=4))

    # 5. Experience & Development Journey
    story.append(Paragraph("EXPERIENCE &amp; DEVELOPMENT JOURNEY", section_heading))
    
    exp1_head = Table([
        [Paragraph("<b>Full Stack Developer &amp; Project Builder</b> &nbsp;|&nbsp; Freelance &amp; Independent", item_title), Paragraph("2023 &ndash; Present", item_date)]
    ], colWidths=[140 * mm, 42 * mm])
    exp1_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(exp1_head)
    story.append(Paragraph("Architecting and developing end-to-end web applications, building responsive frontends, integrating RESTful APIs and databases, optimizing system performance, and delivering complete web solutions.", body_style))
    story.append(Spacer(1, 2.5))

    exp2_head = Table([
        [Paragraph("<b>Intensive Web &amp; Software Development Training</b> &nbsp;|&nbsp; Self-Directed", item_title), Paragraph("2022 &ndash; 2023", item_date)]
    ], colWidths=[140 * mm, 42 * mm])
    exp2_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(exp2_head)
    story.append(Paragraph("Completed comprehensive training in modern HTML5, advanced CSS layout architectures (Flexbox/Grid), modern JavaScript ES6+, asynchronous programming, DOM APIs, and Git collaborative workflows.", body_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceBefore=1, spaceAfter=4))

    # 6. Education
    story.append(Paragraph("EDUCATION", section_heading))
    edu_head = Table([
        [Paragraph("<b>Bachelor of Technology (B.Tech) &ndash; Computer Science &amp; Engineering (CSE)</b>", item_title), Paragraph("Undergraduate", item_date)]
    ], colWidths=[140 * mm, 42 * mm])
    edu_head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
    ]))
    story.append(edu_head)
    story.append(Paragraph("1st Year Undergraduate Student &nbsp;&bull;&nbsp; Focusing on Data Structures, Algorithms, Software Engineering Principles, and Web Technologies.", body_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LINE_COLOR, spaceBefore=1, spaceAfter=4))

    # 7. Selected Highlights & Opportunities
    story.append(Paragraph("SELECTED HIGHLIGHTS", section_heading))
    highlights_html = (
        "&bull; <b>5+ Real-World Projects:</b> Built responsive web applications optimized for desktop, tablet, and mobile screens.<br/>"
        "&bull; <b>End-to-End Mindset:</b> Capable of designing intuitive UI/UX frontend interfaces as well as structuring clean backend logic.<br/>"
        "&bull; <b>Code Excellence:</b> Passionate about modular code structure, performance optimization, SEO best practices, and clean architecture."
    )
    story.append(Paragraph(highlights_html, body_style))
    story.append(Spacer(1, 4))

    # Status Callout Box
    status_text = Paragraph(
        "💼 <b>Status:</b> Open to internships, freelance projects, and entry-level full stack developer opportunities.",
        callout_style
    )
    status_box = Table([[status_text]], colWidths=[182 * mm])
    status_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(status_box)

    doc.build(story)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    create_cv("Vadla_Bharath_Chary_CV.pdf")
    create_cv("cv.pdf")
