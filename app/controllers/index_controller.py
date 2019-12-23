from flask import Blueprint, render_template
from config import REACT_CONFIGS

mod_index = Blueprint('index', __name__)

@mod_index.route('/', methods=["GET","POST"])
def root():

    return render_template('index.html', REACT_CONFIGS=REACT_CONFIGS)