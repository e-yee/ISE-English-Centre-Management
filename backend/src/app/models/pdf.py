from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        pass
    
    def footer(self):
        pass

    def chapter_title(self, title):
        pass

    def chapter_body(self, body):
        pass
