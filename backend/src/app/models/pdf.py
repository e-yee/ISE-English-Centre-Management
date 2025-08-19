from fpdf import FPDF
import os, datetime
from flask import current_app
from pathlib import Path

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
            self.ln(25)
        self.set_font("Times", "B", 14)
        self.cell(0, 10, "Student Assessment", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Times", "I", 9)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def chapter_title(self, title):
        self.set_font("Times", "B", 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 0, 1, "L", fill=True)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font("Times", "", 12)
        self.multi_cell(0, 10, body)
        self.ln()

    def create_table(self, headers, data):
        self.set_font("Times", "B", 11)
        col_width = self.w / (len(headers) + 1)
        
        for header in headers:
            self.cell(col_width, 10, header, 1, 0, 'C')
        self.ln()
        
        self.set_font("Times", "", 11)
        for row in data:
            for item in row:
                self.cell(col_width, 10, str(item), 1, 0, 'L')
            self.ln()


def generate_report(data, output_path, logo_path=None):
    """
    Generates a PDF report from a dictionary of data and saves it to a file.
    """
    pdf = PDF(logo_path=logo_path)
    pdf.add_page()

    pdf.chapter_title("Student Information")
    pdf.chapter_body(f"ID: {data['student_id']}\nName: {data['student_name']}")

    pdf.chapter_title("Course Information")
    pdf.chapter_body(f"Course ID: {data['course_id']}\nCourse Name: {data['course_name']}")

    pdf.chapter_title("Teacher Information")
    pdf.chapter_body(f"ID: {data['teacher_id']}\nName: {data['teacher_name']}")


    pdf.chapter_title("Evaluation Details")
    
    evaluation_headers = ['Assessment Type', 'Grade']
    evaluation_data = list(data['evaluation_details'].items())
    
    if evaluation_data:
        pdf.create_table(evaluation_headers, evaluation_data)
    else:
        pdf.chapter_body("No evaluation details provided.")
    
    pdf.ln(10) 
    
    pdf.set_font(pdf.font_family, 'I', 9)
    report_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.cell(0, 10, f"Report generated on: {report_date}", 0, 1, 'R')

    pdf.output(output_path)
