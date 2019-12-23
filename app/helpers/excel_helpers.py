from openpyxl.styles.borders import Border, Side
from openpyxl.styles.colors import Color

borders={
    "default":Side(style=None, color=None),
    "thin":Side(style='thin',color=Color(rgb=None,indexed=64,auto=0,theme=None,tint=0.0,type='indexed')),
    "bold":Side(style='medium',color=Color(rgb=None,indexed=64,auto=None,theme=None, tint=0.0,type='indexed')),
    "dashed":Side(style='dashed',color=Color(rgb=None,indexed=64,auto=None,theme=None, tint=0.0,type='indexed'))
}

def setBorderToCell(cell, style={"top":"default", "left":"default", "diagonal":False}):
    """
    Parameters
    ---------------
    cell: <Cell>
        openpxlのセルを表すオブジェクト
    style: dict
        top: セルの上側の線の状態（"default" or "thin" or "bold" or "dashed"）
        left: セルの左側の線の状態（"default" or "thin" or "bold" or "dashed"）
        diagonal: 斜線を入れるかどうか（bool）
    """

    b = Border( top=borders[style["top"]], left=borders[style["left"]] )

    # 斜線を入れる
    if style["diagonal"]:

        b.outline=True
        b.diagonalUp=False
        b.diagonalDown=True
        b.start=None
        b.end=None

        dgColor = Color(rgb=None,indexed=64,auto=None,theme=None,tint=0.0,type='indexed')
        b.diagonal = Side(style='thin',color=dgColor)
    
    # セルに罫線を入れる
    cell.border = b
