from fpdf import FPDF
import os, datetime
from flask import current_app
from pathlib import Path

class PDF(FPDF):
    def __init__(self, logo_path=None):
        super().__init__()
        self.logo_path = self._resolve_logo_path(logo_path)

        # Register Times New Roman with Unicode support using a portable font-dir strategy
        font_dir = self._get_font_dir()
        try:
            self.add_font("Times", "", os.path.join(font_dir, "TIMES.TTF"), uni=True)
            self.add_font("Times", "B", os.path.join(font_dir, "TIMESBD.TTF"), uni=True)
            self.add_font("Times", "I", os.path.join(font_dir, "TIMESI.TTF"), uni=True)
            self.add_font("Times", "BI", os.path.join(font_dir, "TIMESBI.TTF"), uni=True)
        except Exception:
            # If custom TTFs are not available, fall back to core font (limited Unicode)
            pass

        self.set_font("Times", "", 12)  # Default font
        # Stable pagination across environments
        self.set_auto_page_break(auto=True, margin=15)

    def _get_font_dir(self):
        """Resolve a usable fonts directory across environments.
        Prefer `backend/fonts` relative to the Flask app root; fall back to paths relative to this file.
        """
        try:
            app_root = Path(current_app.root_path)  # typically backend/src/app
        except Exception:
            app_root = Path(__file__).resolve()

        candidates = [
            # If app_root == backend/src/app -> backend/fonts
            app_root.parent.parent / "fonts",
            # If running relative to this file -> backend/fonts
            Path(__file__).resolve().parents[3] / "fonts",
            # Fallback: sibling fonts under src
            app_root.parent / "fonts",
        ]
        for p in candidates:
            if p.is_dir():
                return str(p)
        # Final fallback: current file directory
        return str(Path(__file__).resolve().parent)

    def _resolve_logo_path(self, provided_path):
        """Return a valid logo path if available, otherwise None.
        Tries the provided path, then common locations within the project.
        """
        if provided_path:
            try:
                p = Path(provided_path)
                if p.is_file():
                    return str(p)
            except Exception:
                pass

        try:
            app_root = Path(current_app.root_path)
        except Exception:
            app_root = Path(__file__).resolve()

        candidates = [
            # backend/src/test.png
            app_root.parent / "test.png",
            # backend/test.png
            app_root.parent.parent / "test.png",
        ]
        for c in candidates:
            if c.is_file():
                return str(c)
        return None

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
        self.cell(0, 10, title, 0, 1, "L", fill=True)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font("Times", "", 12)
        self.multi_cell(0, 10, body)
        self.ln()

    def _compute_column_widths(self, headers, widths=None):
        epw = self.w - self.l_margin - self.r_margin
        num_cols = len(headers)
        if widths and len(widths) == num_cols:
            return widths
        # Simple even distribution fallback
        base = epw / num_cols
        return [base for _ in headers]

    def _row_height(self, texts, col_widths, line_height=8):
        # Estimate row height using number of lines each cell will occupy
        # Create a temporary MultiCell calculation by splitting text width
        max_lines = 1
        for text, width in zip(texts, col_widths):
            # crude wrap estimate: number of lines = ceil(string_width / width)
            self.set_font("Times", "", 11)
            str_w = self.get_string_width(str(text))
            lines = max(1, int((str_w // (width - 2)) + 1)) if width > 2 else 1
            if lines > max_lines:
                max_lines = lines
        return max_lines * line_height

    def create_table(self, headers, data, col_widths=None, header_fill=(230, 240, 255), line_height=8):
        # Prepare
        self.set_font("Times", "B", 11)
        # Effective page width (accounts for margins)
        epw = self.w - self.l_margin - self.r_margin
        # Column widths as ratios of effective width for consistency across machines
        col_widths = col_widths or [epw * 0.45, epw * 0.15, epw * 0.40]
        
        # Print headers
        if header_fill:
            self.set_fill_color(*header_fill)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 10, header, 1, 0, 'C', fill=bool(header_fill))
        self.ln()
        
        self.set_font("Times", "", 11)
        for row in data:
            row = ["" if v is None else v for v in row]
            row_h = self._row_height(row, col_widths, line_height)
            if self.get_y() + row_h > self.page_break_trigger:
                # new page: reprint header
                self.add_page()
                self.set_font("Times", "B", 11)
                if header_fill:
                    self.set_fill_color(*header_fill)
                for header, w in zip(headers, col_widths):
                    y_before = self.get_y()
                    x_before = self.get_x()
                    self.multi_cell(w, line_height, str(header), border=1, align='C', fill=bool(header_fill))
                    self.set_xy(x_before + w, y_before)
                self.ln(row_h)
                self.set_font("Times", "", 11)

            x_row = self.get_x()
            y_row = self.get_y()
            for i, (cell, w) in enumerate(zip(row, col_widths)):
                align = 'C' if isinstance(cell, (int, float)) else 'L'
                y_before = self.get_y()
                x_before = self.get_x()
                self.multi_cell(w, line_height, str(cell), border=1, align=align)
                self.set_xy(x_before + w, y_before)
            self.ln(row_h)



def generate_report(data, output_path, logo_path=None):
    pdf = PDF(logo_path=logo_path)
    pdf.add_page()

    # Metrics for consistent layout
    epw = pdf.w - pdf.l_margin - pdf.r_margin
    col_w = epw / 2

    # --- Student & Teacher side by side ---
    pdf.set_font("Times", 'B', 12)
    pdf.set_fill_color(200, 220, 255)
    pdf.cell(col_w, 8, "Student Information", 0, 0, 'L', fill=True)
    pdf.cell(col_w, 8, "Teacher Information", 0, 1, 'L', fill=True)

    pdf.set_font("Times", '', 12)
    left_text = f"ID: {data['student_id']}\nName: {data['student_name']}"
    right_text = f"ID: {data['teacher_id']}\nName: {data['teacher_name']}"

    x_left = pdf.l_margin
    y_start = pdf.get_y()
    # Left column
    pdf.set_xy(x_left, y_start)
    pdf.multi_cell(col_w, 8, left_text, border=0)
    y_after_left = pdf.get_y()
    # Right column
    pdf.set_xy(x_left + col_w, y_start)
    pdf.multi_cell(col_w, 8, right_text, border=0)
    y_after_right = pdf.get_y()
    # Move cursor below the taller column
    pdf.set_xy(pdf.l_margin, max(y_after_left, y_after_right))
    pdf.ln(5)

    # --- Course Section ---
    pdf.chapter_title("Course Information")
    course_lines = []
    if data.get('course_id') is not None:
        course_lines.append(f"Course ID: {data.get('course_id','')}")
    if data.get('course_name'):
        course_lines.append(f"Course Name: {data.get('course_name','')}")
    pdf.chapter_body("\n".join(course_lines) if course_lines else "")

    # --- Evaluation Section ---
    pdf.chapter_title("Evaluation Details")
    evaluation_headers = ["Assessment Type", "Grade", "Comment"]
    evaluation_data = data.get('evaluation_details', []) or []
    if evaluation_data:
        pdf.create_table(evaluation_headers, evaluation_data)
    else:
        pdf.chapter_body("No evaluation details provided.")

    # --- Report Footer ---
    pdf.ln(10)
    pdf.set_font("Times", 'I', 9)
    report_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.cell(0, 10, f"Report generated on: {report_date}", 0, 1, 'R')

    pdf.output(output_path)

