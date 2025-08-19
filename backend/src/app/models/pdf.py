from fpdf import FPDF
import io

class PDF(FPDF):
    def __init__(self, logo_path):
        super().__init__()
        self.logo_path = logo_path

    def header(self):
        if self.logo_path:
            self.image(self.logo_path, 10, 8, 25)
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Student Assessment", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def chapter_title(self, title):
        self.set_font("Arial", "B", 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 0, 1, "L", fill=True)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font("Arial", "", 12)
        self.multi_cell(0, 10, body)
        self.ln()


def generate_report(data, output_path, logo_path=None):
    pdf = PDF(logo_path=logo_path)
    pdf.add_page()

    pdf.chapter_title("Student Information")
    pdf.chapter_body(f"ID: {data['student_id']}\nName: {data['student_name']}")

    pdf.chapter_title("Course Information")
    pdf.chapter_body(f"Course ID: {data['course_id']}\nCourse Name: {data['course_name']}")

    pdf.chapter_title("Teacher Information")
    pdf.chapter_body(f"ID: {data['teacher_id']}\nName: {data['teacher_name']}")

    # pdf.chapter_title("Assessment")
    # pdf.chapter_body(f"Type: {data['assessment_type']}\n\nComment: {data['comment']}")

    bytes = pdf.output(dest='S').encode('utf-8')
    return io.BytesIO(bytes)
