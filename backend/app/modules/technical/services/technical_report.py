from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet
from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image
from fastapi import HTTPException, status
from typing import Optional
from pathlib import Path
from openpyxl.utils import get_column_letter
import io
import re


# TITLES
def change_meter_title():
    return "CHANGE METER (METER DEFECT / BURNED METER/ ZERO READING / OLD METER)"


def new_connection():
    return "NEW CONNECTION (MAGNA CARTA / SEP-BLEP / Owned Meter)"


def changemeter_column_header(
    ws: Worksheet,
    columns,
    header_font,
    center_align,
    thin_border,
):

    ws["D4"] = "PULLOUT METER"
    ws["F4"] = "NEW METER"

    top_col_merge = [[4, 5], [6, 7, 8, 9]]
    for col_idx in top_col_merge:
        ws.merge_cells(
            start_row=4,
            end_row=4,
            start_column=col_idx[0],
            end_column=col_idx[-1],
        )

        for col in col_idx:
            cell = ws.cell(row=4, column=col)
            cell.border = Border(
                left=Side(style="thin"),
                right=Side(style="thin"),
                top=Side(style="thin"),
                bottom=Side(style=None),
            )

    # Columns spanning rows 4 and 5
    merged_columns = [1, 2, 3, 10, 11, 12]

    for col_idx in merged_columns:
        ws.merge_cells(
            start_row=4,
            end_row=5,
            start_column=col_idx,
            end_column=col_idx,
        )
        for row_idx in (4, 5):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = Border(
                left=Side(style="thin"),
                right=Side(style="thin"),
                top=Side(style="thin") if row_idx == 4 else Side(style=None),
                bottom=Side(style="thin") if row_idx == 5 else Side(
                    style=None),
            )

    # Style group headers
    for cell_ref in ("D4", "F4"):
        cell = ws[cell_ref]
        cell.font = header_font
        cell.alignment = center_align
        cell.border = Border(
            left=Side(style="thin"),
            right=Side(style="thin"),
            top=Side(style="thin"),
            bottom=Side(style="thin"),
        )
    # Write and style column headers
    for col_idx, col_name in enumerate(columns, start=1):
        if col_idx in merged_columns:
            # Write to the top-left cell of the merged range
            cell = ws.cell(row=4, column=col_idx, value=col_name)
            cell.font = header_font
            cell.alignment = center_align
            cell.border = thin_border
        else:
            cell = ws.cell(row=5, column=col_idx, value=col_name)
            cell.font = header_font
            cell.alignment = center_align
            cell.border = thin_border


def new_connection_column_header(ws: Worksheet, columns, header_font, center_align, thin_border):
    for col_idx, col_name in enumerate(columns, start=1):
        cell = ws.cell(row=5, column=col_idx, value=col_name)
        cell.font = header_font
        cell.alignment = center_align
        cell.border = thin_border
    ws['E4'] = 'NEW METER'
    
    ws.merge_cells(
       start_row=4,
       end_row=4,
       start_column=5,
       end_column=9        
    )
    cell = ws["E4"]
    cell.font = header_font
    cell.alignment = center_align

    
    top_column = [4, 5, 6, 7, 8, 9]
    for col_idx in top_column:
        cell = ws.cell(row=4, column=col_idx)
        cell.border = Border(
            left=Side(style="thin"),
            right=Side(style="thin"),
            top=Side(style="thin"),
            bottom=Side(style=None),
        )
        
    # MERGE ROWS
    merged_columns = [1,2,3,4,10]
    for col_idx in merged_columns:
        ws.merge_cells(
            start_row=4,
            end_row=5,
            start_column=col_idx,
            end_column=col_idx,
        )
        for row_idx in (4, 5):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = Border(
                left=Side(style="thin"),
                right=Side(style="thin"),
                top=Side(style="thin") if row_idx == 4 else Side(style=None),
                bottom=Side(style="thin") if row_idx == 5 else Side(
                    style=None),
            )
    for col_idx, col_name in enumerate(columns, start=1):
            if col_idx in merged_columns:
                # Write to the top-left cell of the merged range
                cell = ws.cell(row=4, column=col_idx, value=col_name)
                cell.font = header_font
                cell.alignment = center_align
                cell.border = thin_border
            else:
                cell = ws.cell(row=5, column=col_idx, value=col_name)
                cell.font = header_font
                cell.alignment = center_align
                cell.border = thin_border

