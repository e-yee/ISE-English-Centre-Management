from pathlib import Path
from flask import render_template
from weasyprint import HTML, CSS


def render_report_html_to_pdf(data: dict, output_path: str, base_url: str, css_path: str | None = None) -> None:
    """Render the report card HTML template to a PDF file using WeasyPrint.

    Args:
        data: Context dictionary expected by the Jinja template.
        output_path: Absolute or relative filesystem path to write the PDF.
        base_url: Base URL so WeasyPrint can resolve relative asset URLs.
        css_path: Optional filesystem path to a CSS file; if not provided, an
            inline minimal @page rule will be applied for A4 + margins.
    """
    html = render_template("evaluation/report_card.html", data=data)

    stylesheets = []
    if css_path and Path(css_path).is_file():
        stylesheets.append(CSS(filename=str(css_path)))
    else:
        stylesheets.append(CSS(string="""@page { size: A4; margin: 14mm }"""))

    HTML(string=html, base_url=base_url).write_pdf(target=str(output_path), stylesheets=stylesheets)


