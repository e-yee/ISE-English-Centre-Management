from fpdf import FPDF
import os, datetime
from flask import current_app
from pathlib import Path
import tkinter as tk

class PDF(FPDF):
    def __init__(self, logo_path=None):
        super().__init__()
        self.logo_path = logo_path

        # Register Times New Roman with Unicode support
        app_root = Path(current_app.root_path).parent
        font_dir = app_root / "fonts"
        self.add_font("Times", "", os.path.join(font_dir, "TIMES.TTF"), uni=True)
        self.add_font("Times", "B", os.path.join(font_dir, "TIMESBD.TTF"), uni=True)
        self.add_font("Times", "I", os.path.join(font_dir, "TIMESI.TTF"), uni=True)
        self.add_font("Times", "BI", os.path.join(font_dir, "TIMESBI.TTF"), uni=True)

        self.set_font("Times", "", 12)  # Default font

    def header(self):
        if self.logo_path:
            self.image(self.logo_path, 10, 8, 25)
            self.ln(15)
        self.set_font("Times", "B", 16)
        self.cell(0, 10, "Report Card", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Times", "I", 9)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def chapter_title(self, title):
        self.set_font("Times", "B", 12)
        self.set_fill_color(200, 220, 255)
        self.cell(190, 10, title, 0, 1, "L", fill=True)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font("Times", "", 12)
        self.multi_cell(0, 10, body)
        self.ln()

    def create_table(self, headers, data):
        self.set_font("Times", "B", 11)

        # Set custom column widths
        col_widths = [40, 25, self.w - 40 - 25 - 20]  # adjust numbers to fit nicely (last 20 = margin)
        
        # Print headers
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 10, header, 1, 0, 'C')
        self.ln()
        
        self.set_font("Times", "", 11)
        for row in data:
            for i, item in enumerate(row):
                align = "C" if i == 1 else "L"
                self.cell(col_widths[i], 10, str(item), 1, 0, align)
            self.ln()



def generate_report(data, output_path, logo_path=None):
    pdf = PDF(logo_path=logo_path)
    pdf.add_page()

    # --- Student & Teacher side by side ---
    root = tk.Tk()
    h = root.winfo_screenheight()
    pdf.set_font("Times", 'B', 12)
    pdf.set_fill_color(200, 220, 255)
    pdf.cell(h / 4, 8, "Student Information", 0, 0, 'L', fill=True)
    pdf.cell(h / 4, 8, "Teacher Information", 0, 1, 'L', fill=True)

    pdf.set_font("Times", '', 12)
    # Student Info
    pdf.multi_cell(95, 8, f"ID: {data['student_id']}\nName: {data['student_name']}", border=0)
    x = pdf.get_x()
    y = pdf.get_y()
    pdf.set_xy(x + 95, y - 16)  # Move to right column for teacher
    pdf.multi_cell(95, 8, f"ID: {data['teacher_id']}\nName: {data['teacher_name']}", border=0)
    pdf.ln(5)

    pdf.chapter_title("Course Information")
    pdf.chapter_body(f"Course ID: {data['course_id']}\nCourse Name: {data['course_name']}")

    # --- Evaluation Section ---
    pdf.chapter_title("Evaluation Details")

    evaluation_headers = ["Assessment Type", "Grade", "Comment"]
    evaluation_data = data['evaluation_details']

    if evaluation_data:
        pdf.create_table(evaluation_headers, evaluation_data)
    else:
        pdf.chapter_body("No evaluation details provided.")

    # --- Report Footer ---
    pdf.ln(10)
    pdf.set_font("Times", 'I', 9)
    report_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.cell(0, 10, f"Report generated on: {report_date}", 0, 1, 'R')

    root.destroy()
    pdf.output(output_path)