def create_technical_report(
    columns: list,
    rows: list,
    prepare_name: Optional[str],
    prepare_position: Optional[str],
    check_name: Optional[str],
    check_position: Optional[str],
    approve_name: Optional[str],
    approve_position: Optional[str],
    title: Optional[str]
):
    # -----------------------------
    # Prepare Data
    # --------------------------------
    wb = Workbook()

    ws = wb.active

    if ws is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No data available for report")

    ws.title = title

    image_path = Path(__file__).resolve().parent.parent / \
        "static" / "biselco-header.png"
    img = Image(image_path)
    img.width = 720
    img.height = 70

    # -----------------------------
    # Styles
    # -----------------------------
    title_font = Font(size=16, bold=True)
    header_font = Font(bold=True, size=12)
    center_align = Alignment(horizontal="center", vertical="center")
    left_align = Alignment(horizontal="left", vertical="center")
    data_font = Font(size=12)
    thin_border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )
    center_column = ((len(columns)) // 2) - 1
    # Give the image enough vertical space
    ws.row_dimensions[1].height = 55
    ws.row_dimensions[2].height = 20

    # HEADER
    ws.merge_cells(start_row=1, start_column=1,
                   end_row=1, end_column=len(columns))
    ws.add_image(img, f"{get_column_letter(center_column)}1")

    # -----------------------------
    # Title
    # -----------------------------

    if re.match("CHANGE METER", title):
        ws["A2"] = change_meter_title()
    elif re.match("NEW CONNECTION", title):
        ws["A2"] = new_connection()
    ws["A2"].font = title_font
    ws["A2"].alignment = center_align
    ws.merge_cells(start_row=2, start_column=1,
                   end_row=3, end_column=len(columns))
    # -----------------------------
    # Header Row
    # -----------------------------
    if re.match("CHANGE METER", title):
        changemeter_column_header(
            ws, columns, header_font, center_align, thin_border)
    elif re.match("NEW CONNECTION", title):
        new_connection_column_header(
            ws, columns, header_font, center_align, thin_border)

    # -----------------------------
    # Data Rows
    # -----------------------------
    for row_idx, row in enumerate(rows, start=6):
        for col_idx, value in enumerate(row, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value)
            center_align_col = [i for i in range(6, len(columns))]
            cell.alignment = center_align if col_idx in center_align_col else left_align
            cell.border = thin_border
            cell.font = data_font

    # PREPARED BY
    ws.merge_cells(start_row=len(rows) + 2 + 6, start_column=1,
                   end_row=len(rows) + 2 + 6, end_column=2)
    prepared_by = ws.cell(row=len(rows) + 6 + 2,
                          column=1, value="Prepared by:")
    prepared_by.alignment = left_align

    # PREPARED NAME
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 2, start_column=1,
                   end_row=len(rows) + 2 + 6 + 2, end_column=2)
    prepared_name = ws.cell(row=len(rows) + 6 + 2 + 2,
                            column=1, value=prepare_name)
    prepared_name.alignment = center_align
    prepared_name.font = Font(size=12, bold=True, underline="single")

    # PREPARED POSITION
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 3, start_column=1,
                   end_row=len(rows) + 2 + 6 + 3, end_column=2)
    prepared_position = ws.cell(
        row=len(rows) + 6 + 2 + 3, column=1, value=prepare_position)
    prepared_position.alignment = center_align

    # CHECKED BY
    ws.merge_cells(start_row=len(rows) + 2 + 6, start_column=6,
                   end_row=len(rows) + 2 + 6, end_column=7)
    ws.cell(row=len(rows) + 6 + 2, column=6, value="Checked by:")

    # CHECKED BY NAME
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 2, start_column=6,
                   end_row=len(rows) + 2 + 6 + 2, end_column=7)
    checked_name = ws.cell(row=len(rows) + 6 + 2 + 2,
                           column=6, value=check_name)
    checked_name.alignment = center_align
    checked_name.font = Font(size=12, bold=True, underline="single")

    # CHECKED BY POSITION
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 3, start_column=6,
                   end_row=len(rows) + 2 + 6 + 3, end_column=7)
    checked_position = ws.cell(
        row=len(rows) + 6 + 2 + 3, column=6, value=check_position)
    checked_position.alignment = center_align

    # Approved BY
    ws.merge_cells(start_row=len(rows) + 2 + 6, start_column=10,
                   end_row=len(rows) + 2 + 6, end_column=11)
    ws.cell(row=len(rows) + 6 + 2, column=10, value="Approved by:")

    # APPROVED BY NAME
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 2, start_column=10,
                   end_row=len(rows) + 2 + 6 + 2, end_column=11)
    approved_name = ws.cell(row=len(rows) + 6 + 2 + 2,
                            column=10, value=approve_name)
    approved_name.alignment = center_align
    approved_name.font = Font(size=12, bold=True, underline="single")

    # APPROVED BY POSITION
    ws.merge_cells(start_row=len(rows) + 2 + 6 + 3, start_column=10,
                   end_row=len(rows) + 2 + 6 + 3, end_column=11)
    approved_position = ws.cell(
        row=len(rows) + 6 + 2 + 3, column=10, value=approve_position)
    approved_position.alignment = center_align

    # -----------------------------
    # Auto Column Width
    # -----------------------------
    for col_idx, col in enumerate(columns, start=1):
        max_length = len(col)
        for row in rows:
            try:
                max_length = max(max_length, len(str(row[col_idx - 1])))
            except:
                pass
        ws.column_dimensions[get_column_letter(col_idx)].width = max_length + 2
    # -----------------------------
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.orientation = ws.ORIENTATION_LANDSCAPE

    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = False

    ws.page_margins.left = 0.5
    ws.page_margins.right = 0.5
    ws.page_margins.top = 0.75
    ws.page_margins.bottom = 0.75

  # Print area
    ws.print_title_rows = "1:3"  # repeat header on every page
    # -----------------------------
    # Save
    # -----------------------------
    file_stream = io.BytesIO()
    wb.save(file_stream)
    file_stream.seek(0)

    return file_stream
